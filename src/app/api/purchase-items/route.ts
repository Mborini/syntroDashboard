import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM purchase_items ORDER BY id ASC;");
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET purchase_items error:", error);
    return NextResponse.json({ error: "Failed to fetch purchase items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, weight, notes } = await req.json();
    const client = await pool.connect();
    await client.query(
      "INSERT INTO purchase_items (name, weight, notes) VALUES ($1, $2, $3);",
      [name, weight, notes]
    );
    client.release();
    return NextResponse.json({ message: "Purchase item created" });
  } catch (error) {
    console.error("POST purchase_items error:", error);
    return NextResponse.json({ error: "Failed to create purchase item" }, { status: 500 });
  }
}
