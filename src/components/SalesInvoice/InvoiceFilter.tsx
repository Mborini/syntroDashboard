"use client";

import { Group, TextInput, Select, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { getSuppliers } from "@/services/supplierServices"; // افترض أن عندك الخدمة هذه
import { getCustomers } from "@/services/customerServices";

type Props = {
  onFilter: (filters: {
    invoiceNo: string;
    customer: string;
    itemName: string;
    startDate: string;
    endDate: string;
    status: string; // حالة الفاتورة
  }) => void;
};

export function InvoiceFilter({ onFilter }: Props) {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [customer, setCustomer] = useState("");
  const [itemName, setItemName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [customers, setCustomers] = useState<{ id: number; name: string }[]>([]);

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
    async function loadCustomers() {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to load customers", error);
      }
    }
    loadCustomers();
  }, []);

  useEffect(() => {
    onFilter({ invoiceNo, customer, itemName, startDate, endDate, status });
  }, [invoiceNo, customer, itemName, startDate, endDate, status]);

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
      label="الزبون"
      dir="rtl"
        radius="md"

        value={customer}
        onChange={(val) => setCustomer(val || "")}
        size="xs"
        data={[
          { value: "", label: "الكل" },
          ...customers.map((c) => ({ value: c.name, label: c.name })),
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
