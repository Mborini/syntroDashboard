import { NextRequest, NextResponse } from "next/server";
import { updateEmployeeMonthlySummary } from "@/lib/hrSummary";

export async function POST(req: NextRequest) {
  try {
    const { employee_id, start_date, end_date } = await req.json();

    if (!employee_id || !start_date) {
      return NextResponse.json(
        { error: "employee_id و start_date مطلوبين" },
        { status: 400 }
      );
    }

    await updateEmployeeMonthlySummary(employee_id, start_date, end_date);

    return NextResponse.json({ message: "تم التحديث بنجاح" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ أثناء التحديث" }, { status: 500 });
  }
}
