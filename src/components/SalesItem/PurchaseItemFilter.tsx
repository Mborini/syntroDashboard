"use client";

import { Group, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  onFilter: (filters: {
    name: string;
    weight: string;
    barcode: string;
    notes: string;
  }) => void;
};

export function SalesItemFilter({ onFilter }: Props) {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState<string>("");
  const [barcode, setBarcode] = useState("");
  const [notes, setNotes] = useState("");

  // ✅ تطبيق الفلتر تلقائيًا عند تغيير أي قيمة
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilter({ name, weight, barcode, notes });
    }, 300);
    return () => clearTimeout(timeout);
  }, [name, weight, barcode, notes, onFilter]);

  return (
    <Group mb="md" dir="rtl" gap="xs">
      <TextInput
        label="اسم الصنف"
        radius="md"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        size="xs"
        placeholder="ابحث بالاسم..."
      />

      <TextInput
        label="الوزن (ك)"
        radius="md"
        value={weight}
        onChange={(e) => setWeight(e.currentTarget.value)}
        size="xs"
        placeholder="مثلاً 50"
      />


      <TextInput
        label="ملاحظات"
        radius="md"
        value={notes}
        onChange={(e) => setNotes(e.currentTarget.value)}
        size="xs"
        placeholder="ابحث بالملاحظات..."
      />
    </Group>
  );
}
