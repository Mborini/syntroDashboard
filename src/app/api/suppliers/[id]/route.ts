import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { CreateSupplierDTO } from "@/types/supplier";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();
    const data: CreateSupplierDTO = await req.json();

    const res = await client.query(
      `UPDATE suppliers SET name=$1, phone=$2, address=$3 WHERE id=$4 RETURNING id, name, phone, address`,
      [data.name, data.phone, data.address, params.id]
    );

    client.release();
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();
    await client.query(`DELETE FROM suppliers WHERE id=$1`, [params.id]);
    client.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
