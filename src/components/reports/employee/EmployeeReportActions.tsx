// components/EmployeeReport/EmployeeReportActions.tsx
"use client";

import { Button, Group } from "@mantine/core";
import { MutableRefObject } from "react";
import { IoMdPrint } from "react-icons/io";

type Props = {
  tableRef: MutableRefObject<HTMLTableElement | null>;
};

export function EmployeeReportActions({ tableRef }: Props) {
  const handlePrint = () => {
    if (!tableRef.current) return;

    const printContent = tableRef.current.outerHTML;

    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // لإعادة تهيئة React بعد استبدال body
  };

  return (
    <Group >
      <Button variant="light" color="green" onClick={handlePrint}><IoMdPrint size={24} /></Button>
    </Group>
  );
}
