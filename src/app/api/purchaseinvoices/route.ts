// app/api/purchase-invoices/route.ts
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();

    const invoicesRes = await client.query(`
  SELECT pi.*, s.name AS supplier
  FROM purchase_invoices pi
  LEFT JOIN suppliers s ON pi.supplier_id = s.id
  ORDER BY pi.id ASC
`);

    const itemsRes = await client.query(
      `SELECT * FROM purchase_invoice_items ORDER BY id ASC;`,
    );

    client.release();

    // نجمع الأصناف مع الفواتير
    const invoices = invoicesRes.rows.map((invoice) => ({
      ...invoice,
      items: itemsRes.rows.filter((item) => item.invoice_id === invoice.id),
    }));

    return NextResponse.json(invoices);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
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

      // إدخال الفاتورة مع الحقول الجديدة
      const invoiceRes = await client.query(
        `INSERT INTO purchase_invoices 
          (invoice_no, supplier_id, invoice_date, grand_total, status, paid_amount, remaining_amount) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          invoice_no,
          supplier_id,
          invoice_date || new Date(),
          grand_total,
          status,
          paid_amount,
          remaining_amount,
        ],
      );

      const invoice = invoiceRes.rows[0];

      // إدخال الأصناف
      for (const item of items) {
        await client.query(
          `INSERT INTO purchase_invoice_items (invoice_id, name, qty, price) 
           VALUES ($1, $2, $3, $4)`,
          [invoice.id, item.name, item.qty, item.price],
        );
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
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
