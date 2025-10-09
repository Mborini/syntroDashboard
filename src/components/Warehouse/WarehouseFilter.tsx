"use client";

import { WarehouseFilterDTO } from "@/types/warehouse";
import { Group, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  onFilter: (filters: WarehouseFilterDTO) => void;
};

export function WarehouseFilter({ onFilter }: Props) {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
const [quantity, setQuantity] = useState("");

useEffect(() => {
  const timeout = setTimeout(() => onFilter({ name, weight, quantity }), 300);
  return () => clearTimeout(timeout);
}, [name, weight, quantity]);

  return (
    <Group mb="md" dir="rtl" gap="xs">
      <TextInput
      radius={"md"}
        label="اسم المنتج"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        placeholder="ابحث بالاسم..."
        size="xs"
      />
      <TextInput
        radius={"md"}
        label="الوزن (كغ)"
        value={weight}
        onChange={(e) => setWeight(e.currentTarget.value)}
        placeholder="مثلاً 50"
        size="xs"
      />
    </Group>
  );
}
