import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { updateEmployeeMonthlySummary } from "../../updateEmployeeSummary/route";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const attendanceId = Number(params.id);
  const { check_in, check_out } = await req.json();

  if (!check_in && !check_out) {
    return NextResponse.json({ message: "الرجاء إرسال وقت الدخول أو الانصراف" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const { rows } = await client.query(`SELECT * FROM attendance WHERE id = $1`, [attendanceId]);
    if (!rows.length) return NextResponse.json({ message: "السجل غير موجود" }, { status: 404 });

    const record = rows[0];
    const finalCheckIn = check_in || record.check_in;
    const finalCheckOut = check_out || record.check_out;

    let total_hours = 0;
    let overtime_hours = 0;
    let missing_hours = 0;
    let status = "متأخر"; // الافتراضي متأخر
const daily_official_hours = 9; // الدوام الرسمي لكل يوم

    if (finalCheckIn && finalCheckOut) {
      const inParts = finalCheckIn.split(":").map(Number);
      const outParts = finalCheckOut.split(":").map(Number);

      const inDate = new Date();
      inDate.setHours(inParts[0], inParts[1], 0, 0);

      const outDate = new Date();
      outDate.setHours(outParts[0], outParts[1], 0, 0);

      total_hours = (outDate.getTime() - inDate.getTime()) / 3600000;

     if (total_hours > daily_official_hours) {
  overtime_hours = total_hours - daily_official_hours;
  status = "وقت إضافي";
} else if (total_hours === daily_official_hours) {
  status = "حاضر";
} else {
  missing_hours = daily_official_hours - total_hours;
  status = "متأخر";
}

    }

    const updateRes = await client.query(
      `UPDATE attendance
       SET check_in = $1,
           check_out = $2,
           total_hours = $3,
           overtime_hours = $4,
           missing_hours = $5,
           status = $6
       WHERE id = $7
       RETURNING *`,
      [finalCheckIn, finalCheckOut, total_hours, overtime_hours, missing_hours, status, attendanceId]
    );
await updateEmployeeMonthlySummary(record.employee_id, record.date);

    return NextResponse.json(updateRes.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "فشل في تحديث السجل" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const attendanceId = Number(params.id);
  const client = await pool.connect();
  try {
    // استعلام للحصول على السجل قبل الحذف
    const { rows } = await client.query(`SELECT employee_id, date FROM attendance WHERE id = $1`, [attendanceId]);
    if (!rows.length) return NextResponse.json({ message: "السجل غير موجود" }, { status: 404 });

    const { employee_id, date } = rows[0];

    // حذف السجل
    await client.query(`DELETE FROM attendance WHERE id = $1`, [attendanceId]);

    // تحديث ملخص الموظف للشهر
    await updateEmployeeMonthlySummary(employee_id, date);

    return NextResponse.json({ message: "تم حذف السجل بنجاح" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "فشل في حذف السجل" }, { status: 500 });
  } finally {
    client.release();
  }
}

