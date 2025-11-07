import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* 🔵 تعديل دفعة */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const { employee_id, amount, month, notes } = await req.json();

    if (!id || !employee_id || !amount || !month) {
      return NextResponse.json({ message: "الحقول المطلوبة غير مكتملة!" }, { status: 400 });
    }

    const client = await pool.connect();
    await client.query(
      `UPDATE payroll
       SET employee_id = $1, amount = $2, month = $3, notes = $4
       WHERE id = $5`,
      [employee_id, amount, month, notes, id]
    );
    client.release();

    return NextResponse.json({ message: "تم تعديل الدفعة بنجاح" });
  } catch (error) {
    console.error("Error updating payroll:", error);
    return NextResponse.json({ message: "فشل في تعديل الدفعة" }, { status: 500 });
  }
}

/* 🔴 حذف دفعة */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ message: "معرف الدفعة غير صالح!" }, { status: 400 });
    }

    const client = await pool.connect();
    await client.query(`DELETE FROM payroll WHERE id = $1`, [id]);
    client.release();

    return NextResponse.json({ message: "تم حذف الدفعة بنجاح" });
  } catch (error) {
    console.error("Error deleting payroll:", error);
    return NextResponse.json({ message: "فشل في حذف الدفعة" }, { status: 500 });
  }
}
