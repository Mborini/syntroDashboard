import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // آخر جزء من الـ path
    if (!id) throw new Error("Class id is required");

    const body = await req.json();
    const { name, academic_year } = body;

    const client = await pool.connect();
    const res = await client.query(
      `UPDATE classes SET name = $1, academic_year_id = $2 WHERE id = $3 RETURNING *`,
      [name, academic_year, id]
    );
    client.release();

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    if (!id) throw new Error("Class id is required");

    const client = await pool.connect();
    await client.query(`DELETE FROM classes WHERE id = $1`, [id]);
    client.release();

    return NextResponse.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
