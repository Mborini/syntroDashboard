import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { tsId, from, to, sessionValue } = body;

    if (!tsId) {
      return NextResponse.json({
        polyline: null,
        totalLiftCount: 0,
        visitedpoints: [],
      });
    }

    const response = await axios.get(
      "https://gamtracking.amman.jo/Tracking/WasteMangement/Endpoints/ManageGarbageTrucksLive.ashx",
      {
        params: {
          from,
          to,
          SelectedVehicles: tsId,
          IsTrucks: "false",
        },
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "X-Requested-With": "XMLHttpRequest",
          Referer:
            "https://gamtracking.amman.jo/Tracking/WasteMangement/MonitorBinsLiftPlaces/MonitorBinsLiftPlaces.aspx",
          Cookie: sessionValue,
        },
      },
    );

    const data = response.data;

    return NextResponse.json({
      polyline: data.VehiclePolylines?.[0]?.Polyline || null,
      totalLiftCount: data.TotalLiftCount || 0,
      visitedpoints: data.VisitedVehicles || [],
    });
  } catch (err: any) {
    console.error("❌ GAM API ERROR:", err?.message);

    return NextResponse.json(
      {
        error: true,
        status: err?.response?.status || 500,
        polyline: null,
        totalLiftCount: 0,
        visitedpoints: [],
      },
      { status: 500 },
    );
  }
}