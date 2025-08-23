import pool from "@/lib/db";
import { CreateUserDTO } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

// GET /api/users
export async function GET() {
  try {
    const client = await pool.connect();
    const res = await client.query(
      `SELECT u.id, u.username, u.is_active, u.role_id, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id`
    );
    client.release();
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}


// POST /api/users
export async function POST(req: NextRequest) {
  try {
    const client = await pool.connect();
    const data: CreateUserDTO = await req.json();

    const res = await client.query(
      `INSERT INTO users (username, password, role_id, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, is_active`,
      [data.username, data.password, data.role_id, data.is_active]
    );

    client.release();
    
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
