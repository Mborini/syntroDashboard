import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const client = await pool.connect();

  const clean = (v: any) =>
    v === "" || v === undefined ? null : v;

  try {
    const body = await req.json();
    const {
      reportId,
      plateNumber,
      date,

      completedRoute,
      followedRoute,
      hasDeviation,
      outsideArea,
      hasUncollectedBins,

      notes,
      trips,
      shift,

      noTripsReason,
      unCompletedRouteReason,
      unFollowedRouteReason,
      deviationReason,
      outsideAreaReason,
      locationOutsideArea,
      uncollectedBinsApproxCount,
      uncollectedBinsReason,
    } = body;

    await client.query("BEGIN");

    const query = `
      INSERT INTO report_checklist (
        report_id,
        plate_number,
        report_date,

        completed_route,
        followed_route,
        has_deviation,
        outside_area,
        has_uncollected_bins,

        notes,
        trips,
        shift,

        no_trips_reason,
        uncompleted_route_reason,
        unfollowed_route_reason,
        deviation_reason,
        outside_area_reason,
        location_outside_area,
        uncollected_bins_approx_count,
        uncollected_bins_reason
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
      ON CONFLICT (report_id)
      DO UPDATE SET
        plate_number = EXCLUDED.plate_number,
        report_date = EXCLUDED.report_date,

        completed_route = EXCLUDED.completed_route,
        followed_route = EXCLUDED.followed_route,
        has_deviation = EXCLUDED.has_deviation,
        outside_area = EXCLUDED.outside_area,
        has_uncollected_bins = EXCLUDED.has_uncollected_bins,

        notes = EXCLUDED.notes,
        trips = EXCLUDED.trips,
        shift = EXCLUDED.shift,

        no_trips_reason = EXCLUDED.no_trips_reason,
        uncompleted_route_reason = EXCLUDED.uncompleted_route_reason,
        unfollowed_route_reason = EXCLUDED.unfollowed_route_reason,
        deviation_reason = EXCLUDED.deviation_reason,
        outside_area_reason = EXCLUDED.outside_area_reason,
        location_outside_area = EXCLUDED.location_outside_area,
        uncollected_bins_approx_count = EXCLUDED.uncollected_bins_approx_count,
        uncollected_bins_reason = EXCLUDED.uncollected_bins_reason
      RETURNING *;
    `;

    const values = [
      reportId,
      plateNumber,
      date,

      completedRoute,
      followedRoute,
      hasDeviation,
      outsideArea,
      hasUncollectedBins,

      clean(notes),
      clean(trips) ?? 0,
      clean(shift),

      clean(noTripsReason),
      clean(unCompletedRouteReason),
      clean(unFollowedRouteReason),
      clean(deviationReason),
      clean(outsideAreaReason),
      clean(locationOutsideArea),
      clean(uncollectedBinsApproxCount),
      clean(uncollectedBinsReason),
    ];

    const result = await client.query(query, values);

    await client.query(
      `UPDATE vehicle_daily_summaries SET is_rated = true WHERE id = $1`,
      [reportId],
    );

    await client.query("COMMIT");

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);

    return NextResponse.json(
      { error: "Failed to save checklist" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
// ============================
// 📥 جلب كل البيانات
// ============================
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT *
      FROM report_checklist
      ORDER BY created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch checklist" },
      { status: 500 },
    );
  }
}

// ============================
// ❌ حذف (اختياري)
// ============================
export async function DELETE(req: Request) {
  try {
    const { plateNumber, date } = await req.json();

    await pool.query(
      `
      DELETE FROM report_checklist
      WHERE plate_number = $1 AND report_date = $2
    `,
      [plateNumber, date],
    );

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
