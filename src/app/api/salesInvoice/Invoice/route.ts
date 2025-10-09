import { NextResponse } from "next/server";
import pool from "@/lib/db"; // كائن الاتصال بقاعدة البيانات PostgreSQL أو MySQL

export async function GET() {
  const result = await pool.query(`
    SELECT 
      si.*, 
      c.name AS customer_name,
      json_agg(
        json_build_object(
          'item_id', sii.item_id,
          'qty', sii.qty,
          'weight', s.weight,
          'price', sii.price,
          'unit_price', sii.unit_price,
          'name', s.name
        )
      ) AS items
    FROM sales_invoices si
    LEFT JOIN customers c ON si.customer_id = c.id
    LEFT JOIN sales_invoice_items sii ON si.id = sii.invoice_id
    LEFT JOIN sales_items s ON sii.item_id = s.id
    GROUP BY si.id, c.name
    ORDER BY si.id DESC
  `);

  return NextResponse.json(result.rows);
}


export async function POST(req: Request) {
  const data = await req.json();

  const invoiceResult = await pool.query(
    `INSERT INTO sales_invoices (customer_id, invoice_date, grand_total, status, paid_amount)
     VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [data.customer_id, data.invoice_date, data.grand_total, data.status, data.paid_amount]
  );

  const invoiceId = invoiceResult.rows[0].id;

  for (const item of data.items) {
    // إضافة عناصر الفاتورة
    await pool.query(
      `INSERT INTO sales_invoice_items (invoice_id, item_id, qty, price, unit_price)
       VALUES ($1,$2,$3,$4,$5)`,
      [invoiceId, item.item_id, item.qty, item.price, item.unit_price]
    );

    // تحديث المستودع: خصم الكمية
    await pool.query(
      `UPDATE warehouse
       SET quantity = quantity - $1
       WHERE sales_item_id = $2`,
      [item.qty, item.item_id]
    );
  }

  return NextResponse.json({ success: true });
}

