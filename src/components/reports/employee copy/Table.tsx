"use client";

import {
  Card,
  Text,
  Group,
  Badge,
  Divider,
  Timeline,
  ThemeIcon,
  TextInput,
  LoadingOverlay,
  Button,
} from "@mantine/core";
import { useEffect, useState, useTransition } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  TrendingUp,
  Printer,
  TrendingDown,
} from "lucide-react";
import { FaCar, FaMinus, FaPlus, FaPrint } from "react-icons/fa6";
import jsPDF from "jspdf";
import "jspdf-autotable";
type FinancialSummary = {
  cashSales: number;
  creditSales: number;
  cashPurchases: number;
  creditPurchases: number;
  cashExpenses: number;
  creditExpenses: number;
  salaries: number;
  netProfit: number;
};

type ApiRow = {
  month: string;
  total_amount: number | null;
  total_paid: number | null;
  total_remaining: number | null;
  source: string;
};

export function MonthlyReportReset() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [month, setMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  });

  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [isPending, startTransition] = useTransition();
  const loading = isPending || summary === null;

  // Update month on date change
  useEffect(() => {
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      setMonth(`${y}-${m}`);
    }
  }, [selectedDate]);

  // Fetch financial data
  useEffect(() => {
    startTransition(() => {
      async function fetchData() {
        try {
          const res = await fetch(`/api/reports/monthlyReport/${month}`);
          const data: ApiRow[] = await res.json();

          const summaryData: FinancialSummary = {
            cashSales: 0,
            creditSales: 0,
            cashPurchases: 0,
            creditPurchases: 0,
            cashExpenses: 0,
            creditExpenses: 0,
            salaries: 0,
            netProfit: 0,
          };

          data.forEach((row) => {
            const paid = Number(row.total_paid ?? 0);
            const remaining = Number(row.total_remaining ?? 0);
            const totalAmount = Number(row.total_amount ?? 0);

            switch (row.source) {
              case "Sales":
                summaryData.cashSales += paid;
                summaryData.creditSales += remaining;
                break;

              case "Purchase":
                summaryData.cashPurchases += paid;
                summaryData.creditPurchases += remaining;
                break;

              case "Expenses":
                summaryData.cashExpenses += paid;
                summaryData.creditExpenses += remaining;
                break;

              case "Payroll":
                summaryData.salaries += totalAmount;
                break;
            }
          });

          summaryData.netProfit =
            summaryData.cashSales +
            summaryData.creditSales -
            (summaryData.cashPurchases +
              summaryData.creditPurchases +
              summaryData.cashExpenses +
              summaryData.creditExpenses +
              summaryData.salaries);

          setSummary(summaryData);
        } catch (error) {
          console.error("Error fetching financial data:", error);
          setSummary(null);
        }
      }

      fetchData();
    });
  }, [month]);

  // helper to format numbers like "4,500" and with 2 decimals "4,500.00"
  const fmt = (v: number) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });


const handlePrintPDF = () => {
  if (!summary) return;

  const doc = new jsPDF({
    orientation: "p", // portrait
    unit: "mm",
    format: [80, 200], // 80mm width, height will grow automatically
  });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Financial Report", 40, 10, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Month: ${month}`, 40, 18, { align: "center" });

  const lineHeight = 6;
  let y = 28;

  const addSection = (title: string, rows: { label: string; value: number }[]) => {
    doc.setFont("helvetica", "bold");
    doc.text(title, 5, y);
    y += lineHeight;

    doc.setFont("helvetica", "normal");
    rows.forEach((r) => {
      doc.text(r.label, 5, y);
      doc.text(r.value.toFixed(2) + " JD", 70, y, { align: "right" });
      y += lineHeight;
    });

    y += 2;
    doc.setDrawColor(0);
    doc.line(5, y, 75, y); // horizontal line
    y += 4;
  };

  addSection("Sales", [
    { label: "Cash Sales", value: summary.cashSales },
    { label: "Credit Sales", value: summary.creditSales },
  ]);

  addSection("Purchases", [
    { label: "Cash Purchases", value: summary.cashPurchases },
    { label: "Credit Purchases", value: summary.creditPurchases },
  ]);

  addSection("Expenses", [
    { label: "Cash Expenses", value: summary.cashExpenses },
    { label: "Credit Expenses", value: summary.creditExpenses },
  ]);

  addSection("Salaries", [{ label: "Salaries", value: summary.salaries }]);

  doc.setFont("helvetica", "bold");
  doc.text("Net Profit", 5, y);
  doc.text(
    (summary.netProfit >= 0 ? "+" : "-") + Math.abs(summary.netProfit).toFixed(2) + " JD",
    70,
    y,
    { align: "right" }
  );

  doc.save(`Financial_Report_${month}.pdf`);
};

