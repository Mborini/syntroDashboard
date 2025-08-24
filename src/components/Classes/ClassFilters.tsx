"use client";

import { useState } from "react";
import { Group, TextInput, Select } from "@mantine/core";

interface ClassFiltersProps {
  academicYears: string[];
  onFilter: (filters: { name: string; academic_year: string }) => void;
}

export function ClassFilters({ academicYears, onFilter }: ClassFiltersProps) {
  const [name, setName] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  return (
    <>
      <Group
        mt="md"
        mb="md"
        p="sm"
        className="flex flex-wrap gap-4 rounded-lg bg-white dark:bg-gray-800"
      >
        <TextInput
          placeholder="Search by name"
          value={name}
          radius="lg"
          variant="filled"
          onChange={(e) => {
            const value = e.currentTarget.value;
            setName(value);
            onFilter({ name: value, academic_year: academicYear });
          }}
          className="min-w-[200px] dark:bg-gray-700 dark:text-white"
        />

        <Select
          placeholder="Select academic year"
          value={academicYear}
          variant="filled"
          onChange={(value) => {
            const val = value || "";
            setAcademicYear(val);
            onFilter({ name, academic_year: val });
          }}
          data={academicYears}
          clearable
          radius="lg"
          className="min-w-[200px] dark:bg-gray-700 dark:text-white"
        />
      </Group>
    </>
  );
}
