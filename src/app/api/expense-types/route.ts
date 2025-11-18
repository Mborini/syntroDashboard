import pool from "@/lib/db";
import { NextResponse } from "next/server";

// ===== GET جميع أنواع المصاريف =====
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM expenses_types ORDER BY id ASC;");
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET expenses_types error:", error);
    return NextResponse.json({ error: "Failed to fetch expense types" }, { status: 500 });
  }
}

// ===== POST إضافة نوع مصروف =====
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    const client = await pool.connect();
    await client.query(
      "INSERT INTO expenses_types (name) VALUES ($1);",
      [name]
    );
    client.release();

    return NextResponse.json({ message: "Expense type created" });
  } catch (error) {
    console.error("POST expenses_types error:", error);
    return NextResponse.json({ error: "Failed to create expense type" }, { status: 500 });
  }
}
