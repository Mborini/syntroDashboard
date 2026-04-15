"use client";

import { Toast } from "@/lib/toast";
import { CreateExpenseTypeDTO, ExpenseTypeDrawerProps, UpdateExpenseTypeDTO } from "@/types/expenseType";


import { Button, Drawer, TextInput } from "@mantine/core";
import { useState, useEffect } from "react";

export function ExpensesTypeDrawer({
  opened,
  onClose,
  expenseType,
  onSubmit,
}: ExpenseTypeDrawerProps) {
  const [form, setForm] = useState<CreateExpenseTypeDTO | UpdateExpenseTypeDTO>({
    name: "",
  });

  useEffect(() => {
    if (expenseType) {
      setForm({ name: expenseType.name });
    } else {
      setForm({ name: "" });
    }
  }, [expenseType, opened]);

  const handleSubmit = () => {
    if (!form.name) {
      return Toast.error("الرجاء إدخال اسم نوع المصروف");
    }
    onSubmit(form);
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="sm"
      title={expenseType ? "تعديل نوع مصروف" : "إضافة نوع مصروف جديد"}
    >
      <div dir="rtl" className="flex flex-col gap-4">
        <TextInput
          variant="filled"
          radius="md"
          label="اسم نوع المصروف"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
        />

        <div className="mt-4 flex justify-center gap-2">
          <Button
            variant="light"
            color={expenseType ? "orange" : "green"}
            onClick={handleSubmit}
            fullWidth
          >
            {expenseType ? "تحديث" : "إضافة"}
          </Button>

          <Button color="red" variant="light" onClick={onClose} fullWidth>
            إلغاء
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
