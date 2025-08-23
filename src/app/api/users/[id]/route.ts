import pool from "@/lib/db";
import { UpdateUserDTO } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

// PUT /api/users/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();
    const data: UpdateUserDTO = await req.json();
    const id = Number(params.id);

    const fields = [];
    const values = [];
    let i = 1;

    if (data.username) { fields.push(`username=$${i++}`); values.push(data.username); }
    if (data.role_id) { fields.push(`role_id=$${i++}`); values.push(data.role_id); }
    if (data.password) { fields.push(`password=$${i++}`); values.push(data.password); }
    if (data.is_active !== undefined) { fields.push(`is_active=$${i++}`); values.push(data.is_active); }

    const res = await client.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id=$${i} RETURNING id, username, is_active, role_id`,
      [...values, id]
    );

    client.release();
    if (res.rows.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE /api/users/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();
    const id = Number(params.id);
    await client.query(`DELETE FROM users WHERE id=$1`, [id]);
    client.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PATCH /api/users/:id/status
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();
    const id = Number(params.id);
    const { is_active } = await req.json();

    const res = await client.query(
      `UPDATE users SET is_active=$1 WHERE id=$2 RETURNING id, username, is_active`,
      [is_active, id]
    );

    client.release();
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
