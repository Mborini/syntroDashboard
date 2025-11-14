import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { updateEmployeeMonthlySummary } from "@/lib/hrSummary";
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const leaveId = Number(params.id);
  const { date, reason, employee_id: newEmployeeId } = await req.json();

  if (!date || !reason) {
    return NextResponse.json(
      { message: "الرجاء تعبئة التاريخ والسبب" },
      { status: 400 }
    );
  }

  const client = await pool.connect();
  try {
    // الحصول على الموظف القديم
    const leaveRes = await client.query(
      `SELECT employee_id, date FROM leaves WHERE id = $1`,
      [leaveId]
    );
    if (leaveRes.rows.length === 0) {
      return NextResponse.json({ message: "الإجازة غير موجودة" }, { status: 404 });
    }
    const oldEmployeeId = leaveRes.rows[0].employee_id;
    const oldDate = leaveRes.rows[0].date;

    // تحديث الإجازة
    const res = await client.query(
      `UPDATE leaves
       SET employee_id = $1, date = $2, reason = $3
       WHERE id = $4
       RETURNING *`,
      [newEmployeeId, date, reason, leaveId]
    );

    // تحديث ملخص الشهر للموظف القديم والجديد
    await updateEmployeeMonthlySummary(oldEmployeeId, oldDate); // الموظف القديم
    await updateEmployeeMonthlySummary(newEmployeeId, date);   // الموظف الجديد

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "فشل في تحديث الإجازة" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const leaveId = Number(params.id);

  const client = await pool.connect();
  try {
    // الحصول على employee_id و date للإجازة قبل الحذف
    const leaveRes = await client.query(
      `SELECT employee_id, date FROM leaves WHERE id = $1`,
      [leaveId]
    );

    if (leaveRes.rows.length === 0) {
      return NextResponse.json({ message: "الإجازة غير موجودة" }, { status: 404 });
    }

    const employee_id = leaveRes.rows[0].employee_id;
    const date = leaveRes.rows[0].date;

    await client.query(`DELETE FROM leaves WHERE id = $1`, [leaveId]);

    // تحديث ملخص الشهر للموظف
    await updateEmployeeMonthlySummary(employee_id, date);

    return NextResponse.json({ message: "تم حذف الإجازة بنجاح" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "فشل في حذف الإجازة" }, { status: 500 });
  } finally {
    client.release();
  }
}

