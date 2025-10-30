import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { name, weight, notes } = await req.json();
    const client = await pool.connect();
    await client.query(
      "UPDATE purchase_items SET name=$1, weight=$2, notes=$3 WHERE id=$4;",
      [name, weight, notes, params.id],
    );
    client.release();
    return NextResponse.json({ message: "Purchase item updated" });
  } catch (error) {
    console.error("PUT purchase_items error:", error);
    return NextResponse.json(
      { error: "Failed to update purchase item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const client = await pool.connect();
  try {
    // تحقق إذا كان الصنف مرتبط بأي فاتورة
    const res = await client.query(
      "SELECT COUNT(*) FROM purchase_invoice_items WHERE item_id=$1",
      [params.id],
    );

    const count = Number(res.rows[0].count);

    if (count > 0) {
      // الصنف مرتبط بفواتير، لا يمكن حذفه
      return NextResponse.json(
        { error: "لا يمكن حذف الصنف لأنه مرتبط بفواتير." },
        { status: 400 },
      );
    }

    // الصنف غير مرتبط، يمكن حذفه
    await client.query("DELETE FROM purchase_items WHERE id=$1;", [params.id]);

    return NextResponse.json({ message: "تم حذف الصنف بنجاح" });
  } catch (error) {
    console.error("DELETE purchase_items error:", error);
    return NextResponse.json({ error: "فشل في حذف الصنف" }, { status: 500 });
  } finally {
    client.release();
  }
}
