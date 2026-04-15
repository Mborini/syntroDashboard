import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* 🟢 عرض كل دفعات الرواتب */
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
        p.id,
        p.employee_id,
        e.name AS employee_name,
        p.amount,
        p.month,
        p.notes,
        p.created_at
      FROM payroll p
      JOIN employees e ON e.id = p.employee_id
      ORDER BY p.created_at DESC
    `);
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching payrolls:", error);
    return NextResponse.json({ message: "فشل في جلب بيانات الرواتب" }, { status: 500 });
  }
}

/* 🟡 إضافة دفعة جديدة */
export async function POST(req: NextRequest) {
  try {
    const { employee_id, amount, month, notes } = await req.json();

    if (!employee_id || !amount || !month) {
      return NextResponse.json({ message: "جميع الحقول مطلوبة!" }, { status: 400 });
    }

    const client = await pool.connect();
    await client.query(
      `INSERT INTO payroll (employee_id, amount, month, notes, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [employee_id, amount, month, notes]
    );
    client.release();

    return NextResponse.json({ message: "تمت إضافة الدفعة بنجاح" });
  } catch (error) {
    console.error("Error adding payroll:", error);
    return NextResponse.json({ message: "فشل في إضافة الدفعة" }, { status: 500 });
  }
}
