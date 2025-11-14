import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { updateEmployeeMonthlySummary } from "../../updateEmployeeSummary/route";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();
    const body = await req.json();
    const { name, phone, address, start_date, end_date, salary, is_active } = body;

    const res = await client.query(
      `UPDATE employees 
       SET name=$1, phone=$2, address=$3, start_date=$4, end_date=$5, salary=$6, is_active=$7
       WHERE id=$8
       RETURNING *`,
      [name, phone, address, start_date, end_date, salary, is_active, params.id]
    );

    client.release();
    await updateEmployeeMonthlySummary(res.rows[0].id, start_date, end_date);


    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();

    // تحديث بدلاً من الحذف الحقيقي
    await client.query(
      `UPDATE employees SET is_deleted = TRUE WHERE id = $1`,
      [params.id]
    );

    client.release();
    return NextResponse.json({ message: "تم حذف الموظف (حذف منطقي)" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();
    const body = await req.json();
    const { is_active } = body;

    const res = await client.query(
      `UPDATE employees SET is_active=$1 WHERE id=$2 RETURNING *`,
      [is_active, params.id]
    );

    client.release();
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
