import pool from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s.sale_price,
        s.weight,
        COALESCE(SUM(w.quantity), 0) AS available_quantity
      FROM sales_items s
      LEFT JOIN warehouse w ON w.sales_item_id = s.id
      GROUP BY s.id, s.name, s.sale_price, s.weight
      HAVING COALESCE(SUM(w.quantity), 0) > 0
      ORDER BY s.id DESC
    `);

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error("Error fetching sales items with warehouse quantity:", error);
    return NextResponse.json({ error: "فشل في جلب أصناف المبيعات" }, { status: 500 });
  }
}

