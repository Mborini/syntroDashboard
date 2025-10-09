import { NextResponse } from "next/server";
import pool from "@/lib/db";


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const invoiceId = Number(params.id);
  const data = await req.json();

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // بدء المعاملة

    // جلب العناصر القديمة للفاتورة
    const oldItemsResult = await client.query(
      `SELECT item_id, qty FROM sales_invoice_items WHERE invoice_id=$1`,
      [invoiceId]
    );
    const oldItems = oldItemsResult.rows;

    // إعادة كميات العناصر القديمة للمستودع
    for (const oldItem of oldItems) {
      const qty = Math.floor(Number(oldItem.qty));
      await client.query(
        `UPDATE warehouse SET quantity = quantity + $1 WHERE sales_item_id=$2`,
        [qty, oldItem.item_id]
      );
    }

    // تحديث بيانات الفاتورة
    await client.query(
      `UPDATE sales_invoices 
       SET customer_id=$1, invoice_date=$2, grand_total=$3, status=$4, paid_amount=$5
       WHERE id=$6`,
      [data.customer_id, data.invoice_date, data.grand_total, data.status, data.paid_amount, invoiceId]
    );

    // حذف العناصر القديمة
    await client.query(`DELETE FROM sales_invoice_items WHERE invoice_id=$1`, [invoiceId]);

    // إضافة العناصر الجديدة وتحديث المستودع
    for (const item of data.items) {
      const qty = Math.floor(Number(item.qty));

      await client.query(
        `INSERT INTO sales_invoice_items (invoice_id, item_id, qty, price, unit_price)
         VALUES ($1,$2,$3,$4,$5)`,
        [invoiceId, item.item_id, qty, item.price, item.unit_price]
      );

      await client.query(
        `UPDATE warehouse SET quantity = quantity - $1 WHERE sales_item_id=$2`,
        [qty, item.item_id]
      );
    }

    await client.query('COMMIT'); // إنهاء المعاملة بنجاح
    return NextResponse.json({ success: true });

  } catch (error) {
    await client.query('ROLLBACK'); // إلغاء أي تغييرات في حال الخطأ
    console.error("❌ Error updating invoice:", error);
    return NextResponse.json({ error: "فشل في تحديث الفاتورة" }, { status: 500 });
  } finally {
    client.release();
  }
}

// DELETE: حذف فاتورة حسب ID مع تعديل المستودع
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const invoiceId = Number(params.id);

  try {
    // جلب العناصر المرتبطة بالفاتورة
    const itemsResult = await pool.query(
      `SELECT item_id, qty FROM sales_invoice_items WHERE invoice_id=$1`,
      [invoiceId]
    );

    const items = itemsResult.rows;

    // إعادة الكميات إلى المستودع
    for (const item of items) {
      const qtyInt = Math.floor(Number(item.qty)); // تحويل الكمية إلى integer
      await pool.query(
        `UPDATE warehouse SET quantity = quantity + $1 WHERE sales_item_id=$2`,
        [qtyInt, item.item_id]
      );
    }

    // حذف العناصر المرتبطة بالفاتورة
    await pool.query(`DELETE FROM sales_invoice_items WHERE invoice_id=$1`, [invoiceId]);

    // حذف الفاتورة نفسها
    await pool.query(`DELETE FROM sales_invoices WHERE id=$1`, [invoiceId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting invoice:", error);
    return NextResponse.json({ error: "فشل في حذف الفاتورة" }, { status: 500 });
  }
}