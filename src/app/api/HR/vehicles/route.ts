import pool from "@/lib/db";
import { updateEmployeeMonthlySummary } from "@/lib/hrSummary";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const headers = new Headers({
      Accept: "application/json",
    });

    if (session.sessionValue) {
      //find ASP.NET_SessionId 
      const match = session.sessionValue.match(/ASP\.NET_SessionId=[^;]+/);
      if (match) {
        headers.set("cookie", match[0]);
      }
    }

    const response = await fetch(
      "https://gamtracking.amman.jo/tracking/Settings/Vehicles/VehiclesHandler.ashx",
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      throw new Error(`Vehicles upstream request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Vehicles upstream response is not an array");
    }

    const vehicles = data.map((v: any) => ({
      TsId: v.VehicleID,
      plate: v.PlateNumber.trim(),
      type: v.TypeAR,
      subFleet: v.SubFleet,
      isGarbageTruck: v.IsGarbageTruck,
      company: v.CompanyNameAr,
      containerSize: v.ContainerSize,
    }));

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}


