// components/Withdrawals/WithdrawalDrawer.tsx
"use client";

import { Drawer, TextInput, NumberInput, Textarea, Button, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { Toast } from "@/lib/toast";
import { Withdrawal, CreateWithdrawalDTO, UpdateWithdrawalDTO } from "@/types/withdrawal";
import { Employee } from "@/types/employee";

interface WithdrawalDrawerProps {
  opened: boolean;
  onClose: () => void;
  withdrawal?: Withdrawal;
  employees: Employee[];
  onSubmit: (data: CreateWithdrawalDTO | UpdateWithdrawalDTO) => void;
}

export function WithdrawalDrawer({ opened, onClose, withdrawal, onSubmit, employees }: WithdrawalDrawerProps) {
  const [form, setForm] = useState<CreateWithdrawalDTO>({
    employee_id: employees[0]?.id || 0,
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

useEffect(() => {
  if (withdrawal) {
    const formattedDate = withdrawal.date
      ? new Date(withdrawal.date).toLocaleDateString("en-CA") // yyyy-MM-dd
      : new Date().toISOString().split("T")[0];

    setForm({
      employee_id: withdrawal.employee_id,
      amount: withdrawal.amount,
      date: formattedDate,
      note: withdrawal.note || "",
    });
  } else {
    setForm({
      employee_id: employees[0]?.id || 0,
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      note: "",
    });
  }
}, [withdrawal, opened, employees]);

  const handleSubmit = () => {
    if (!form.employee_id || form.amount <= 0 || !form.date) {
      return Toast.error("الرجاء تعبئة جميع الحقول المطلوبة!");
    }
    onSubmit(form);
    onClose();
  };

  return (
    <Drawer opened={opened} onClose={onClose} size="sm" position="right" title={withdrawal ? "تعديل مسحوبة" : "إضافة مسحوبة"}>
      <div dir="rtl" className="flex flex-col gap-4">
        <Select
          variant="filled"
          radius="md"
          label="الموظف"
          data={employees.map(e => ({ value: e.id.toString(), label: e.name }))}
          value={form.employee_id.toString()}
          onChange={(val) => setForm({ ...form, employee_id: Number(val) })}
        />
        <NumberInput
          variant="filled"
          radius="md"
          label="المبلغ"
          value={form.amount}
          onChange={(val) => setForm({ ...form, amount: Number(val) || 0 })}
          min={0}
        />
        <TextInput
          variant="filled"
          radius="md"
          label="التاريخ"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.currentTarget.value })}
        />
        <Textarea
          variant="filled"
          radius="md"
          label="ملاحظة"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.currentTarget.value })}
        />

        <div className="mt-4 flex justify-center gap-2">
          <Button variant="light" color={withdrawal ? "orange" : "green"} fullWidth onClick={handleSubmit}>
            {withdrawal ? "تعديل وحفظ" : "إضافة"}
          </Button>
          <Button variant="light" color="red" fullWidth onClick={onClose}>إلغاء</Button>
        </div>
      </div>
    </Drawer>
  );
}
