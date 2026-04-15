import { authOptions } from "@/lib/authOptions";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import format from "pg-format";
import * as XLSX from "xlsx";
import axios from "axios";
import { fetchTrackingFromGAM } from "@/lib/trackingApi";

/**
 * =========================
 * 🧠 HELPERS
 * =========================
 */

function getUTS(dateStr: any): number {
  if (!dateStr || typeof dateStr !== "string") return 0;
  let formatted = dateStr.replace("ص", "AM").replace("م", "PM");
  const date = new Date(formatted);
  return isNaN(date.getTime()) ? 0 : Math.floor(date.getTime() / 1000);
}

function formatArabicDateTime(dateStr: any) {
  if (!dateStr || typeof dateStr !== "string") return dateStr;
  let formatted = dateStr.replace("ص", "AM").replace("م", "PM");
  const date = new Date(formatted);
  return isNaN(date.getTime()) ? formatted : date.toISOString();
}
const parseArabicExcelDate = (value: string) => {
  if (!value) return null;

  let v = value.trim();

  // تحويل ص / م إلى AM/PM
  v = v.replace("ص", "AM").replace("م", "PM");

  // تحويل / إلى - (اختياري لتحسين parsing)
  const match = v.match(
    /(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)?/i
  );

  if (!match) return null;

  let [, day, month, year, hour, min, sec, period] = match;

  let h = parseInt(hour);

  if (period?.toUpperCase() === "PM" && h < 12) h += 12;
  if (period?.toUpperCase() === "AM" && h === 12) h = 0;

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    h,
    Number(min),
    Number(sec)
  );
};
/**
 * =========================
 * 🚗 DISTANCE CALCULATION
 * =========================
 */

function getDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function calculateRouteDistance(coords: [number, number][]) {
  let total = 0;

  for (let i = 1; i < coords.length; i++) {
    const [lon1, lat1] = coords[i - 1];
    const [lon2, lat2] = coords[i];

    total += getDistanceMeters(lat1, lon1, lat2, lon2);
  }

  return total;
}

/**
 * =========================
 * DB HELPERS
 * =========================
 */

async function getVehicleTsId(plate: string) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT ts_id, id FROM vehicles WHERE plate = $1",
      [plate]
    );
    return res.rows[0] || null;
  } finally {
    client.release();
  }
}

async function fetchTrackingData(tsId: string, from: string, to: string) {
  if (!tsId) return { polyline: null, totalLiftCount: 0, visitedpoints: [] };
  return await fetchTrackingFromGAM(tsId, from, to);
}

/**
 * =========================
 * POST
 * =========================
 */

