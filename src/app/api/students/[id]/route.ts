import pool from "@/lib/db";
import { UpdateStudentDTO } from "@/types/student";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data : UpdateStudentDTO = await req.json();

    const client = await pool.connect();
    const res = await client.query(
      `UPDATE students
       SET name = $1, section_id = $2, is_active = $3
       WHERE id = $4
       RETURNING id, name, section_id, is_active`,
      [data.name, data.section_id, data.is_active, id]
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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { is_active } = await req.json();

    const client = await pool.connect();
    const res = await client.query(
      `UPDATE students
       SET is_active = $1
       WHERE id = $2
       RETURNING id, name, section_id, is_active`,
      [is_active, id]
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const client = await pool.connect();
    const res = await client.query(
      `DELETE FROM students
       WHERE id = $1
       RETURNING id, name`,
      [id]
    );
    client.release();

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
