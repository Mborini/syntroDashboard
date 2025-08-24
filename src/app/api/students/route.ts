import pool from "@/lib/db";
import { CreateStudentDTO } from "@/types/student";
import { CreateUserDTO } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();
    const res = await client.query(
      `SELECT s.id, s.name, s.is_active, sec.name as section_name, c.name as class_name , c.id as class_id , sec.id as section_id
       FROM students s
       inner join sections sec on s.section_id = sec.id
       inner join classes c on sec.class_id = c.id
       ORDER BY s.id ASC
       `
    );
    client.release();
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const client = await pool.connect();
    const data: CreateStudentDTO = await req.json();

    const res = await client.query(
      `INSERT INTO students (name, section_id, is_active)
       VALUES ($1, $2, $3)
       RETURNING id, name, section_id, is_active`,
      [data.name, data.section_id, data.is_active]
    );

    client.release();
    
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
