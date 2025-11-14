import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { updateEmployeeMonthlySummary } from "@/lib/hrSummary";

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
  const client = await pool.connect();
  try {
    const body = await req.json();
    const { employee_id, amount, date, note } = body;

    // حساب الملخص أولاً
    await updateEmployeeMonthlySummary(employee_id, date);
  const monthStr = new Date(date).toISOString().slice(0,7); // يعطي 'YYYY-MM'

const summaryRes = await client.query(
  `SELECT remaining_salary FROM employee_monthly_summary
   WHERE employee_id=$1 AND month=$2`,
  [employee_id, monthStr]
);
    const remaining_salary = Number(summaryRes.rows[0]?.remaining_salary || 0);

    if (amount > remaining_salary) {
      return NextResponse.json({ error: "المسحوبة أكبر من الراتب المتبقي" }, { status: 400 });
    }

    // إدخال المسحوبة
    const res = await client.query(
      `INSERT INTO employee_withdrawals (employee_id, amount, date, note)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [employee_id, amount, date, note]
    );

    await updateEmployeeMonthlySummary(employee_id, date);
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    client.release();
  }
}
