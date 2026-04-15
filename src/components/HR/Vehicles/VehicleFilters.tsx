"use client";

import { Group, TextInput, NumberInput } from "@mantine/core";
import { useState } from "react";

type FilterProps = {
  onFilter: (filters: { plate: string; subFleet: string; containerSize: number | null }) => void;
};

export function VehicleFilters({ onFilter }: FilterProps) {
  const [plate, setPlate] = useState("");
  const [subFleet, setSubFleet] = useState("");
  const [containerSize, setContainerSize] = useState<number | null>(null);

  const handlePlateChange = (value: string) => {
    setPlate(value);
    onFilter({ plate: value, subFleet, containerSize });
  };

  const handleSubFleetChange = (value: string) => {
    setSubFleet(value);
    onFilter({ plate, subFleet: value, containerSize });
  };

  const handleContainerSizeChange = (value: string | number) => {
    let parsedValue: number | null;
    if (typeof value === "number") {
      parsedValue = value;
    } else if (value.trim() === "") {
      parsedValue = null;
    } else {
      const num = Number(value);
      parsedValue = isNaN(num) ? null : num;
    }
    setContainerSize(parsedValue);
    onFilter({ plate, subFleet, containerSize: parsedValue });
  };

  return (
    <Group dir="rtl" mb="xs" className="flex-wrap gap-2">
      <TextInput
        placeholder="رقم اللوحة"
        value={plate}
        radius="md"
        onChange={(e) => handlePlateChange(e.currentTarget.value)}
      />
      <TextInput
        placeholder="المنطقة"
        value={subFleet}
        radius="md"     
        onChange={(e) => handleSubFleetChange(e.currentTarget.value)}
      />
      <NumberInput
        placeholder="الحمولة / طن"
        value={containerSize === null ? undefined : containerSize}
        onChange={handleContainerSizeChange}
        min={0}
      />
    </Group>
  );
}