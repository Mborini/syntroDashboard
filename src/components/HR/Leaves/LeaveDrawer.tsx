"use client";

import { Drawer, TextInput, Select, Button } from "@mantine/core";
import { useState, useEffect } from "react";
import { Toast } from "@/lib/toast";
import { Employee } from "@/types/employee";
import { getEmployees } from "@/services/employeeServices";
import { FormLeave, LeaveDrawerProps } from "@/types/leave";

export function LeaveDrawer({ opened, onClose, leave, onSubmit }: LeaveDrawerProps) {
  const [form, setForm] = useState<FormLeave>({
    employee_id: 0,
    date: "",
    reason: "",
  });

  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error(error);
      }
    }
    loadEmployees();
  }, []);

  useEffect(() => {
  if (leave) {
    // تنسيق التاريخ ليكون مناسب لحقل type="date"
const formattedDate = leave.date
  ? new Date(leave.date).toLocaleDateString("en-CA") // يعطيك yyyy-MM-dd
  : "";
    setForm({
      employee_id: leave.employee_id,
      date: formattedDate,
      reason: leave.reason,
    });
  } else {
    setForm({
      employee_id: 0,
      date: "",
      reason: "",
    });
  }
}, [leave, opened]);

  const handleSubmit = () => {
    if (!form.employee_id || !form.date || !form.reason) {
      return Toast.error("الرجاء تعبئة جميع الحقول!");
    }
    onSubmit(form);
    onClose();
  };

  return (
    <Drawer opened={opened} onClose={onClose} position="right" size="sm" title={leave ? "تعديل الإجازة" : "اضافة إجازة"}>
      <div dir="rtl" className="flex flex-col gap-4">
        <Select
          variant="filled"
          label="الموظف"
          placeholder="اختر الموظف"
          value={form.employee_id ? form.employee_id.toString() : undefined}
          onChange={(val) => setForm({ ...form, employee_id: Number(val) })}
          data={employees.map((e) => ({ value: e.id.toString(), label: e.name }))}
        />
        <TextInput
        variant="filled"
          label="التاريخ"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.currentTarget.value })}
        />
        <TextInput
        variant="filled"
          label="السبب"
          placeholder="أدخل السبب"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.currentTarget.value })}
        />

        <div className="mt-4 flex justify-center gap-2">
          <Button color="green" fullWidth variant="light" onClick={handleSubmit}>
            {leave ? "تعديل وحفظ" : "إضافة"}
          </Button>
          <Button color="red" fullWidth variant="light" onClick={onClose}>
            الغاء
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
