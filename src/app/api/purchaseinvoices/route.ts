// app/api/purchase-invoices/route.ts
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();

    // جلب الفواتير + اسم المورد
    const invoicesRes = await client.query(`
      SELECT pi.*, s.name AS supplier
      FROM purchase_invoices pi
       JOIN suppliers s ON pi.supplier_id = s.id
      ORDER BY pi.id ASC;
    `);

    // جلب جميع الأصناف المرتبطة بالفواتير + اسم الصنف والوزن
    const itemsRes = await client.query(`
      SELECT pii.*, p.name AS item_name, p.weight
      FROM purchase_invoice_items pii
      LEFT JOIN purchase_items p ON pii.item_id = p.id
      ORDER BY pii.id ASC;
    `);

    client.release();

    // ربط الأصناف بالفواتير
    const invoices = invoicesRes.rows.map((invoice :any) => ({
      ...invoice,
      items: itemsRes.rows
        .filter((item:any) => item.invoice_id === invoice.id)
        .map((item:any) => ({
          item_id: item.item_id,
          qty: item.qty,
          price: item.price,
          name: item.item_name,
          weight: item.weight,
        })),
    }));

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      invoice_no,
      supplier_id,
      invoice_date,
      items,
      grand_total,
      status,
      paid_amount,
      remaining_amount,
    } = body;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1️⃣ إدراج الفاتورة
      const invoiceRes = await client.query(
        `
        INSERT INTO purchase_invoices 
          (invoice_no, supplier_id, invoice_date, grand_total, status, paid_amount, remaining_amount) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
        `,
        [
          invoice_no,
          supplier_id,
          invoice_date ? invoice_date : new Date().toISOString().split("T")[0],
          grand_total,
          status,
          paid_amount,
          remaining_amount,
        ]
      );

      const invoice = invoiceRes.rows[0];

      // 2️⃣ إدراج الأصناف في جدول الفاتورة
      for (const item of items) {
        await client.query(
          `INSERT INTO purchase_invoice_items (invoice_id, item_id, qty, price)
           VALUES ($1, $2, $3, $4)`,
          [invoice.id, item.item_id, item.qty, item.price]
        );

        // 3️⃣ تحديث المستودع
        // نفترض أن لديك جدول inventory يحتوي على item_id و quantity
        const stockRes = await client.query(
          `SELECT quantity FROM inventory WHERE item_id = $1`,
          [item.item_id]
        );

        if (stockRes.rows.length > 0) {
          // إذا الصنف موجود، زيد الكمية
          await client.query(
            `UPDATE inventory SET quantity = quantity + $1 WHERE item_id = $2`,
            [item.qty, item.item_id]
          );
        } else {
          // إذا الصنف غير موجود، أضف سجل جديد
          await client.query(
            `INSERT INTO inventory (item_id, quantity) VALUES ($1, $2)`,
            [item.item_id, item.qty]
          );
        }
      }

      await client.query("COMMIT");
      client.release();

      return NextResponse.json(invoice, { status: 201 });
    } catch (err) {
      await client.query("ROLLBACK");
      client.release();
      throw err;
    }
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
