"use client";

import { Toast } from "@/lib/toast";
import {
  CreateSalesItemDTO,
  SalesItemDrawerProps,
  UpdateSalesItemDTO,
} from "@/types/salesItem";
import { Button, Drawer, TextInput, Textarea } from "@mantine/core";
import { useState, useEffect } from "react";

export function SalesItemDrawer({
  opened,
  onClose,
  item,
  onSubmit,
}: SalesItemDrawerProps) {
  const [form, setForm] = useState<CreateSalesItemDTO | UpdateSalesItemDTO>({
    name: "",
    sale_price: "",
    cost_price: "",
    weight: "",
    notes: "",
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        sale_price: item.sale_price,
        cost_price: item.cost_price,
        weight: item.weight,
        notes: item.notes || "",
      });
    } else {
      setForm({
        name: "",
        sale_price: "",
        cost_price: "",
        weight: "",
        notes: "",
      });
    }
  }, [item, opened]);

  // تحقق من الحقول الأساسية
  const isDisabled =
    !form.name || !form.weight || !form.sale_price || !form.cost_price;

  const handleSubmit = () => {
    if (isDisabled) {
      return Toast.error("يرجى تعبئة جميع الحقول الأساسية قبل الحفظ");
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
      title={item ? "تعديل صنف" : "إضافة صنف جديد"}
    >
      <div dir="rtl" className="flex flex-col gap-4">
        <TextInput
          variant="filled"
          radius="md"
          label="اسم الصنف"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
        />
        <TextInput
          variant="filled"
          radius="md"
          label="الوزن (ك)"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.currentTarget.value })}
        />
        <TextInput
          variant="filled"
          radius="md"
          label="سعر التكلفة"
          value={form.cost_price}
          onChange={(e) =>
            setForm({ ...form, cost_price: e.currentTarget.value })
          }
        />
        <TextInput
          variant="filled"
          radius="md"
          label="سعر البيع"
          value={form.sale_price}
          onChange={(e) =>
            setForm({ ...form, sale_price: e.currentTarget.value })
          }
        />
        <Textarea
          variant="filled"
          radius="md"
          label="ملاحظات"
          value={form.notes ?? ""}
          onChange={(e) => setForm({ ...form, notes: e.currentTarget.value })}
        />

        <div className="mt-4 flex justify-center gap-2">
          <Button
            variant="light"
            color={item ? "orange" : "green"}
            onClick={handleSubmit}
            fullWidth
            disabled={isDisabled} // تعطيل الزر إذا كان أي حقل ناقص
          >
            {item ? "تحديث" : "إضافة"}
          </Button>
          <Button color="red" variant="light" onClick={onClose} fullWidth>
            إلغاء
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
