import pool from "@/lib/db";
import { CreateStudentDTO } from "@/types/student";
import { CreateUserDTO } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();
    const res = await client.query(
      `SELECT 
    s.id AS student_id,
    s.name  ,
    s.is_active,
    sec.name AS section_name,
    c.name AS class_name,
    c.id AS class_id,
    sec.id AS section_id,
    ss.academic_year_id,
    ss.semester_id
FROM students s
LEFT JOIN student_section ss ON s.id = ss.student_id
LEFT JOIN sections sec ON ss.section_id = sec.id
LEFT JOIN classes c ON ss.class_id = c.id
ORDER BY s.id ASC;

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
  const client = await pool.connect();
  try {
    const data: CreateStudentDTO = await req.json();
    const { name, class_id, section_id, academic_year_id, semester_id, is_active } = data;

    // أولاً: إضافة الطالب في جدول students
    const studentRes = await client.query(
      `INSERT INTO students (name, is_active)
       VALUES ($1, $2)
       RETURNING id, name, is_active`,
      [name, is_active]
    );

    const studentId = studentRes.rows[0].id;

    // ثانياً: ربط الطالب بالصف + الشعبة + السنة + الفصل في student_section
    await client.query(
      `INSERT INTO student_section (student_id, class_id, section_id, academi424.c_year_id, semester_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [studentId, class_id, section_id, academic_year_id, semester_id]
    );

    return NextResponse.json(studentRes.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    client.release();
  }
}