const handlePrint = () => {
  if (!summary) return;

  const line = "-------------------------------";

  const printText = `
  <div dir="rtl" style="font-family: sans-serif; width: 80mm; padding: 5px;">
    <h2 style="text-align:center; margin:0;">التقرير المالي</h2>
    <h3 style="text-align:center; margin:0 0 10px 0;">شهر ${month}</h3>

    <pre style="font-size:14px; white-space: pre-wrap;">

${line}
المبيعات
${line}
المبيعات النقدية        ${summary.cashSales.toFixed(2)}
المبيعات الآجلة         ${summary.creditSales.toFixed(2)}

${line}
المشتريات
${line}
المشتريات النقدية       ${summary.cashPurchases.toFixed(2)}
المشتريات الآجلة        ${summary.creditPurchases.toFixed(2)}

${line}
المصاريف
${line}
المصاريف النقدية        ${summary.cashExpenses.toFixed(2)}
المصاريف الآجلة         ${summary.creditExpenses.toFixed(2)}

${line}
الرواتب
${line}
الرواتب                 ${summary.salaries.toFixed(2)}

${line}
صافي الربح
${line}
${summary.netProfit >= 0 ? "ربح" : "خسارة"}: ${summary.netProfit.toFixed(2)}
${line}

    </pre>
  </div>
  `;

  const win = window.open("", "_blank", "width=300,height=600");
  if (win) {
    win.document.write(`
      <html dir="rtl">
        <head>
          <meta charset="UTF-8" />
          <style>
            @page { size: 80mm auto; margin: 0; }
            body { margin:0; }
          </style>
        </head>
        <body>${printText}</body>
      </html>
    `);

    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  }
};



  if (!summary) return <Text c="red">No data available</Text>;

  const items = [
    {
      title: "المبيعات",
      color: "teal",
      icon: <FaPlus size={18} />,
      values: [
        { label: "المبيعات النقدية", value: summary.cashSales, positive: true },
        {
          label: "المبيعات الآجلة",
          value: summary.creditSales,
          positive: true,
        },
      ],
    },
    {
      title: "المشتريات",
      color: "red",
      icon: <FaMinus size={18} />,
      values: [
        {
          label: "المشتريات النقدية",
          value: summary.cashPurchases,
          positive: false,
        },
        {
          label: "المشتريات الآجلة",
          value: summary.creditPurchases,
          positive: false,
        },
      ],
    },
    {
      title: "المصاريف",
      color: "orange",
      icon: <FaMinus size={18} />,
      values: [
        {
          label: "المصاريف النقدية",
          value: summary.cashExpenses,
          positive: false,
        },
        {
          label: "المصاريف الآجلة",
          value: summary.creditExpenses,
          positive: false,
        },
      ],
    },
    {
      title: "الرواتب",
      color: "violet",
      icon: <FaMinus size={18} />,
      values: [{ label: "الرواتب", value: summary.salaries, positive: false }],
    },
  ];

  return (
  <div
  style={{
    display: "flex",
    justifyContent: "center",
    width: "100%",
    padding: "10px",
  }}
>
  <div
    style={{
      width: "100%",
      maxWidth: "700px",
    }}
  >
    <Group mb="sm">
      <Button variant="light" color="blue" onClick={handlePrint}>
        <FaPrint size={"16"} />
      </Button>
      <Button variant="light" color="blue" onClick={handlePrintPDF}>
        <Printer size={16} />
      </Button>
    </Group>

    <Card
      dir="rtl"
      shadow="lg"
      padding="xl"
      w={"100%"}
      radius="xl"
      withBorder
      pos="relative"
    >
      <LoadingOverlay visible={loading} />

      <Group justify="space-between" mb="md" wrap="wrap" gap="md">
        <Text fw={700} size="xl">
          التقرير المالي لشهر: {month}
        </Text>

        <TextInput
          radius={"md"}
          value={
            selectedDate
              ? `${selectedDate.getFullYear()}-${(
                  selectedDate.getMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")}`
              : ""
          }
          onChange={(event) => {
            const val = event.currentTarget.value;
            if (val) {
              const [year, month] = val.split("-");
              setSelectedDate(new Date(Number(year), Number(month) - 1));
            } else {
              setSelectedDate(null);
            }
          }}
          type="month"
          maw={200}
        />
      </Group>

      <Divider mb="lg" />

          <Timeline active={items.length} bulletSize={26} lineWidth={2}>
            {items.map((section, i) => (
              <Timeline.Item
                key={i}
                title={
                  <Text fw={600} size="lg" c={section.color}>
                    {section.title}
                  </Text>
                }
                bullet={<ThemeIcon size={12}>{section.icon}</ThemeIcon>}
              >
                {section.values.map((v, j) => (
                  <Group key={j} justify="space-between" mt={5}>
                    <Text size="sm" c="dimmed">
                      {v.label}
                    </Text>
                    <Text fw={600} size="sm" c={v.positive ? "green" : "red"}>
                      {v.positive ? "+" : "-"} {v.value.toLocaleString()} JD
                    </Text>
                  </Group>
                ))}
                <Divider my="sm" />
              </Timeline.Item>
            ))}
         <Timeline.Item
  bullet={summary.netProfit >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
>
  <Group   justify="space-between" align="center">
    <Text size="lg"  c={summary.netProfit >= 0 ? "green" : "red"}  fw={700}>صافي الربح</Text>
    <Text
      fw={750}
      size="lg"
      c={summary.netProfit >= 0 ? "green" : "red"}
    >
      {summary.netProfit >= 0 ? "+" : "-"} {Math.abs(summary.netProfit).toLocaleString()} JD
    </Text>
  </Group>
</Timeline.Item>

          </Timeline>
        </Card>
      </div>
    </div>
  );
}
