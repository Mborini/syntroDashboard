"use client";

import { Group, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { InventoryFilterDTO } from "@/types/inventory";

type Props = {
  onFilter: (filters: InventoryFilterDTO) => void;
};

export function InventoryFilter({ onFilter }: Props) {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => onFilter({ name, weight }), 300);
    return () => clearTimeout(timeout);
  }, [name, weight]);

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
    </Group>
  );
}
