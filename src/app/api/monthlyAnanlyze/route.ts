import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db"; // تأكد أن لديك اتصال بقاعدة البيانات

export async function GET(req: NextRequest) {
  const client = await pool.connect();
  try {
    const total_expenses = await client.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', invoice_date), 'YYYY-MM') AS month,
        SUM(grand_total) AS total_expenses
      FROM expenses_invoices
      GROUP BY month
      ORDER BY month;
    `);
    const total_purchases_paid_amount = await client.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', invoice_date), 'YYYY-MM') AS month,
        SUM(paid_amount) AS total_purchases_paid_amount
      FROM purchase_invoices
      GROUP BY month
      ORDER BY month;
    `);
    const total_remaining_purchases_amount = await client.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', invoice_date), 'YYYY-MM') AS month,
        SUM(remaining_amount) AS total_remaining_purchases_amount
      FROM purchase_invoices
      GROUP BY month
      ORDER BY month;
    `);

    const total_sales_paid_amount = await client.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', invoice_date), 'YYYY-MM') AS month,
        SUM(paid_amount) AS total_sales_paid_amount
      FROM sales_invoices
      GROUP BY month
      ORDER BY month;
    `);
    const total_remaining_amount_sales = await client.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', invoice_date), 'YYYY-MM') AS month,
        SUM(remaining_amount) AS total_remaining_amount_sales
      FROM sales_invoices
      GROUP BY month
      ORDER BY month;
    `);
    return NextResponse.json({
      total_expenses: total_expenses.rows,
      total_purchases: total_purchases_paid_amount.rows,
      total_sales_paid_amount: total_sales_paid_amount.rows,
      total_remaining_amount_sales: total_remaining_amount_sales.rows,
      total_remaining_purchases_amount: total_remaining_purchases_amount.rows,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  } finally {
    client.release();
  }
}
