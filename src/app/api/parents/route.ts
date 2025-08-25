import pool from "@/lib/db";
import { CreateParentDTO } from "@/types/parent";
import { CreateStudentDTO } from "@/types/student";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();
    const res = await client.query(
      `SELECT p.id, p.name, p.is_active ,p.phone_number
       FROM parents p
       ORDER BY p.id ASC
       `,
    );
    client.release();
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const client = await pool.connect();
    const data: CreateParentDTO = await req.json();

    // ✅ check if name already exists
    const nameExists = await client.query(
      `SELECT id FROM parents WHERE name = $1`,
      [data.name]
    );
    if (nameExists.rows.length > 0) {
      client.release();
      return NextResponse.json(
        { error: "Name already exists" },
        { status: 400 }
      );
    }

    // ✅ check if phone already exists
    const phoneExists = await client.query(
      `SELECT id FROM parents WHERE phone_number = $1`,
      [data.phone_number]
    );
    if (phoneExists.rows.length > 0) {
      client.release();
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }

    // ✅ insert new parent
    const res = await client.query(
      `INSERT INTO parents (name, phone_number, is_active, password,role_id)
       VALUES ($1, $2, $3,$4,$5)
       RETURNING id, name, phone_number, is_active`,
      [data.name, data.phone_number, data.is_active, data.password,4]
    );

    client.release();

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
