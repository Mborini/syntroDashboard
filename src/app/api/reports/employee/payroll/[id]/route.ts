import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const employeeId = Number(params.id);
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");

  if (!employeeId || !month) {
    return NextResponse.json({ error: "Employee ID and month are required" }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    // ✅ 1️⃣ تحقق أولاً هل تم دفع راتب هذا الشهر من قبل
    const paidCheck = await client.query(
      `
      SELECT id, amount, created_at
      FROM payroll
      WHERE employee_id = $1 AND month = $2
      `,
      [employeeId, month]
    );

    if (paidCheck.rows.length > 0) {
      client.release();
      return NextResponse.json({
        alreadyPaid: true,
        message: "تم دفع راتب هذا الشهر لهذا الموظف مسبقًا",
      });
    }

    // ✅ 2️⃣ إذا لم يُدفع، استعلم عن الراتب المتبقي
    const result = await client.query(
      `
      SELECT remaining_salary AS amount
      FROM employee_monthly_summary
      WHERE employee_id = $1 AND month = $2
      `,
      [employeeId, month]
    );

    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ amount: null, message: "لا يوجد راتب لهذا الموظف في هذا الشهر" });
    }

    return NextResponse.json({ amount: result.rows[0].amount, alreadyPaid: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
