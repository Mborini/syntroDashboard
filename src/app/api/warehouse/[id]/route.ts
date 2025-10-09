import { NextResponse } from "next/server";
import pool from "@/lib/db";

// PUT
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const { sales_item_id, weight, note, production_date, quantity } = await req.json();

    const result = await pool.query(
      `UPDATE warehouse
       SET sales_item_id = $1, weight = $2, note = $3, production_date = $4, quantity = $5
       WHERE item_id = $6
       RETURNING *`,
      [sales_item_id, weight, note, production_date, quantity, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error updating warehouse item:", error);
    return NextResponse.json({ error: "فشل في تعديل المنتج" }, { status: 500 });
  }
}


// 🔹 حذف منتج
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "رقم المنتج غير صالح" }, { status: 400 });

    const result = await pool.query(`DELETE FROM warehouse WHERE item_id = $1`, [id]);

    if (result.rowCount === 0)
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });

    return NextResponse.json({ message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    console.error("❌ Error deleting warehouse item:", error);
    return NextResponse.json({ error: "فشل في حذف المنتج" }, { status: 500 });
  }
}
