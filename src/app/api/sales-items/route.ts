import pool from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ جلب كل أصناف المبيعات
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM sales_items ORDER BY id DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching sales items:", error);
    return NextResponse.json({ error: "Failed to fetch sales items" }, { status: 500 });

  }
}

// ✅ إضافة صنف مبيعات جديد
export async function POST(req: Request) {
  try {
    const { name, cost_price, sale_price, weight, note } = await req.json();

    if (!name || !cost_price || !sale_price) {
      return NextResponse.json({ error: "الاسم وسعر التكلفة وسعر البيع مطلوبة" }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO sales_items (name, cost_price, sale_price, weight, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, cost_price, sale_price, weight, note]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating sales item:", error);
    return NextResponse.json({ error: "Failed to create sales item" }, { status: 500 });
  }
}
