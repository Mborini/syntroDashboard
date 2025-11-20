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

const handlePrint = () => {
  if (!summary) return;

  const sections = [
    {
      title: "المبيعات",
      rows: [
        { label: "المبيعات النقدية", value: summary.cashSales, positive: true },
        { label: "المبيعات الآجلة", value: summary.creditSales, positive: true },
      ],
    },
    {
      title: "المشتريات",
      rows: [
        { label: "المشتريات النقدية", value: summary.cashPurchases, positive: false },
        { label: "المشتريات الآجلة", value: summary.creditPurchases, positive: false },
      ],
    },
    {
      title: "المصاريف",
      rows: [
        { label: "المصاريف النقدية", value: summary.cashExpenses, positive: false },
        { label: "المصاريف الآجلة", value: summary.creditExpenses, positive: false },
      ],
    },
    {
      title: "الرواتب",
      rows: [{ label: "الرواتب", value: summary.salaries, positive: false }],
    },
  ];

  const html = `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:30px; color:#333;">
      <h1 style="text-align:center; font-size:24px; margin-bottom:20px;">التقرير المالي لشهر ${month}</h1>
      <table style="width:100%; border-collapse: collapse; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <thead>
          <tr style="background-color:#f0f0f0;">
            <th style="padding:12px; border-bottom:1px solid #ccc; text-align:right; font-size:16px;">البند</th>
            <th style="padding:12px; border-bottom:1px solid #ccc; text-align:right; font-size:16px;">القيمة (JD)</th>
          </tr>
        </thead>
        <tbody>
          ${sections.map(sec => `
            <tr style="background-color:#fafafa;">
              <td colspan="2" style="padding:10px; font-weight:bold; border-bottom:1px solid #ccc;">${sec.title}</td>
            </tr>
            ${sec.rows.map(r => `
              <tr>
                <td style="padding:8px; border-bottom:1px solid #eee;">${r.label}</td>
                <td style="padding:8px; border-bottom:1px solid #eee; text-align:right; color:${r.positive ? "green" : "red"}; font-weight:600;">
                  ${r.positive ? "+" : "-"} ${fmt(r.value)}
                </td>
              </tr>
            `).join('')}
          `).join('')}
          <tr style="background-color:#e0f7fa;">
            <td style="padding:10px; font-weight:bold; font-size:18px; border-top:2px solid #ccc;">صافي الربح</td>
            <td style="padding:10px; font-weight:bold; font-size:18px; text-align:right; color:${summary.netProfit >=0 ? "green" : "red"}; border-top:2px solid #ccc;">
              ${summary.netProfit >=0 ? "+" : "-"} ${fmt(Math.abs(summary.netProfit))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;
  win.document.write(`
    <html dir="rtl">
      <head>
        <title>طباعة التقرير المالي</title>
        <meta charset="utf-8" />
        <style>
          body { margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          @media print {
            @page { margin:20mm; }
            button { display:none; }
          }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 300);
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
