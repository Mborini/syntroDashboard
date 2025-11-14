// src/app/api/HR/updateEmployeeSummary/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * دالة لحساب وتحديث الملخص الشهري للموظف
 */
async function updateEmployeeMonthlySummary(
  employee_id: number,
  start_date: string | Date,
  end_date?: string | Date
) {
  const client = await pool.connect();
  try {
    const start = new Date(start_date);
    const end = end_date ? new Date(end_date) : new Date();

    // إنشاء قائمة الأشهر بين start و end
    const months: string[] = [];
    const current = new Date(start);
    while (current <= end) {
      months.push(current.toISOString().slice(0, 7)); // YYYY-MM
      current.setMonth(current.getMonth() + 1);
    }

    // حذف الأشهر التي لم تعد ضمن الفترة
    await client.query(
      `DELETE FROM employee_monthly_summary 
       WHERE employee_id = $1 
       AND month NOT IN (${months.map((_, i) => `$${i + 2}`).join(",")})`,
      [employee_id, ...months]
    );

    // جلب الراتب الأساسي
    const empRes = await client.query(
      `SELECT salary FROM employees WHERE id = $1`,
      [employee_id]
    );
    const base_salary = Number(empRes.rows[0]?.salary || 0);

    // المرور على كل شهر
    for (const month of months) {
      // مجموع السحوبات
      const withdrawalsRes = await client.query(
        `SELECT COALESCE(SUM(amount),0) AS total
         FROM employee_withdrawals
         WHERE employee_id = $1 AND TO_CHAR(date, 'YYYY-MM') = $2`,
        [employee_id, month]
      );
      const total_withdrawals = Number(withdrawalsRes.rows[0].total);

      // بيانات الحضور
      const attRes = await client.query(
        `SELECT
          COALESCE(SUM(total_hours),0) AS total_hours,
          COALESCE(SUM(overtime_hours),0) AS overtime,
          COALESCE(SUM(missing_hours),0) AS missing
         FROM attendance
         WHERE employee_id = $1 AND TO_CHAR(date, 'YYYY-MM') = $2`,
        [employee_id, month]
      );

      const total_work_hours = Number(attRes.rows[0].total_hours);
      const overtime_hours = Number(attRes.rows[0].overtime);
      const missing_hours = Number(attRes.rows[0].missing);

      // حساب الأيام في الشهر
      const [year, monthNum] = month.split("-").map(Number);
      const daysInMonth = new Date(year, monthNum, 0).getDate();
      const official_monthly_hours = daysInMonth * 9; // 9 ساعات يومية
      const hourly_rate = base_salary / official_monthly_hours;

      // الإجازات
      const leavesRes = await client.query(
        `SELECT COUNT(*) AS leave_count
         FROM leaves
         WHERE employee_id = $1 AND TO_CHAR(date, 'YYYY-MM') = $2`,
        [employee_id, month]
      );
      const leave_count = Number(leavesRes.rows[0].leave_count || 0);
      const unpaid_leave_days = leave_count > 2 ? leave_count - 2 : 0;
      const leave_deduction =
        Math.round((unpaid_leave_days * 9 * hourly_rate + Number.EPSILON) * 100) / 100;

      // الحسميات والإضافات
      const missing_deduction =
        Math.round((missing_hours * hourly_rate + Number.EPSILON) * 100) / 100;
      const overtime_bonus =
        Math.round((overtime_hours * 1.5 + Number.EPSILON) * 100) / 100;

      const remaining_salary = Math.round(
        (base_salary - missing_deduction - leave_deduction + overtime_bonus - total_withdrawals + Number.EPSILON) * 100
      ) / 100;

      // إدخال أو تحديث السطر في employee_monthly_summary
      await client.query(
        `INSERT INTO employee_monthly_summary (
           employee_id, month, base_salary, total_withdrawals,
           total_work_hours, overtime_hours, missing_hours,
           total_leaves, remaining_salary, updated_at
         )
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
         ON CONFLICT (employee_id, month)
         DO UPDATE SET
           base_salary = EXCLUDED.base_salary,
           total_withdrawals = EXCLUDED.total_withdrawals,
           total_work_hours = EXCLUDED.total_work_hours,
           overtime_hours = EXCLUDED.overtime_hours,
           missing_hours = EXCLUDED.missing_hours,
           total_leaves = EXCLUDED.total_leaves,
           remaining_salary = EXCLUDED.remaining_salary,
           updated_at = NOW()`,
        [
          employee_id,
          month,
          base_salary,
          total_withdrawals,
          total_work_hours,
          overtime_hours,
          missing_hours,
          leave_count,
          remaining_salary,
        ]
      );
    }
  } catch (error) {
    console.error("❌ updateEmployeeMonthlySummary Error:", error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * دالة POST لاستدعاء API
 */
export async function POST(req: NextRequest) {
  try {
    const { employee_id, start_date, end_date } = await req.json();

    if (!employee_id || !start_date) {
      return NextResponse.json(
        { error: "employee_id و start_date مطلوبين" },
        { status: 400 }
      );
    }

    await updateEmployeeMonthlySummary(employee_id, start_date, end_date);

    return NextResponse.json({ message: "تم التحديث بنجاح" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ أثناء التحديث" }, { status: 500 });
  }
}
