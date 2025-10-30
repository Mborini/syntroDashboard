"use client";

import { Group, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  onFilter: (filters: { name: string; month: string }) => void;
};

// دالة مساعدة لإرجاع YYYY-MM للشهر الحالي
const getCurrentMonth = () => {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // يضيف صفر قبل الرقم إذا أقل من 10
  return `${today.getFullYear()}-${month}`;
};

export function EmployeeReportFilter({ onFilter }: Props) {
  const [name, setName] = useState("");
  const [month, setMonth] = useState(getCurrentMonth()); // الشهر الحالي كقيمة افتراضية

  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilter({ name, month }); // month الآن بصيغة YYYY-MM
    }, 400);

    return () => clearTimeout(timeout);
  }, [name, month]);

  return (
    <Group mb="md" dir="rtl" gap="xs">
      <TextInput
        label="اسم الموظف"
        radius="md"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        size="xs"
        placeholder="ابحث بالاسم..."
      />

      <TextInput
        label="الشهر"
        radius="md"
        type="month"
        value={month}
        onChange={(e) => setMonth(e.currentTarget.value)}
        size="xs"
        placeholder="اختر الشهر"
      />
    </Group>
  );
}
