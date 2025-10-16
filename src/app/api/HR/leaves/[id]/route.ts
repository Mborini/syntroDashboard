import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const leaveId = Number(params.id);
    const { date, reason , employee_id } = await req.json();
    if (!date || !reason) {
        return NextResponse.json(
            { message: "الرجاء تعبئة التاريخ والسبب" },
            { status: 400 }
        );
    }
    const client = await pool.connect();
    const check = await client.query(
  `SELECT id FROM leaves WHERE employee_id = $1 AND date = $2 AND id <> $3`,
  [employee_id, date, leaveId]
);

if (check.rows.length > 0) {
  return NextResponse.json(
    { message: "هذا الموظف لديه إجازة في هذا التاريخ بالفعل" },
    { status: 400 }
  );
}

    try {
        const res =
            await client.query(
                `UPDATE leaves
         SET employee_id = $1, date = $2, reason = $3
         WHERE id = $4
         RETURNING *`,
         [employee_id, date, reason, leaveId]
       );

       return NextResponse.json(res.rows[0]);
     } catch (error) {
       console.error(error);
       return NextResponse.json({ message: "فشل في تحديث الإجازة" }, { status: 500 });
   } finally {
     client.release();
   }
 }

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const leaveId = Number(params.id); // id الإجازة المراد حذفها

  const client = await pool.connect();
  try {
    await client.query(`DELETE FROM leaves WHERE id = $1`, [leaveId]);
    return NextResponse.json({ message: "تم حذف الإجازة بنجاح" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "فشل في حذف الإجازة" }, { status: 500 });
  } finally {
    client.release();
  }
}
