"use client";

import { useEffect, useState } from "react";
import { ShortCard, ShortCardSkeleton } from "./card";
import { Wallet, ShoppingCart, TrendingUp, TrendingDown, Banknote } from "lucide-react";

type MonthlyData = {
  total_expenses?: any[];
  total_purchases?: any[];
  total_sales_paid_amount?: any[];
  total_remaining_amount_sales?: any[];
  total_remaining_purchases_amount?: any[];
};

export function OverviewCardsGroup() {
  const [data, setData] = useState<MonthlyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/monthlyAnanlyze", { cache: "no-store" });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

        const jsonData = await res.json();
        setData(jsonData);
      } catch (err: any) {
        console.error("Error fetching monthly data:", err);
        setError("حدث خطأ أثناء جلب البيانات، حاول لاحقًا.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    // ✅ عرض السكيلتونات
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <ShortCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error)
    return (
      <div className="text-center text-red-600 font-semibold p-4">
        {error}
      </div>
    );

  if (!data)
    return (
      <div className="text-center text-gray-500 p-4">
        لا توجد بيانات متاحة.
      </div>
    );

  // ✅ جمع القيم
  const sumExpenses = (data.total_expenses || []).reduce(
    (acc, curr) => acc + Number(curr.total_expenses || 0),
    0
  );

  const totalPurchasesPaidAmount = (data.total_purchases || []).reduce(
    (acc, curr) => acc + Number(curr.total_purchases_paid_amount || 0),
    0
  );

  const totalSalesPaidAmount = (data.total_sales_paid_amount || []).reduce(
    (acc, curr) => acc + Number(curr.total_sales_paid_amount || 0),
    0
  );

  const sumRemainingSales = (data.total_remaining_amount_sales || []).reduce(
    (acc, curr) => acc + Number(curr.total_remaining_amount_sales || 0),
    0
  );

  const sumRemainingPurchases = (data.total_remaining_purchases_amount || []).reduce(
    (acc, curr) => acc + Number(curr.total_remaining_purchases_amount || 0),
    0
  );

  const cards = [
    { title: "المصاريف", value: sumExpenses, icon: Wallet, color: "red" },
    { title: "المشتريات النقدية", value: totalPurchasesPaidAmount, icon: ShoppingCart, color: "blue" },
    { title: "المشتريات الذمم", value: sumRemainingPurchases, icon: Banknote, color: "indigo" },
    { title: "المبيعات النقدية", value: totalSalesPaidAmount, icon: TrendingUp, color: "green" },
    { title: "المبيعات الذمم", value: sumRemainingSales, icon: TrendingDown, color: "yellow" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4">
      {cards.map((card, index) => (
        <ShortCard
          key={index}
          title={card.title}
          value={card.value}
          Icon={card.icon}
          color={card.color}
        />
      ))}
    </div>
  );
}
