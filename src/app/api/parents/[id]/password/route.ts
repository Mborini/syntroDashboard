import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { password } = await req.json();

    const client = await pool.connect();
    const res = await client.query(
      `UPDATE parents
       SET password = $1
       WHERE id = $2
       RETURNING id, name, phone_number, is_active`,
      [password, id]
    );
    client.release();

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}