"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

type ChartDataType = {
  name: string; // الشهر
  data: { x: string; y: number }[]; // كل صنف وكمية مباعة
}[];

type PropsType = {
  data: ChartDataType;
};

export function TSIPMOverviewChart({ data }: PropsType) {
  const currentMonthData = data[0]?.data || [];

  const labels = [" الضنف"]; // كل dataset يمثل عمود واحد

  const backgroundColors = [
    "rgba(255, 99, 132, 0.5)",
    "rgba(255, 159, 64, 0.5)",
    "rgba(255, 205, 86, 0.5)",
    "rgba(75, 192, 192, 0.5)",
    "rgba(54, 162, 235, 0.5)",
    "rgba(153, 102, 255, 0.5)",
    "rgba(201, 203, 207, 0.5)",
  ];

  const borderColors = [
    "rgb(255, 99, 132)",
    "rgb(255, 159, 64)",
    "rgb(255, 205, 86)",
    "rgb(75, 192, 192)",
    "rgb(54, 162, 235)",
    "rgb(153, 102, 255)",
    "rgb(201, 203, 207)",
  ];

  // كل صنف dataset منفصل ليظهر في legend
  const datasets = currentMonthData.map((d, index) => ({
    label: d.x, // اسم الصنف
    data: [d.y], // قيمة العمود
    backgroundColor: backgroundColors[index % backgroundColors.length],
    borderColor: borderColors[index % borderColors.length],
    borderWidth: 1,
  }));

  const chartData = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", onClick: undefined }, // يمكن الضغط على الاسم لإخفاء/إظهار العمود
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${context.parsed.y.toLocaleString()} وحدة`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
      x: {
        ticks: { font: { size: 12 } },
      },
    },
  };

  return (
    <div className="h-[340px] overflow-x-auto">
      <Bar data={chartData} />
    </div>
  );
}
