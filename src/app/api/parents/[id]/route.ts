// src/app/api/parents/[id]/route.ts
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();
    const id = params.id;
    const data = await req.json();
    const { name, phone_number, is_active, password } = data;

    // ✅ تحقق من الاسم موجود عند غيره
    const nameExists = await client.query(
      `SELECT id FROM parents WHERE name = $1 AND id != $2`,
      [name, id]
    );
    if (nameExists.rows.length > 0) {
      client.release();
      return NextResponse.json({ error: "Name already exists" }, { status: 400 });
    }

    // ✅ تحقق من الرقم موجود عند غيره
    const phoneExists = await client.query(
      `SELECT id FROM parents WHERE phone_number = $1 AND id != $2`,
      [phone_number, id]
    );
    if (phoneExists.rows.length > 0) {
      client.release();
      return NextResponse.json({ error: "Phone number already exists" }, { status: 400 });
    }

    const res = await client.query(
      `UPDATE parents 
       SET name = $1, phone_number = $2, is_active = $3, role_id = $4
       WHERE id = $5
       RETURNING id, name, phone_number, is_active`,
      [name, phone_number, is_active, 4, id]
    );

    client.release();

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
// src/app/api/parents/[id]/route.ts
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();
    const id = params.id;

    const res = await client.query(
      `DELETE FROM parents WHERE id = $1 RETURNING id, name, phone_number`,
      [id]
    );

    client.release();

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Parent deleted successfully" }, { status: 200 });
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
      `UPDATE parents
       SET is_active = $1
       WHERE id = $2
       RETURNING id, name, phone_number, is_active`,
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
