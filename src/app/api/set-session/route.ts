import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const { sessionValue } = await req.json();

    

    // تحديث السيشن
    const query = `UPDATE sessions SET session_value = $1`;
    await pool.query(query, [sessionValue]);

    // **ترجع رد نجاح**
    return NextResponse.json({ message: "Session updated successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}