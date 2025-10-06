import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();

    const result = await client.query(`
      SELECT 
        w.id,
        w.item_id,
        pi.name AS item_name,
        pi.weight AS item_weight,
        w.quantity,
        w.notes,
        w.created_at
      FROM inventory_withdrawals w
      JOIN purchase_items pi ON w.item_id = pi.id
      ORDER BY w.created_at DESC;
    `);

    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json({ error: "فشل في جلب السحوبات" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { item_id, quantity, notes } = await req.json();
    if (!item_id || !quantity || quantity <= 0)
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const check = await client.query(
        `SELECT quantity FROM inventory WHERE item_id = $1`,
        [item_id],
      );
      if (check.rows.length === 0) throw new Error("الصنف غير موجود");
      const available = Number(check.rows[0].quantity);
      if (available < quantity) throw new Error("الكمية غير كافية");

      await client.query(
        `UPDATE inventory SET quantity = quantity - $1 WHERE item_id = $2`,
        [quantity, item_id],
      );

      await client.query(
        `INSERT INTO inventory_withdrawals (item_id, quantity, notes)
         VALUES ($1, $2, $3)`,
        [item_id, quantity, notes || null],
      );

      await client.query("COMMIT");
      client.release();

      return NextResponse.json({ message: "تم السحب بنجاح" });
    } catch (err) {
      await client.query("ROLLBACK");
      client.release();
      throw err;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
