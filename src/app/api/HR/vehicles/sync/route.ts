import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";


export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
       *
      FROM vehicles as v
      ORDER BY v.created_at DESC
    `);
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json({ message: "فشل في جلب بيانات المركبات" }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const vehicles = await req.json();

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (const v of vehicles) {
        await client.query(
          `
          INSERT INTO vehicles (
            ts_id, plate, type, company, sub_fleet,
            container_size, is_garbage_truck
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7)
          ON CONFLICT (ts_id)
          DO UPDATE SET
            plate = EXCLUDED.plate,
            type = EXCLUDED.type,
            company = EXCLUDED.company,
            sub_fleet = EXCLUDED.sub_fleet,
            container_size = EXCLUDED.container_size,
            is_garbage_truck = EXCLUDED.is_garbage_truck,
            updated_at = NOW()
        `,
          [
            v.TsId,
            v.plate,
            v.type,
            v.company,
            v.subFleet,
            v.containerSize,
            v.isGarbageTruck,
          ]
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({ success: true });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}