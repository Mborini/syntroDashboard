import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const reportId = Number(params.slug);

    const result = await pool.query(
      `
      SELECT 
          vds.id AS "reportId",
          v.plate AS "plateNumber",
          v.container_size AS "containerSize",
          v.sub_fleet AS "subFleet",
          vds.report_date AS "date",
          vds.distance_km AS "distanceKm",
          vds.driving_time AS "totalDriveTime",
          vds.stop_time AS "totalStopTime",
          vds.idle_time AS "totalIdleTime",
          vds.avg_speed AS "avgSpeed",
          vds.max_speed AS "maxSpeed",
          vds.total_lifts AS "totalLifts",
          vds.start_date AS "firstTripTime",
          vds.end_date AS "lastTripTime",

          COUNT(va.id) AS "totalAlerts",

          JSON_AGG(
              JSON_BUILD_OBJECT(
                  'alert_time', va.alert_timestamp,
                  'speed', REGEXP_REPLACE(va.alert_type, '[^0-9]', '', 'g')
              )
          ) FILTER (WHERE va.id IS NOT NULL) AS "alerts",

          rc.shift,
          rc.trips,
          rc.followed_route AS "followedRoute",
          rc.completed_route AS "completedRoute",
          rc.has_deviation AS "hasDeviation",
          rc.outside_area AS "outsideArea",
          rc.has_uncollected_bins AS "hasUncollectedBins",
          rc.notes,

          rc.no_trips_reason AS "noTripsReason",
          rc.unfollowed_route_reason AS "unfollowedRouteReason",
          rc.uncompleted_route_reason AS "unCompletedRouteReason",
          rc.deviation_reason AS "deviationReason",
          rc.outside_area_reason AS "outsideAreaReason",
          rc.location_outside_area AS "locationOutsideArea",
          rc.uncollected_bins_reason AS "uncollectedBinsReason"

      FROM report_checklist rc
      LEFT JOIN vehicle_daily_summaries vds 
          ON rc.report_id = vds.id
      LEFT JOIN vehicles v 
          ON vds.vehicle_id = v.id
      LEFT JOIN vehicle_alerts va 
          ON va.summary_id = vds.id
          AND va.alert_type LIKE 'بداية تجاوز سرعة الشارع%'

      WHERE rc.report_id = $1

      GROUP BY 
          vds.id,
          v.plate,
          vds.report_date,
          vds.distance_km,
          vds.driving_time,
          vds.stop_time,
          vds.idle_time,
          vds.avg_speed,
          vds.max_speed,
          vds.total_lifts,
          v.container_size,
          v.sub_fleet,
          vds.start_date,
          vds.end_date,

          rc.shift,
          rc.trips,
          rc.followed_route,
          rc.completed_route,
          rc.has_deviation,
          rc.outside_area,
          rc.has_uncollected_bins,
          rc.notes,

          rc.no_trips_reason,
          rc.unfollowed_route_reason,
          rc.uncompleted_route_reason,
          rc.deviation_reason,
          rc.outside_area_reason,
          rc.location_outside_area,
          rc.uncollected_bins_reason;
      `,
      [reportId],
    );

    return NextResponse.json(result.rows[0] || null);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch checklist" },
      { status: 500 },
    );
  }
}