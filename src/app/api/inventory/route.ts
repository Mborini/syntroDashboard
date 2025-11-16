import pool from "@/lib/db";
import { NextResponse } from "next/server";
// ✅ جلب كل أصناف المبيعات
export async function GET() {
  try {
    const result =
      await pool.query(`SELECT  i.item_id, i.quantity, p.name, p.weight
      FROM inventory i
      JOIN purchase_items p ON i.item_id = p.id
      where i.quantity > 0
      ORDER BY p.name ASC;`);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching sales items:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales items" },
      { status: 500 },
    );
  }
}