export async function POST(req: NextRequest) {
  let client;

  try {
    const session = await getServerSession(authOptions);

    const formData = await req.formData();
    const file = formData.get("file") as File;

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const infoData: any[] = XLSX.utils.sheet_to_json(
      workbook.Sheets["معلومات المركبة"]
    );

    const rawActivityData: any[] = XLSX.utils.sheet_to_json(
      workbook.Sheets["عرض البيانات"]
    );

    const summaryData: any[] = XLSX.utils.sheet_to_json(
      workbook.Sheets["الملخص"]
    );

    const alertsData: any[] = XLSX.utils.sheet_to_json(
      workbook.Sheets["التنبيهات"]
    );

    const plateNumber = String(infoData[0]["رقم اللوحة"]).trim();

    const vehicleInfo = await getVehicleTsId(plateNumber);

    /**
     * 🕒 TIME RANGE
     */
    let startTimeApi = "";
    let endTimeApi = "";

    if (rawActivityData.length > 0) {
      const firstDateTime = parseArabicExcelDate(
        rawActivityData[0]["التاريخ"]
      );

      const lastDateTime = parseArabicExcelDate(
        rawActivityData[rawActivityData.length - 1]["التاريخ"]
      );

      const formatDateTime = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const h = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");
        return `${y}-${m}-${day} ${h}:${min}`;
      };

      startTimeApi = formatDateTime(firstDateTime);
      endTimeApi = formatDateTime(lastDateTime);
    }
const toDbDate = (d: any) => {
  if (!d) return null;

  const date = parseArabicExcelDate(d);

  if (!date || isNaN(date.getTime())) return null;

  return date.toISOString().replace("T", " ").substring(0, 19);
};
    /**
     * 🔥 TRACKING API
     */
    const trackingData = vehicleInfo?.ts_id
      ? await fetchTrackingData(vehicleInfo.ts_id, startTimeApi, endTimeApi)
      : { polyline: null, totalLiftCount: 0, visitedpoints: [] };

    const polyline = trackingData.polyline;
    const visitedpoints = trackingData.visitedpoints  || [];
    const totalLiftCount = trackingData.totalLiftCount;

    /**
     * 📏 CALCULATE DISTANCE
     */
    let formattedDistanceKm = 0;

    if (polyline) {
      const decoded = require("@mapbox/polyline")
        .decode(polyline)
        .map(([lat, lng]: number[]) => [lng, lat]);

      const distanceMeters = calculateRouteDistance(decoded);
      formattedDistanceKm = parseFloat((distanceMeters / 1000).toFixed(2));
      
    }

    /**
     * 📅 DATE
     */
   const baseDate = parseArabicExcelDate(rawActivityData[0]["التاريخ"]);

if (!baseDate || isNaN(baseDate.getTime())) {
  throw new Error("Invalid baseDate");
}

    baseDate.setHours(0, 0, 0, 0);

    const reportDateUts = Math.floor(baseDate.getTime() / 1000);
    const reportActualDate = baseDate.toISOString().split("T")[0];

    client = await pool.connect();
    await client.query("BEGIN");

    /**
     * 🚗 VEHICLE
     */
    let vehicleId = vehicleInfo?.id;

    if (!vehicleId) {
      const insV = await client.query(
        "INSERT INTO vehicles (plate, company, sub_fleet) VALUES ($1, $2, $3) RETURNING id",
        [
          plateNumber,
          infoData[0]["المؤسسة"],
          infoData[0]["المجموعة الفرعية"],
        ]
      );
      vehicleId = insV.rows[0].id;
    }

    /**
     * 📊 SUMMARY INSERT
     */
    const summaryInsert = await client.query(
      `
      INSERT INTO vehicle_daily_summaries 
      (vehicle_id, report_date, report_date_uts, driving_time, idle_time, stop_time, avg_speed, max_speed, total_lifts, polyline, visitedpoints, distance_km)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING id
      `,
      [
        vehicleId,
        reportActualDate,
        reportDateUts,
        summaryData[0]["وقت القيادة"],
        summaryData[0]["قت الخمول"],
        summaryData[0]["وقت التوقف"],
        summaryData[0]["متوسط السرعة"],
        summaryData[0]["اعلى السرعة"],
        totalLiftCount,
        polyline,
        JSON.stringify(visitedpoints),
        formattedDistanceKm,
      ]
    );

    const summaryId = summaryInsert.rows[0].id;

    /**
     * ⚠️ ALERTS
     */
    if (alertsData.length > 0) {
      const alertValues = alertsData.map((a) => [
        vehicleId,
        summaryId,
toDbDate(a["التاريخ"]),
        getUTS(a["التاريخ"]),
        a["التنبيه"],
        a["العنوان"],
        a["خط الطول"],
        a["خط العرض"],
      ]);

      await client.query(
        format(
          `INSERT INTO vehicle_alerts 
          (vehicle_id, summary_id, alert_timestamp, alert_timestamp_uts, alert_type, address, longitude, latitude)
          VALUES %L`,
          alertValues
        )
      );
    }

    /**
     * 🚗 ACTIVITY LOGS
     */
    if (rawActivityData.length > 0) {
      const activityValues = rawActivityData.map((r) => [
        vehicleId,
        summaryId,
        toDbDate(r["التاريخ"]),
        getUTS(r["التاريخ"]),
        r["التشغيل"] === "نعم",
        parseInt(r["السرعة"]) || 0,
        r["العنوان"],
        parseFloat(r["خط الطول"]),
        parseFloat(r["خط العرض"]),
      ]);

      await client.query(
        format(
          `INSERT INTO vehicle_activity_logs 
          (vehicle_id, summary_id, log_timestamp, log_timestamp_uts, is_engine_on, speed, address, longitude, latitude)
          VALUES %L`,
          activityValues
        )
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      message: "تم الرفع بنجاح",
      lifts: totalLiftCount,
      formattedDistanceKm,
      polyline,
    });
  } catch (error: any) {
    if (client) await client.query("ROLLBACK");
    console.error("❌ ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

/**
 * =========================
 * GET
 * =========================
 */

export async function GET(req: NextRequest) {
  let client;

  try {
    client = await pool.connect();

    const query = `
      SELECT 
    s.id AS "id",
    s.is_rated AS "isRated",
    v.plate AS "plateNumber",
    v.company AS "organization",
    v.sub_fleet AS "subFleet",
    s.report_date AS "date",
    s.report_date_uts AS "dateUts",
    s.driving_time AS "totalDriveTime",
    s.idle_time AS "totalIdleTime",
    s.stop_time AS "totalStopTime",
    s.avg_speed AS "avgSpeed",
    s.max_speed AS "maxSpeed",
    s.total_lifts AS "totalLifts",
    s.polyline AS "polyline",
    s.visitedpoints AS "visitedpoints",
    s.distance_km AS "distanceKm",

    -- عدد التنبيهات
    (
        SELECT COUNT(*) 
        FROM vehicle_alerts a 
        WHERE a.summary_id = s.id 
          AND (a.alert_type LIKE '%سرعة%' 
               OR a.alert_type LIKE '%Speed%')
    ) AS "totalAlerts",

    -- تفاصيل التنبيهات + بيانات السرعة من logs
    (
        SELECT json_agg(
            json_build_object(
                'alertTime', a.alert_timestamp,
                'alertType', a.alert_type,
                'speed', l.speed,
                'speed_limit', l.speed_limit,
                'address', l.address
                
            )
        )
        FROM vehicle_alerts a
        LEFT JOIN vehicle_activity_logs l 
            ON l.vehicle_id = a.vehicle_id
           AND l.log_timestamp = a.alert_timestamp
        WHERE a.summary_id = s.id
          AND (a.alert_type LIKE '%تجاوز%' 
              )
    ) AS "alerts"

FROM vehicles v
JOIN vehicle_daily_summaries s ON v.id = s.vehicle_id
ORDER BY s.id DESC
LIMIT 50;

    `;

    const result = await client.query(query);
    console.log(result.rows);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}