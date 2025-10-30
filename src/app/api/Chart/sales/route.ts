import { NextResponse } from "next/server";
import pool from "@/lib/db"; // كائن الاتصال بقاعدة البيانات PostgreSQL أو MySQL
//total sales per month
export async function GET() {
  const TSPM = await pool.query(`
    SELECT 
  TO_CHAR(DATE_TRUNC('month', si.invoice_date), 'YYYY-MM') AS month,
  SUM(si.grand_total) AS total_sales
FROM sales_invoices si
GROUP BY month
ORDER BY month ASC;

  `);
  const TSIPM = await pool.query(`
SELECT
  s.name AS item_name,
  s.weight, 
  TO_CHAR(DATE_TRUNC('month', si.invoice_date), 'YYYY-MM') AS month,
  SUM(sii.qty) AS total_quantity_sold
FROM sales_invoice_items sii
LEFT JOIN sales_items s ON sii.item_id = s.id
LEFT JOIN sales_invoices si ON sii.invoice_id = si.id
WHERE EXTRACT(YEAR FROM si.invoice_date) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY s.name, s.weight, month
ORDER BY month, s.name;


  `);

  return NextResponse.json({ TSPM: TSPM.rows, TSIPM: TSIPM.rows });
}
