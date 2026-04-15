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
    const response = await fetch(
      "https://gamtracking.amman.jo/tracking/Settings/Vehicles/VehiclesHandler.ashx",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          cookie: `ASP.NET_SessionId=${session?.sessionValue}`,
        },
      }
    );

    const data = await response.json();

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
      { status: 500 }
    );
  }
}