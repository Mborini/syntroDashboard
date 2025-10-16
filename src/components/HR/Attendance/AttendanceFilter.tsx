"use client";

import { Group, TextInput, Select } from "@mantine/core";
import { useState, useEffect } from "react";
import { getEmployees } from "@/services/employeeServices"; // افترض أن عندك خدمة لجلب الموظفين

type Props = {
  onFilter: (filters: { employee: string; date: string }) => void;
};

export function AttendanceFilter({ onFilter }: Props) {
  const [employee, setEmployee] = useState("");
  const [date, setDate] = useState("");
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>([]);

  // ضبط التاريخ الافتراضي لليوم الحالي
  useEffect(() => {
    const today = new Date();
    setDate(today.toISOString().split("T")[0]);
  }, []);

  // جلب الموظفين
  useEffect(() => {
    async function loadEmployees() {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to load employees", error);
      }
    }
    loadEmployees();
  }, []);

  // إرسال الفلتر إلى المكون الأب
  useEffect(() => {
    onFilter({ employee, date });
  }, [employee, date]);

  return (
    <Group  dir="rtl">
      <Select
        label="اسم الموظف"
        dir="rtl"
        radius="md"
        value={employee}
        onChange={(val) => setEmployee(val || "")}
        size="xs"
        data={[
          { value: "", label: "الكل" },
          ...employees.map((e) => ({ value: e.name, label: e.name })),
        ]}
      />

      <TextInput
        label="التاريخ"
        radius="md"
        type="date"
        value={date}
        onChange={(e) => setDate(e.currentTarget.value)}
        size="xs"
      />
    </Group>
  );
}
