"use client";

import { Group, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { InventoryFilterDTO } from "@/types/inventory";

type Props = {
  onFilter: (filters: InventoryFilterDTO & { date: Date | null }) => void;
};

export function InventoryFilter({ onFilter }: Props) {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState<Date | null>(new Date()); // ⭐ تاريخ اليوم الافتراضي

  useEffect(() => {
    const timeout = setTimeout(() => onFilter({ name, weight, date }), 300);
    return () => clearTimeout(timeout);
  }, [name, weight, date]);

  return (
    <Group mb="md" dir="rtl" gap="xs">
      <TextInput
        label="اسم الصنف"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        placeholder="ابحث بالاسم..."
        size="xs"
      />

      <TextInput
        label="الوزن (كغ)"
        value={weight}
        onChange={(e) => setWeight(e.currentTarget.value)}
        placeholder="مثلاً 50"
        size="xs"
      />

      <TextInput
        label="التاريخ"
        radius="md"
        type="date"
        value={date ? date.toISOString().split("T")[0] : ""}
        onChange={(e) =>
          setDate(
            e.currentTarget.value ? new Date(e.currentTarget.value) : null,
          )
        }
        size="xs"
      />
    </Group>
  );
}
