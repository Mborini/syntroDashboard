// app/api/purchase-invoices/[id]/route.ts
import pool from "@/lib/db";
import { NextResponse } from "next/server";

// تحديث فاتورة
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid invoice id" }, { status: 400 });

    const body = await req.json();
    const { invoice_no, supplier_id, invoice_date, items, grand_total, status, paid_amount, remaining_amount } = body;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // استرجاع الأصناف القديمة لتعديل المخزون
      const oldItemsRes = await client.query(
        `SELECT item_id, qty FROM purchase_invoice_items WHERE invoice_id=$1`,
        [id]
      );

      // نقص الكميات القديمة من المخزون
      for (const item of oldItemsRes.rows) {
        await client.query(
          `UPDATE inventory SET quantity = quantity - $1 WHERE item_id = $2`,
          [item.qty, item.item_id]
        );
      }

      // حذف الأصناف القديمة
      await client.query(`DELETE FROM purchase_invoice_items WHERE invoice_id=$1`, [id]);

      // إدخال الأصناف الجديدة وتحديث المخزون
      for (const item of items) {
        // إدخال الأصناف الجديدة في الفاتورة
        await client.query(
          `INSERT INTO purchase_invoice_items (invoice_id, item_id, qty, price)
           VALUES ($1, $2, $3, $4)`,
          [id, item.item_id, item.qty, item.price]
        );

        // تحديث المخزون
        const stockRes = await client.query(
          `SELECT quantity FROM inventory WHERE item_id=$1`,
          [item.item_id]
        );

        if (stockRes.rows.length > 0) {
          await client.query(
            `UPDATE inventory SET quantity = quantity + $1 WHERE item_id = $2`,
            [item.qty, item.item_id]
          );
        } else {
          await client.query(
            `INSERT INTO inventory (item_id, quantity) VALUES ($1, $2)`,
            [item.item_id, item.qty]
          );
        }
      }

      // تحديث بيانات الفاتورة الأساسية
      await client.query(
        `UPDATE purchase_invoices 
         SET invoice_no=$1, supplier_id=$2, invoice_date=$3, grand_total=$4, status=$5, paid_amount=$6, remaining_amount=$7
         WHERE id=$8`,
        [invoice_no, supplier_id, invoice_date || new Date(), grand_total, status, paid_amount, remaining_amount, id]
      );

      await client.query("COMMIT");
      client.release();

      return NextResponse.json({ message: "Invoice updated successfully" });
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
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid invoice id" }, { status: 400 });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // استرجاع الأصناف المرتبطة بالفاتورة
      const itemsRes = await client.query(
        `SELECT pii.item_id, pii.qty, p.name 
         FROM purchase_invoice_items pii
         LEFT JOIN purchase_items p ON pii.item_id = p.id
         WHERE pii.invoice_id=$1`,
        [id]
      );

      if (itemsRes.rows.length === 0) {
        await client.query("ROLLBACK");
        client.release();
        return NextResponse.json({ error: "Invoice has no items" }, { status: 400 });
      }

      // تحقق من المخزون لكل صنف
      const missingItems: { name: string; requiredQty: number; availableQty: number }[] = [];
      for (const item of itemsRes.rows) {
        const stockRes = await client.query(
          `SELECT quantity FROM inventory WHERE item_id=$1`,
          [item.item_id]
        );

        const availableQty = stockRes.rows.length > 0 ? stockRes.rows[0].quantity : 0;
        if (availableQty < item.qty) {
          missingItems.push({ 
            name: item.name, 
            requiredQty: item.qty, 
            availableQty 
          });
        }
      }

      if (missingItems.length > 0) {
        await client.query("ROLLBACK");
        client.release();
        return NextResponse.json({
          error: "بعض الأصناف غير موجودة في المستودع. يجب إعادة هذه الأصناف أولًا.",
          missingItems,
        }, { status: 400 });
      }

      // نقص الكميات من المخزون
      for (const item of itemsRes.rows) {
        await client.query(
          `UPDATE inventory SET quantity = quantity - $1 WHERE item_id = $2`,
          [item.qty, item.item_id]
        );
      }

      // حذف الأصناف المرتبطة بالفاتورة
      await client.query(`DELETE FROM purchase_invoice_items WHERE invoice_id=$1`, [id]);

      // حذف الفاتورة نفسها
      const res = await client.query(`DELETE FROM purchase_invoices WHERE id=$1 RETURNING *`, [id]);
      if (res.rowCount === 0) {
        await client.query("ROLLBACK");
        client.release();
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
      }

      await client.query("COMMIT");
      client.release();

      return NextResponse.json({ message: "Invoice deleted successfully" });
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
