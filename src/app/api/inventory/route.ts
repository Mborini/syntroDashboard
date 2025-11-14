// app/api/inventory/route.ts
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();

    // جلب جميع الأصناف الموجودة في المخزون مع معلوماتها
    const res = await client.query(`
      SELECT 
        i.item_id,
        i.quantity,
        p.name,
        p.weight
      FROM inventory i
      JOIN purchase_items p ON i.item_id = p.id
      where i.quantity > 0
      ORDER BY p.name ASC;
      
    `);

    client.release();
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("❌ GET Inventory Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
