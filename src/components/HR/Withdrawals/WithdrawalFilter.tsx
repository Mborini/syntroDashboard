// components/Withdrawals/WithdrawalFilter.tsx
"use client";

import { Group, Select, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { Employee } from "@/types/employee";

export interface WithdrawalFilterDTO {
  employee_id?: number;
  startDate?: Date;
  endDate?: Date;
}

type Props = {
  employees: Employee[];
  onFilter: (filters: WithdrawalFilterDTO) => void;
};

export function WithdrawalFilter({ employees, onFilter }: Props) {
  const [employeeId, setEmployeeId] = useState<number | undefined>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilter({
        employee_id: employeeId,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [employeeId, startDate, endDate]);

  return (
    <Group mb="md" dir="rtl" gap="xs">
      <Select
      radius="md"
        label="الموظف"
        placeholder="اختر موظف..."
        data={employees.map(e => ({ value: e.id.toString(), label: e.name }))}
        value={employeeId?.toString() || ""}
        onChange={(val) => setEmployeeId(val ? Number(val) : undefined)}
        size="xs"
        clearable
      />

        <TextInput
        radius="md"
        type="date"
        label="من تاريخ"
        value={startDate ? startDate.toISOString().slice(0, 10) : ""}
        onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
        size="xs"
       
      />

      <TextInput
        radius="md"
        type="date"
        label="إلى تاريخ"
        value={endDate ? endDate.toISOString().slice(0, 10) : ""}
        onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
        size="xs"
        
      />
    </Group>
  );
}
