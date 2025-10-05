"use client";

import { useEffect, useState } from "react";
import { Drawer, TextInput, NumberInput, Textarea, Button } from "@mantine/core";
import { Toast } from "@/lib/toast";
import {
  CreateInventoryItemDTO,
  UpdateInventoryItemDTO,
  InventoryItem,
} from "@/types/inventory";

type Props = {
  opened: boolean;
  onClose: () => void;
  item?: InventoryItem | null;
  onSubmit: (data: CreateInventoryItemDTO | UpdateInventoryItemDTO) => void;
};

export function InventoryDrawer({ opened, onClose, item, onSubmit }: Props) {
  const [form, setForm] = useState<CreateInventoryItemDTO | UpdateInventoryItemDTO>({
    name: "",
    weight: 0,
    quantity: 0,
    notes: "",
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        weight: item.weight,
        quantity: item.quantity,
        notes: item.notes || "",
      });
    } else {
      setForm({ name: "", weight: 0, quantity: 0, notes: "" });
    }
  }, [item, opened]);

  const handleSubmit = () => {
    if (!form.name || form.weight <= 0 || form.quantity < 0) {
      return Toast.error("يرجى تعبئة جميع الحقول بشكل صحيح");
    }
    onSubmit(form);
    onClose();
  };

  return (
    <Drawer opened={opened} onClose={onClose} position="right" size="sm"
      title={item ? "تعديل صنف" : "إضافة صنف جديد"}>
      <div dir="rtl" className="flex flex-col gap-4">
        <TextInput
          label="اسم الصنف"
          variant="filled"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
        />
        <NumberInput
          label="الوزن (كغ)"
          variant="filled"
          value={form.weight}
          min={0}
          onChange={(val) => setForm({ ...form, weight: Number(val) })}
        />
        <NumberInput
          label="الكمية"
          variant="filled"
          value={form.quantity}
          min={0}
          onChange={(val) => setForm({ ...form, quantity: Number(val) })}
        />
        <Textarea
          label="ملاحظات"
          variant="filled"
          value={form.notes || ""}
          onChange={(e) => setForm({ ...form, notes: e.currentTarget.value })}
        />

        <Button color={item ? "orange" : "green"} fullWidth onClick={handleSubmit}>
          {item ? "تحديث" : "إضافة"}
        </Button>
        <Button color="red" variant="light" fullWidth onClick={onClose}>
          إلغاء
        </Button>
      </div>
    </Drawer>
  );
}
