import pool from "@/lib/db";
import { NextResponse } from "next/server";

// تراجع عن عملية السحب (يعني إرجاع الكمية للمستودع)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "معرف السحب غير صالح" }, { status: 400 });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // جلب بيانات السحب قبل الحذف
      const result = await client.query(
        `SELECT item_id, quantity FROM inventory_withdrawals WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) throw new Error("عملية السحب غير موجودة");

      const { item_id, quantity } = result.rows[0];

      // إرجاع الكمية للمستودع
      await client.query(
        `UPDATE inventory SET quantity = quantity + $1 WHERE item_id = $2`,
        [quantity, item_id]
      );

      // حذف سجل السحب
      await client.query(`DELETE FROM inventory_withdrawals WHERE id = $1`, [id]);

      await client.query("COMMIT");
      client.release();

      return NextResponse.json({ message: "تم التراجع عن السحب بنجاح" });
    } catch (err) {
      await client.query("ROLLBACK");
      client.release();
      throw err;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
