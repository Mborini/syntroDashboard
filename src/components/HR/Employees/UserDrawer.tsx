"use client";

import { Toast } from "@/lib/toast";
import {
  CreateEmployeeDTO,
  EmployeeDrawerProps,
  FormEmployee,
  UpdateEmployeeDTO,
} from "@/types/employee";
import { Drawer, TextInput, Switch, Button } from "@mantine/core";
import { useState, useEffect } from "react";

export function EmployeeDrawer({
  opened,
  onClose,
  employee,
  onSubmit,
}: EmployeeDrawerProps) {
  const [form, setForm] = useState<FormEmployee>({
    name: "",
    phone: "",
    address: "",
    start_date: "",
    end_date: "",
    salary: 0,
    is_active: true,
  });

 useEffect(() => {
  if (employee) {
    setForm({
      name: employee.name,
      phone: employee.phone,
      address: employee.address,
      start_date: employee.start_date
        ? employee.start_date.split("T")[0]
        : "",
      end_date: employee.end_date
        ? employee.end_date.split("T")[0]
        : "",
      salary: employee.salary,
      is_active: employee.is_active,
    });
  } else {
    setForm({
      name: "",
      phone: "",
      address: "",
      start_date: "",
      end_date: "",
      salary: 0,
      is_active: true,
    });
  }
}, [employee, opened]);


  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.start_date) {
      return Toast.error("Please fill in all required fields!");
    }

    if (form.end_date && form.end_date < form.start_date) {
      return Toast.error("End date must be after start date!");
    }

    if (form.salary <= 0) {
      return Toast.error("Salary must be greater than zero!");
    }

    onSubmit(form as CreateEmployeeDTO | UpdateEmployeeDTO);
    onClose();
  };

  // التحقق إذا كانت جميع الحقول المطلوبة موجودة وصحيحة
  const isDisabled =
    !form.name ||
    !form.phone ||
    !form.start_date ||
    (form.end_date && form.end_date < form.start_date) ||
    form.salary <= 0;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="sm"

      title={employee ? "تعديل الموظف" : "اضافة موظف جديد"}
    >
      <div dir="rtl" className="flex flex-col gap-4">
        <TextInput
        variant="filled"
          radius="md"
          label="الاسم"
          placeholder="أدخل الاسم"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
        />

        <TextInput
        variant="filled"
          radius="md"
          label="رقم الهاتف"
          placeholder="أدخل رقم الهاتف"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.currentTarget.value })}
        />

        <TextInput
        variant="filled"
          radius="md"
          label="العنوان"
          placeholder="أدخل العنوان"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.currentTarget.value })}
        />

        <TextInput
        variant="filled"
          radius="md"
          type="date"
          label="تاريخ البدء"
          placeholder="YYYY-MM-DD"
          value={form.start_date}
          onChange={(e) =>
            setForm({ ...form, start_date: e.currentTarget.value })
          }
        />

        <TextInput
        variant="filled"
          radius="md"
          type="date"
          label="نهاية العقد"
          placeholder="YYYY-MM-DD"
          value={form.end_date}
          onChange={(e) =>
            setForm({ ...form, end_date: e.currentTarget.value })
          }
        />

        <TextInput
        variant="filled"
          radius="md"
          label="الراتب"
          placeholder="أدخل الراتب"
          type="number"
          value={form.salary}
          onChange={(e) =>
            setForm({ ...form, salary: Number(e.currentTarget.value) })
          }
          min={0}
        />

        <Switch
          label="الحالة"
          checked={form.is_active}
          onChange={(e) =>
            setForm({ ...form, is_active: e.currentTarget.checked })
          }
        />

        <div className="mt-4 flex justify-center gap-2">
          <Button
            variant="light"
            color={employee ? "orange" : "green"}
            onClick={handleSubmit}
            fullWidth
            disabled={isDisabled}
          >
            {employee ? "تعديل و حفظ" : "اضافة"}
          </Button>
          <Button variant="light" color="red" onClick={onClose} fullWidth>
            الغاء
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
