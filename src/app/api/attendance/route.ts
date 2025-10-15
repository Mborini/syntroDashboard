import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT 
        a.id,
        a.employee_id,
        e.name AS employee_name,
        a.date,
        a.check_in,
        a.check_out,
        a.total_hours,
        a.overtime_hours,
        a.missing_hours,
        a.status,
        a.created_at
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      ORDER BY a.date DESC, e.name
    `);

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  const { employee_id, date, check_in } = await req.json();
  if (!employee_id || !date) {
    return NextResponse.json({ message: "الرجاء إرسال الموظف والتاريخ" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const res = await client.query(
      `INSERT INTO attendance (employee_id, date, check_in)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [employee_id, date, check_in || null]
    );
    return NextResponse.json(res.rows[0]);
  } catch (error: any) {
    console.error(error);
    if (error.code === "23505") {
      return NextResponse.json({ message: "هذا الموظف لديه سجل في نفس اليوم" }, { status: 400 });
    }
    return NextResponse.error();
  } finally {
    client.release();
  }
}
