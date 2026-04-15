import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { updateEmployeeMonthlySummary } from "@/lib/hrSummary";


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const client = await pool.connect();
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { employee_id, amount, date, note } = body;

    // جلب بيانات المسحوبة القديمة
    const oldRes = await client.query(
      `SELECT employee_id, amount, date FROM employee_withdrawals WHERE id=$1`,
      [id]
    );
    if (oldRes.rows.length === 0) {
      return NextResponse.json({ error: "المسحوبة غير موجودة" }, { status: 404 });
    }

    const oldEmployeeId = oldRes.rows[0].employee_id;
    const oldAmount = Number(oldRes.rows[0].amount);
    const oldDate = oldRes.rows[0].date;

    // تحديث الملخص للموظف الجديد قبل التحقق
    await updateEmployeeMonthlySummary(employee_id, date);
    const monthStr = new Date(date).toISOString().slice(0, 7); // YYYY-MM

    const summaryRes = await client.query(
      `SELECT remaining_salary FROM employee_monthly_summary
       WHERE employee_id=$1 AND month=$2`,
      [employee_id, monthStr]
    );
    let remaining_salary = Number(summaryRes.rows[0]?.remaining_salary || 0);

    // إضافة قيمة المسحوبة القديمة إذا كان نفس الموظف ونفس الشهر
    if (oldEmployeeId === employee_id && oldDate.toISOString().slice(0, 7) === monthStr) {
      remaining_salary += oldAmount;
    }

    if (amount > remaining_salary) {
      return NextResponse.json({ error: "المسحوبة أكبر من الراتب المتبقي" }, { status: 400 });
    }

    // تحديث المسحوبة
    const res = await client.query(
      `UPDATE employee_withdrawals
       SET employee_id=$1, amount=$2, date=$3, note=$4
       WHERE id=$5
       RETURNING *`,
      [employee_id, amount, date, note, id]
    );

    // تحديث الملخص للموظف القديم
    await updateEmployeeMonthlySummary(oldEmployeeId, oldDate);

    // إذا تغير الموظف أو الشهر، تحديث الملخص للموظف الجديد
    if (oldEmployeeId !== employee_id || oldDate.toISOString().slice(0,7) !== monthStr) {
      await updateEmployeeMonthlySummary(employee_id, date);
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const client = await pool.connect();
  try {
    const id = Number(params.id);

    // جلب المسحوبة قبل الحذف
    const resOld = await client.query(`SELECT employee_id, date FROM employee_withdrawals WHERE id=$1`, [id]);
    if (resOld.rows.length === 0) {
      return NextResponse.json({ error: "المسحوبة غير موجودة" }, { status: 404 });
    }
    const { employee_id, date } = resOld.rows[0];

    // حذف المسحوبة
    await client.query(`DELETE FROM employee_withdrawals WHERE id=$1`, [id]);

    // تحديث الملخص
    await updateEmployeeMonthlySummary(employee_id, date);

    return NextResponse.json({ message: "تم حذف المسحوبة بنجاح" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    client.release();
  }
}
