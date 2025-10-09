import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        w.item_id,
        w.sales_item_id,
        s.name AS item_name,
        w.weight,
        w.note,
        w.production_date,
        w.quantity
      FROM warehouse w
      LEFT JOIN sales_items s ON w.sales_item_id = s.id
      ORDER BY w.item_id DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching warehouse:", error);
    return NextResponse.json({ error: "فشل في جلب بيانات المستودع" }, { status: 500 });
  }
}

// POST
export async function POST(req: Request) {
  try {
    const { sales_item_id, weight, note, production_date, quantity } = await req.json();

    if (!sales_item_id || !weight || !production_date)
      return NextResponse.json({ error: "البيانات ناقصة" }, { status: 400 });

    const result = await pool.query(
      `INSERT INTO warehouse (sales_item_id, weight, note, production_date, quantity)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [sales_item_id, weight, note, production_date, quantity],
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error adding warehouse item:", error);
    return NextResponse.json({ error: "فشل في إضافة المنتج" }, { status: 500 });
  }
}
