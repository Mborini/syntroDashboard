"use client";

import { Group, TextInput, Select, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { getSuppliers } from "@/services/supplierServices"; // افترض أن عندك الخدمة هذه

type Props = {
  onFilter: (filters: {
    invoiceNo: string;
    supplier: string;
    itemName: string;
    startDate: string;
    endDate: string;
    status: string; // حالة الفاتورة
  }) => void;
};

export function InvoiceFilter({ onFilter }: Props) {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [supplier, setSupplier] = useState("");
  const [itemName, setItemName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([]);

  // تحديد الشهر الحالي افتراضيًا
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setStartDate(firstDay.toISOString().split("T")[0]);
    setEndDate(lastDay.toISOString().split("T")[0]);
  }, []);

  // جلب الموردين
  useEffect(() => {
    async function loadSuppliers() {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Failed to load suppliers", error);
      }
    }
    loadSuppliers();
  }, []);

  useEffect(() => {
    onFilter({ invoiceNo, supplier, itemName, startDate, endDate, status });
  }, [invoiceNo, supplier, itemName, startDate, endDate, status]);

  return (
    <Group mt={-24} dir="rtl">
      <TextInput
        label="رقم الفاتورة"
        radius="md"
        value={invoiceNo}
        onChange={(e) => setInvoiceNo(e.currentTarget.value)}
        size="xs"
      />
      
     

      <TextInput
        label="اسم الصنف"
        radius="md"
        value={itemName}
        onChange={(e) => setItemName(e.currentTarget.value)}
        size="xs"
      />

      <Group gap={1} dir="rtl">
        <TextInput
        label="من"
        
          radius="md"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.currentTarget.value)}
          size="xs"
        />
      </Group>

      <Group gap={1} dir="rtl">
        <TextInput
        label="إلى"        
          radius="md"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.currentTarget.value)}
          size="xs"
        />
      </Group>
 <Select
      label="المورد"
      dir="rtl"
        radius="md"
        
        value={supplier}
        onChange={(val) => setSupplier(val || "")}
        size="xs"
        data={[
          { value: "", label: "الكل" },
          ...suppliers.map((s) => ({ value: s.name, label: s.name })),
        ]}
      />
      <Select
        label="حالة الفاتورة"
        radius="md"
        placeholder="الحالة"
        value={status}
        onChange={(val) => setStatus(val || "")}
        size="xs"
        data={[
          { value: "", label: "الكل" },
          { value: "1", label: "ذمم" },
          { value: "2", label: "مدفوع جزئي" },
          { value: "3", label: "مدفوع" },
        ]}
      />
    </Group>
  );
}
