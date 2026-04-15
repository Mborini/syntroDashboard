// src/app/api/roles/route.ts
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();
    const res = await client.query(`SELECT id, name FROM roles`);
    client.release();
    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
