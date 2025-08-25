"use client";

import { TextInput, Group, Button, Select } from "@mantine/core";
import { useState, useEffect } from "react";

interface ParentFiltersProps {
  onFilter: (filters: { name: string; phone: string; status: string }) => void;
}

export function ParentFilters({ onFilter }: ParentFiltersProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(""); // "active", "inactive" أو ""

  // عند أي تغيير في الحقول، يتم إرسال الفلاتر مباشرة
  useEffect(() => {
    onFilter({ name, phone, status });
  }, [name, phone, status, onFilter]);

  return (
    <Group
      mt="md"
      mb="md"
      p="sm"
      className="flex flex-wrap gap-4 rounded-lg bg-white dark:bg-gray-800"
    >
      <TextInput
      radius="lg"
          variant="filled"
        placeholder="Search by name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextInput
      radius="lg"
          variant="filled"
        placeholder="Search by phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Select
      radius="lg"
          variant="filled"
        placeholder="Select status"
        value={status}
        onChange={(value) => setStatus(value || "")}
        data={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
        clearable
      />
    </Group>
  );
}
