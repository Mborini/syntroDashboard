import pool from "@/lib/db";
import { NextResponse } from "next/server";

// route.ts
export async function GET(
  req: Request,
  { params }: { params: { yearId: string } }
) {
  const { yearId } = params;

  const client = await pool.connect();
   const res = await client.query(
  `
  SELECT s.id, s.name, s.academic_year_id
  FROM semesters AS s
  WHERE s.academic_year_id = $1::int
  ORDER BY s.id ASC
  `,
  [yearId]
);
console.log("Database query result:", res.rows); // تحقق من نتائج الاستعلام
  client.release();
  return NextResponse.json(res.rows);
}
