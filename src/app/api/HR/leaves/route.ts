import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { updateEmployeeMonthlySummary } from "@/lib/hrSummary";

export async function GET() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT 
        l.id,
        l.employee_id,
        e.name AS employee_name,
        l.date,
        l.reason,
        l.created_at
      FROM leaves l
      JOIN employees e ON l.employee_id = e.id
      ORDER BY l.date DESC;
    `);

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "فشل في جلب الإجازات" }, { status: 500 });
  } finally {
    client.release();
  }
}
export async function POST(req: NextRequest) {
  const { employee_id, date, reason } = await req.json();

  if (!employee_id || !date || !reason) {
    return NextResponse.json(
      { message: "الرجاء تعبئة جميع الحقول" },
      { status: 400 }
    );
  }

  const client = await pool.connect();
  try {
    // 🔹 تحقق من وجود إجازة سابقة لنفس الموظف في نفس التاريخ
    const check = await client.query(
      `SELECT id FROM leaves WHERE employee_id = $1 AND date = $2`,
      [employee_id, date]
    );

    if (check.rows.length > 0) {
      return NextResponse.json(
        { message: "هذا الموظف لديه إجازة في هذا التاريخ بالفعل" },
        { status: 400 }
      );
    }

    // 🔹 أضف الإجازة الجديدة
    const res = await client.query(
      `INSERT INTO leaves (employee_id, date, reason)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [employee_id, date, reason]
    );
const leaveDate = new Date(date); // تحويل التاريخ إلى كائن Date
await updateEmployeeMonthlySummary(employee_id, leaveDate);

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "فشل في إضافة الإجازة" }, { status: 500 });
  } finally {
    client.release();
  }
}
