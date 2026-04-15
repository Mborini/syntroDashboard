import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const invoiceId = Number(params.id);
  const data = await req.json();
  const client = await pool.connect();

  try {
    console.log("🚀 Starting invoice update for ID:", invoiceId);

    await client.query("BEGIN");

    // 🔹 تحديث بيانات الفاتورة
    console.log("📌 Updating invoice info:", data);
    await client.query(
      `UPDATE sales_invoices 
       SET customer_id=$1, invoice_date=$2, grand_total=$3, status=$4, paid_amount=$5
       WHERE id=$6`,
      [
        data.customer_id,
        data.invoice_date,
        data.grand_total,
        data.status,
        data.paid_amount,
        invoiceId,
      ]
    );

    // 🔹 جلب العناصر القديمة من الفاتورة
    const oldItemsResult = await client.query(
      `SELECT item_id, qty FROM sales_invoice_items WHERE invoice_id=$1`,
      [invoiceId]
    );
    const oldItems = oldItemsResult.rows.map((i:any) => ({
      item_id: i.item_id,
      qty: Number(i.qty),
    }));
    console.log("📝 Old invoice items:", oldItems);

    // تحويلها إلى كائن للسهولة
    const oldItemsMap: Record<number, number> = {};
    for (const item of oldItems) {
      oldItemsMap[item.item_id] = item.qty;
    }

    // 🔹 التكرار على الأصناف الجديدة
    for (const item of data.items) {
      const newQty = Number(item.qty);
      const oldQty = oldItemsMap[item.item_id] || 0;

      // 🔹 جلب الكمية الحالية في المستودع
      const check = await client.query(
        `SELECT quantity FROM warehouse WHERE sales_item_id=$1`,
        [item.item_id]
      );

      if (check.rows.length === 0)
        throw new Error(`الصنف رقم ${item.item_id} غير موجود في المستودع`);

      const available = Number(check.rows[0].quantity);

      // الحد الأعلى للكمية الجديدة = الكمية القديمة + الموجود في المستودع
      const maxAllowedQty = oldQty + available;

     if (newQty > maxAllowedQty) {
  return NextResponse.json(
    {
      success: false,
      message: `الكمية المطلوبة (${newQty}) أكبر من الحد المسموح (${maxAllowedQty}) للصنف ${item.item_name}`
    },
    { status: 400 }
  );
}


      const diff = newQty - oldQty; // الفرق بين الجديد والقديم
      console.log(
        `🔹 Processing item ${item.item_id} | oldQty: ${oldQty} | newQty: ${newQty} | diff: ${diff}`
      );
      console.log(`🏭 Warehouse before update for item ${item.item_id}: ${available}`);

      if (diff !== 0) {
        // تحديث المستودع
        await client.query(
          `UPDATE warehouse SET quantity = quantity - $1 WHERE sales_item_id=$2`,
          [diff, item.item_id]
        );

        console.log(`🏭 Warehouse after update for item ${item.item_id}: ${available - diff}`);
      }

      // 🔹 تحديث أو إدخال الصنف في الفاتورة
      const existingItem = oldItems.find((i:any) => i.item_id === item.item_id);

      if (existingItem) {
        // تعديل الكمية والسعر
        await client.query(
          `UPDATE sales_invoice_items 
           SET qty=$1, price=$2, unit_price=$3 
           WHERE invoice_id=$4 AND item_id=$5`,
          [newQty, item.price, item.unit_price, invoiceId, item.item_id]
        );
        console.log(`✏️ Updating existing item ${item.item_id} in invoice`);
      } else {
        // صنف جديد غير موجود سابقًا
        await client.query(
          `INSERT INTO sales_invoice_items (invoice_id, item_id, qty, price, unit_price)
           VALUES ($1, $2, $3, $4, $5)`,
          [invoiceId, item.item_id, newQty, item.price, item.unit_price]
        );
        console.log(`✏️ Added new item ${item.item_id} to invoice`);
      }
    }

    // 🔹 حذف أي صنف لم يعد موجود في القائمة الجديدة
    const newItemIds = data.items.map((i: any) => i.item_id);
    const removedItems = oldItems.filter((i:any) => !newItemIds.includes(i.item_id));

    console.log("📝 Items to return to warehouse:", removedItems);

    for (const removed of removedItems) {
      await client.query(
        `UPDATE warehouse SET quantity = quantity + $1 WHERE sales_item_id=$2`,
        [removed.qty, removed.item_id]
      );

      await client.query(
        `DELETE FROM sales_invoice_items WHERE invoice_id=$1 AND item_id=$2`,
        [invoiceId, removed.item_id]
      );

      console.log(`🏭 Warehouse after returning item ${removed.item_id}: updated`);
    }

    await client.query("COMMIT");
    console.log("✅ Invoice update committed successfully");

    return NextResponse.json({ success: true });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("❌ Error updating invoice:", error);
    return NextResponse.json(
      { error: error.message || "فشل في تحديث الفاتورة" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// ✅ حذف الفاتورة مع إعادة الكميات للمستودع
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const invoiceId = Number(params.id);

  try {
    const itemsResult = await pool.query(
      `SELECT item_id, qty FROM sales_invoice_items WHERE invoice_id=$1`,
      [invoiceId]
    );

    const items = itemsResult.rows.map((i:any) => ({
      item_id: i.item_id,
      qty: Number(i.qty),
    }));

    console.log("📝 Items to return to warehouse:", items);

    for (const item of items) {
      await pool.query(
        `UPDATE warehouse SET quantity = quantity + $1 WHERE sales_item_id=$2`,
        [item.qty, item.item_id]
      );
      console.log(`🏭 Warehouse after returning item ${item.item_id}: updated`);
    }

    await pool.query(`DELETE FROM sales_invoice_items WHERE invoice_id=$1`, [invoiceId]);
    await pool.query(`DELETE FROM sales_invoices WHERE id=$1`, [invoiceId]);

    console.log("✅ Invoice deleted successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting invoice:", error);
    return NextResponse.json({ error: "فشل في حذف الفاتورة" }, { status: 500 });
  }
}

