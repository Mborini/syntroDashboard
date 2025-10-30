"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

type PropsType = {
  data: { x: string; y: number }[];
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function TSPMOverviewChart({ data }: PropsType) {
  const isMobile = useIsMobile();

  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#5750F1"],
    chart: {
      height: 310,
      type: "area",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    fill: {
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    stroke: {
      curve: "smooth",
      width: isMobile ? 2 : 3,
    },
    grid: {
      strokeDashArray: 5,
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: { marker: { show: true } },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { rotate: -45 },
    },
  };

  return (
    <div className="-ml-4 -mr-5 h-[310px]">
      <Chart
        options={options}
        series={[
          {
            name: "Total Sales",
            data: data,
          },
        ]}
        type="area"
        height={310}
      />
    </div>
  );
}
