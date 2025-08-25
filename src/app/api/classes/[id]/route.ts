import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid class id" }, { status: 400 });
  }

  try {
    const { name, academic_year } = await req.json();

    const client = await pool.connect();
    try {
      const res = await client.query(
        `UPDATE classes SET name = $1, academic_year_id = $2 WHERE id = $3 RETURNING *`,
        [name, academic_year, id]
      );
      if (res.rows.length === 0) {
        return NextResponse.json({ error: "Class not found" }, { status: 404 });
      }
      return NextResponse.json(res.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid class id" }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    try {
      const res = await client.query(`DELETE FROM classes WHERE id = $1 RETURNING *`, [id]);
      if (res.rows.length === 0) {
        return NextResponse.json({ error: "Class not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "Class deleted successfully" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
