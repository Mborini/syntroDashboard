"use client";

import { Toast } from "@/lib/toast";
import {
  CreateSalesItemDTO,
  SalesItemDrawerProps,
  UpdateSalesItemDTO,
} from "@/types/salesItem";
import { Button, Drawer, NumberInput, TextInput, Textarea } from "@mantine/core";
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
const [isSaving, setIsSaving] = useState(false);

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

 const handleSubmit = async () => {
  if (isDisabled) {
    return Toast.error("يرجى تعبئة جميع الحقول الأساسية قبل الحفظ");
  }
  try {
    setIsSaving(true); // 🔹 تعطيل الزر أثناء العملية
    await onSubmit(form); // انتظار العملية إذا كانت async
    onClose();
  } catch (error) {
    console.error(error);
    Toast.error("حدث خطأ أثناء الحفظ");
  } finally {
    setIsSaving(false); // 🔹 إعادة تمكين الزر
  }
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
        <NumberInput
        min={0}
          variant="filled"
          radius="md"
          label="الوزن (ك)"
          value={form.weight}
          onChange={(value) => setForm({ ...form, weight: value !== undefined && value !== null ? String(value) : "" })}
        />
        <NumberInput
          variant="filled"
          radius="md"
          label="سعر التكلفة"
          value={form.cost_price}
             onChange={(value) => setForm({ ...form, cost_price: value !== undefined && value !== null ? String(value) : "" })}
        />
        <NumberInput
          variant="filled"
          radius="md"
          label="سعر البيع"
          value={form.sale_price}
               onChange={(value) => setForm({ ...form, sale_price: value !== undefined && value !== null ? String(value) : "" })}
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
  disabled={isDisabled || isSaving} // 🔹 تعطيل الزر أثناء الحفظ
>
  {isSaving ? (item ? "جارٍ التحديث..." : "جارٍ الإضافة...") : item ? "تحديث" : "إضافة"}
</Button>

          <Button color="red" variant="light" onClick={onClose} fullWidth>
            إلغاء
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
