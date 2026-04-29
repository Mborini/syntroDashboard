import pool from "@/lib/db";
import { updateEmployeeMonthlySummary } from "@/lib/hrSummary";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  try {
    const headers = new Headers({
      Accept: "application/json",
      Cookie: "ADC_CONN_539B3595F4E=7DEA341F90062C0070BA2E073C408F511B70085238B3F50F7D53BC5AC3D2BEFE58F25C6A6E3CC269; ASP.NET_SessionId=5jzrnxqvw4nzb1fpjfwgtmuw; ADC_REQ_2E94AF76E7=152E8C04A21B76A56BEF905E1598F32C10225A6DB90CD79947A298B06C9F4A28D62D1842FC5B19C7"
    });

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
