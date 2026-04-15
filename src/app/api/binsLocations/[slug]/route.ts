import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const client = await pool.connect();

  try {
    const { slug } = params;

    const result = await client.query(
      `
      SELECT *
      FROM bins_locations
      WHERE vehicle_number = $1
      ORDER BY id DESC
      `,
      [slug]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  await client.query(
    `DELETE FROM bins_locations WHERE id = $1`,
    [params.id]
  );

  client.release();

  return NextResponse.json({ success: true });
}