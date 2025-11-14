import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { date: string } }) {
  const { date } = params; // date متوقع أن يكون 'YYYY-MM'

  try {
    const client = await pool.connect();
    const result = await client.query(
      `
      SELECT 
          month AS month,
          SUM(amount) AS total_amount,
          NULL::numeric AS total_paid,
          NULL::numeric AS total_remaining,
          'Payroll' AS source
      FROM payroll
      WHERE month = $1
      GROUP BY month

      UNION ALL

      SELECT 
          TO_CHAR(invoice_date::date, 'YYYY-MM') AS month,
          NULL::numeric AS total_amount,
          SUM(paid_amount) AS total_paid,
          SUM(remaining_amount) AS total_remaining,
          'Expenses' AS source
      FROM expenses_invoices
      WHERE TO_CHAR(invoice_date::date, 'YYYY-MM') = $1
      GROUP BY TO_CHAR(invoice_date::date, 'YYYY-MM')

      UNION ALL

      SELECT 
          TO_CHAR(invoice_date::date, 'YYYY-MM') AS month,
          NULL::numeric AS total_amount,
          SUM(paid_amount) AS total_paid,
          SUM(remaining_amount) AS total_remaining,
          'Purchase' AS source
      FROM purchase_invoices
      WHERE TO_CHAR(invoice_date::date, 'YYYY-MM') = $1
      GROUP BY TO_CHAR(invoice_date::date, 'YYYY-MM')

      UNION ALL

      SELECT 
          TO_CHAR(invoice_date::date, 'YYYY-MM') AS month,
          NULL::numeric AS total_amount,
          SUM(paid_amount) AS total_paid,
          SUM(remaining_amount) AS total_remaining,
          'Sales' AS source
      FROM sales_invoices
      WHERE TO_CHAR(invoice_date::date, 'YYYY-MM') = $1
      GROUP BY TO_CHAR(invoice_date::date, 'YYYY-MM')

      ORDER BY month DESC, source;
      `,
      [date]
    );

    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching payrolls:", error);
    return NextResponse.json(
      { message: "فشل في جلب بيانات الرواتب" },
      { status: 500 }
    );
  }
}
