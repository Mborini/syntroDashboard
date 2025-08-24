import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { classId: string } }) {
  try {
    const client = await pool.connect();
    const res = await client.query(
      `SELECT id, name FROM sections WHERE class_id = $1 ORDER BY id ASC`,
      [params.classId]
    );
    client.release();
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
