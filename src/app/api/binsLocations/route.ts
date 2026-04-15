import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { convertKmlFileToGeoJSON } from "@/app/utils/kmlToGeoJSON";
import { extractCoordinates } from "@/app/utils/extractCoordinates";

// ============================
// 📌 GET
// ============================
export async function GET() {
  const client = await pool.connect();

  const result = await client.query(`
    SELECT *
    FROM bins_locations
    ORDER BY id DESC
  `);

  client.release();

  return NextResponse.json(result.rows);
}

// ============================
// 📌 POST
// ============================
export async function POST(req: NextRequest) {
  try {
    const client = await pool.connect();
    const form = await req.formData();

    const region_name = form.get("region_name") as string;
    const vehicle_number = form.get("vehicle_number") as string;
    const shift = form.get("shift") as string;

    const binsFile = form.get("bins_file") as File | null;
    const routeFile = form.get("route_file") as File | null;

    let bins_coordinates: any[] = [];
    let route_coordinates: any[] = [];

    // =========================
    // BINS → POINTS
    // =========================
    if (binsFile) {
      const geojson = await convertKmlFileToGeoJSON(binsFile);
      bins_coordinates = extractCoordinates(geojson);
    }

    // =========================
    // ROUTE → LINESTRING
    // =========================
    if (routeFile) {
      const geojson = await convertKmlFileToGeoJSON(routeFile);
      route_coordinates = extractCoordinates(geojson);
    }

    const result = await client.query(
      `
      INSERT INTO bins_locations
      (region_name, vehicle_number, shift, bins_geojson, route_geojson)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        region_name,
        vehicle_number,
        shift || null,
        JSON.stringify(bins_coordinates),
        JSON.stringify(route_coordinates),
      ]
    );

    client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// ============================
// 📌 PUT
// ============================
export async function PUT(req: NextRequest) {
  try {
    const client = await pool.connect();
    const form = await req.formData();

    const id = form.get("id") as string;
    const region_name = form.get("region_name") as string;
    const vehicle_number = form.get("vehicle_number") as string;

    const binsFile = form.get("bins_file") as File | null;
    const routeFile = form.get("route_file") as File | null;

    let bins_coordinates: any = null;
    let route_coordinates: any = null;

    if (binsFile) {
      const geojson = await convertKmlFileToGeoJSON(binsFile);
      bins_coordinates = extractCoordinates(geojson);
    }

    if (routeFile) {
      const geojson = await convertKmlFileToGeoJSON(routeFile);
      route_coordinates = extractCoordinates(geojson);
    }

    const result = await client.query(
      `
      UPDATE bins_locations
      SET
        region_name = $1,
        vehicle_number = $2,
        bins_geojson = COALESCE($3, bins_geojson),
        route_geojson = COALESCE($4, route_geojson)
      WHERE id = $5
      RETURNING *
      `,
      [
        region_name,
        vehicle_number,
        bins_coordinates ? JSON.stringify(bins_coordinates) : null,
        route_coordinates ? JSON.stringify(route_coordinates) : null,
        id,
      ]
    );

    client.release();

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
