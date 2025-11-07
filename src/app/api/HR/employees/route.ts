import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { updateEmployeeMonthlySummary } from "../updateEmployeeSummary/route";

export async function GET() {
  try {
    const client = await pool.connect();

    const res = await client.query(
      `SELECT 
        id,
        name,
        phone,
        address,
        start_date,
        end_date,
        salary,
        is_active
       FROM employees
       ORDER BY id ASC;
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
    const body = await req.json();
    const { name, phone, address, start_date, end_date, salary, is_active } =
      body;

    const res = await client.query(
      `INSERT INTO employees (name, phone, address, start_date, end_date, salary, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, phone, address, start_date, end_date, salary, is_active],
    );

    client.release();
await updateEmployeeMonthlySummary(res.rows[0].id, start_date, end_date);
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
