"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { TSPMOverviewChart } from "./chart";
import { getSalesData } from "@/services/chart";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export function TSPM({ timeFrame = "monthly", className }: PropsType) {
  const [chartData, setChartData] = useState<{ x: string; y: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesData = await getSalesData();

        // تحويل البيانات إلى الشكل المطلوب من ApexCharts
        const formatted = salesData.TSPM.map((item: any) => ({
          x: item.month,
          y: Number(item.total_sales),
        }));

        setChartData(formatted);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div dir="rtl" className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          مجموع البيعات الشهرية
        </h2>
      </div>

      <TSPMOverviewChart data={chartData} />
    </div>
  );
}
