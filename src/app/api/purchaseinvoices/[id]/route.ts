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

      // تحديث بيانات الفاتورة الأساسية
      await client.query(
        `UPDATE purchase_invoices 
         SET invoice_no=$1, supplier_id=$2, invoice_date=$3, grand_total=$4, status=$5, paid_amount=$6, remaining_amount=$7
         WHERE id=$8`,
        [invoice_no, supplier_id, invoice_date || new Date(), grand_total, status, paid_amount, remaining_amount, id]
      );

      // حذف الأصناف القديمة
      await client.query(`DELETE FROM purchase_invoice_items WHERE invoice_id=$1`, [id]);

      // إدخال الأصناف الجديدة
      for (const item of items) {
        await client.query(
          `INSERT INTO purchase_invoice_items (invoice_id, name, qty, price)
           VALUES ($1, $2, $3, $4)`,
          [id, item.name, item.qty, item.price]
        );
      }

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

// حذف فاتورة
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid invoice id" }, { status: 400 });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

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
