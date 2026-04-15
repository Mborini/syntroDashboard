"use client";

import { Group, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  onFilter: (filters: {
    region_name: string;
    vehicle_number: string;
  }) => void;
};

export function BinsLocationFilter({ onFilter }: Props) {
  const [region, setRegion] = useState("");
  const [vehicle, setVehicle] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      onFilter({
        region_name: region,
        vehicle_number: vehicle,
      });
    }, 300);

    return () => clearTimeout(t);
  }, [region, vehicle]);

  return (
    <Group mb="md" dir="rtl" gap="xs">

      <TextInput
        label="اسم المنطقة"
        value={region}
        onChange={(e) => setRegion(e.currentTarget.value)}
        size="xs"
      />

      <TextInput
        label="رقم السيارة"
        value={vehicle}
        onChange={(e) => setVehicle(e.currentTarget.value)}
        size="xs"
      />

    </Group>
  );
}