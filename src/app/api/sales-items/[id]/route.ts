import pool from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ تحديث صنف مبيعات
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const { name, cost_price, sale_price, weight, notes } = await req.json();
    if (!name || !cost_price || !sale_price) {
        return NextResponse.json({ error: "الاسم وسعر التكلفة وسعر البيع مطلوبة" }, { status: 400 });
    }
    const result = await pool.query(
      `UPDATE sales_items
       SET name = $1, cost_price = $2, sale_price = $3, weight = $4, notes = $5
       WHERE id = $6
       RETURNING *`,
      [name, cost_price, sale_price, weight, notes , id]
    );

    if (result.rowCount === 0)
      return NextResponse.json({ error: "العنصر غير موجود" }, { status: 404 });

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating sales item:", error);
    return NextResponse.json({ error: "Failed to update sales item" }, { status: 500 });
  }
}

// ✅ حذف صنف مبيعات
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    const result = await pool.query("DELETE FROM sales_items WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0)
      return NextResponse.json({ error: "العنصر غير موجود" }, { status: 404 });

    return NextResponse.json({ message: "تم حذف العنصر بنجاح", deleted: result.rows[0] });
  } catch (error) {
    console.error("Error deleting sales item:", error);
    return NextResponse.json({ error: "Failed to delete sales item" }, { status: 500 });
  }
}
