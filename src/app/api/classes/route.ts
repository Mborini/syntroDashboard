import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();
    const res = await client.query(
  `SELECT c.id, c.name, c.academic_year_id, y.year AS academic_year
   FROM classes AS c
   JOIN academic_years AS y ON c.academic_year_id = y.id
   ORDER BY c.id ASC;`
);

    client.release();

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, academic_year } = body;

    const client = await pool.connect();
    const res = await client.query(
      `INSERT INTO classes (name, academic_year_id) VALUES ($1, $2) RETURNING *`,
      [name, academic_year]
    );
    client.release();

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
