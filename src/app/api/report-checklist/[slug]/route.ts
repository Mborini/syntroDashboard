import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { reportId: number } }
) {
  try {
    const { reportId } = params;
console.log("GET CHECKLIST REPORT ID:", reportId);
    const result = await pool.query(
      `
      SELECT *
      FROM report_checklist
      WHERE report_id = $1
      LIMIT 1
      `,
      [reportId]
    );
console.log("GET CHECKLIST RESULT:", result.rows);
    return NextResponse.json(result.rows[0] || null);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch checklist" },
      { status: 500 }
    );
  }
}