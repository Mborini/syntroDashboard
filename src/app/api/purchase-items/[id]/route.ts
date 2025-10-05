import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, weight, notes } = await req.json();
    const client = await pool.connect();
    await client.query(
      "UPDATE purchase_items SET name=$1, weight=$2, notes=$3 WHERE id=$4;",
      [name, weight, notes, params.id]
    );
    client.release();
    return NextResponse.json({ message: "Purchase item updated" });
  } catch (error) {
    console.error("PUT purchase_items error:", error);
    return NextResponse.json({ error: "Failed to update purchase item" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();
    await client.query("DELETE FROM purchase_items WHERE id=$1;", [params.id]);
    client.release();
    return NextResponse.json({ message: "Purchase item deleted" });
  } catch (error) {
    console.error("DELETE purchase_items error:", error);
    return NextResponse.json({ error: "Failed to delete purchase item" }, { status: 500 });
  }
}
