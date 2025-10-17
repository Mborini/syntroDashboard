// app/api/withdrawals/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const client = await pool.connect();
    const res = await client.query(
      `SELECT w.id, w.employee_id, e.name AS employee_name, w.amount, w.date, w.note
       FROM employee_withdrawals w
       JOIN employees e ON w.employee_id = e.id
       ORDER BY w.date DESC`
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
    const body = await req.json();
    const { employee_id, amount, date, note } = body;

    const res = await client.query(
      `INSERT INTO employee_withdrawals (employee_id, amount, date, note)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [employee_id, amount, date, note]
    );

    client.release();
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
