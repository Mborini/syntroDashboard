import pool from "@/lib/db";

export async function updateEmployeeMonthlySummary(employee_id: number, date: string | Date) {
  const client = await pool.connect();
  try {
    const isoDate = typeof date === "string" ? date : date.toISOString();
    const month = isoDate.slice(0, 7); // YYYY-MM

    // الراتب الأساسي
    const empRes = await client.query(
      `SELECT salary FROM employees WHERE id = $1`,
      [employee_id]
    );
    const base_salary = Number(empRes.rows[0]?.salary || 0);

    // مجموع السحوبات
    const withdrawalsRes = await client.query(
      `SELECT COALESCE(SUM(amount),0) AS total
       FROM employee_withdrawals
       WHERE employee_id = $1 AND TO_CHAR(date, 'YYYY-MM') = $2`,
      [employee_id, month]
    );
    const total_withdrawals = Number(withdrawalsRes.rows[0].total);

    // بيانات الحضور الشهرية
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

    // عدد أيام الشهر
    const year = parseInt(month.split("-")[0]);
    const monthNum = parseInt(month.split("-")[1]);
    const daysInMonth = new Date(year, monthNum, 0).getDate();

    // // عدد أيام الدوام (استثناء الجمعة)
    // const workDays = Array.from({ length: daysInMonth }, (_, i) => new Date(year, monthNum - 1, i + 1))
    //   .filter(d => d.getDay() !== 5).length; // 5 = Friday
    // جميع أيام الشهر هي أيام عمل
const workDays = daysInMonth;


    // الساعات الرسمية بالشهر (9 ساعات لكل يوم دوام)
    const official_monthly_hours = workDays * 9;

    // قيمة الساعة بناء على الراتب الشهري
    const hourly_rate = base_salary / official_monthly_hours;

    // عدد أيام الإجازة في الشهر
    const leavesRes = await client.query(
      `SELECT COUNT(*) AS leave_count
       FROM leaves
       WHERE employee_id = $1 AND TO_CHAR(date, 'YYYY-MM') = $2`,
      [employee_id, month]
    );
    const leave_count = Number(leavesRes.rows[0].leave_count || 0);

    // حساب خصم الإجازات بعد أول يومين
    const unpaid_leave_days = leave_count > 2 ? leave_count - 2 : 0;
    const leave_deduction = Math.round((unpaid_leave_days * 9 * hourly_rate + Number.EPSILON) * 100) / 100;

    // حساب الراتب النهائي
    const missing_deduction = Math.round((missing_hours * hourly_rate + Number.EPSILON) * 100) / 100;
    const overtime_bonus = Math.round((overtime_hours * 1.5 + Number.EPSILON) * 100) / 100; // كل ساعة إضافية = 1.5 دينار

    const remaining_salary = Math.round(
      (base_salary - missing_deduction - leave_deduction + overtime_bonus - total_withdrawals + Number.EPSILON) * 100
    ) / 100;

    // حفظ البيانات مع عدد أيام الإجازة
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
        leave_count,  // عدد أيام الإجازة
        remaining_salary,
      ]
    );

  } catch (error) {
    console.error("❌ updateEmployeeMonthlySummary Error:", error);
  } finally {
    client.release();
  }
}
