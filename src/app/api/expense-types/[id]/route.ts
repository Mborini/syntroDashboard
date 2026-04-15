import pool from "@/lib/db";
import { NextResponse } from "next/server";

// =========================
//        UPDATE (PUT)
// =========================
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name } = await req.json();

    const client = await pool.connect();
    await client.query(
      "UPDATE expenses_types SET name = $1 WHERE id = $2;",
      [name, id]
    );
    client.release();

    return NextResponse.json({ message: "Expense type updated" });
  } catch (error) {
    console.error("PUT expenses_types error:", error);
    return NextResponse.json(
      { error: "Failed to update expense type" },
      { status: 500 }
    );
  }
}

// =========================
//        DELETE
// =========================
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const client = await pool.connect();
    await client.query("DELETE FROM expenses_types WHERE id = $1;", [id]);
    client.release();

    return NextResponse.json({ message: "Expense type deleted" });
  } catch (error) {
    console.error("DELETE expenses_types error:", error);
    return NextResponse.json(
      { error: "Failed to delete expense type" },
      { status: 500 }
    );
  }
}
