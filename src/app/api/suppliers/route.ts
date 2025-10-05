// src/app/api/suppliers/route.ts
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { CreateSupplierDTO } from "@/types/supplier";

// GET /api/suppliers
export async function GET() {
  try {
    const client = await pool.connect();
    const res = await client.query(`SELECT id, name, phone, address FROM suppliers ORDER BY id ASC`);
    client.release();
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST /api/suppliers
export async function POST(req: NextRequest) {
  try {
    const client = await pool.connect();
    const data: CreateSupplierDTO = await req.json();

    const res = await client.query(
      `INSERT INTO suppliers (name, phone, address)
       VALUES ($1, $2, $3)
       RETURNING id, name, phone, address`,
      [data.name, data.phone, data.address]
    );

    client.release();
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
