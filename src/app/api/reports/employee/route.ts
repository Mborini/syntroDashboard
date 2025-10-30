// src/app/api/employeeSummary/route.ts
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();
    const res = await client.query(`
      SELECT 
        e.name AS employee_name,
        e.salary,
        s.month,
        s.total_work_hours,
        s.overtime_hours,
        s.missing_hours,
        s.total_leaves,
        s.total_withdrawals,
        s.remaining_salary
      FROM employee_monthly_summary s
      JOIN employees e ON e.id = s.employee_id
      ORDER BY s.month DESC;
    `);
    client.release();
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Error fetching employee summary:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
