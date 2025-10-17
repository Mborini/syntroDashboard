// app/api/withdrawals/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { employee_id, amount, date, note } = body;

    const client = await pool.connect();
    const res = await client.query(
      `UPDATE employee_withdrawals
       SET employee_id=$1, amount=$2, date=$3, note=$4
       WHERE id=$5
       RETURNING *`,
      [employee_id, amount, date, note, id]
    );

    client.release();
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "المسحوبة غير موجودة" }, { status: 404 });
    }
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const client = await pool.connect();
    const res = await client.query(`DELETE FROM employee_withdrawals WHERE id=$1 RETURNING *`, [id]);
    client.release();

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "المسحوبة غير موجودة" }, { status: 404 });
    }

    return NextResponse.json({ message: "تم حذف المسحوبة بنجاح" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
