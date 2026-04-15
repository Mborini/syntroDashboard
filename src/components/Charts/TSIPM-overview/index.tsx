"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { TSIPMOverviewChart } from "./chart";
import { getSalesData } from "@/services/chart";

type PropsType = { className?: string };

export function TSIPM({ className }: PropsType) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [allData, setAllData] = useState<any[]>([]); // لتخزين كل البيانات من API

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesData = await getSalesData();
        const data = salesData.TSIPM;

        setAllData(data); // حفظ البيانات الأصلية

        // جلب الأشهر المتاحة
        const monthsSet = new Set(data.map((item: any) => item.month));
        const monthsArray = Array.from(monthsSet).sort() as string[];
        setMonths(monthsArray);

        // الشهر الافتراضي: آخر شهر
        const defaultMonth = monthsArray[monthsArray.length - 1];
        setSelectedMonth(defaultMonth);

        updateChartData(defaultMonth, data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchData();
  }, []);

  const updateChartData = (month: string, data: any[]) => {
    const filteredData = data.filter((item: any) => item.month === month);
    const formattedSeries = [
      {
        name: month,
        data: filteredData.map((item: any) => ({
          x: item.item_name + " " + item.weight,
          y: Number(item.total_quantity_sold),
        })),
      },
    ];
    setChartData(formattedSeries);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value;
    setSelectedMonth(month);
    updateChartData(month, allData); // استخدم البيانات الأصلية فقط
  };

  return (
    <div className={cn("grid gap-4 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card", className)}>
      <div dir="rtl" className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          عدد اصناف المبيعات
        </h2>
        <select value={selectedMonth} onChange={handleMonthChange} className="border rounded px-2 py-1">
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <TSIPMOverviewChart data={chartData} />
    </div>
  );
}
