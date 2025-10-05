"use client";

import { Toast } from "@/lib/toast";
import {
  CreatePurchaseItemDTO,
  UpdatePurchaseItemDTO,
  PurchaseItem,
  PurchaseItemDrawerProps,
} from "@/types/purchaseItem";
import { Button, Drawer, TextInput, Textarea, NumberInput } from "@mantine/core";
import { useState, useEffect } from "react";

export function PurchaseItemDrawer({
  opened,
  onClose,
  item,
  onSubmit,
}: PurchaseItemDrawerProps) {
  const [form, setForm] = useState<CreatePurchaseItemDTO | UpdatePurchaseItemDTO>({
    name: "",
    weight: "",
    notes: "",
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        weight: item.weight,
        notes: item.notes || "",
      });
    } else {
      setForm({
        name: "",
        weight: "",
        notes: "",
      });
    }
  }, [item, opened]);

  const handleSubmit = () => {
    if (!form.name ) {
      return Toast.error("يرجى إدخال الاسم !");
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
