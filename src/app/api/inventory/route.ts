export const dynamic = "force-dynamic";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT i.item_id, i.quantity, p.name, p.weight
      FROM inventory i
      JOIN purchase_items p ON i.item_id = p.id
      WHERE i.quantity > 0
      ORDER BY p.name ASC;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
