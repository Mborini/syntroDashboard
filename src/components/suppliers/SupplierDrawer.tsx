"use client";

import { Toast } from "@/lib/toast";
import {
  CreateSupplierDTO,
  UpdateSupplierDTO,
  Supplier,
  SupplierDrawerProps,
} from "@/types/supplier";
import { Button, Drawer, TextInput } from "@mantine/core";
import { AppButton } from "../ui-elements/button";
import { useState, useEffect } from "react";

export function SupplierDrawer({
  opened,
  onClose,
  supplier,
  onSubmit,
}: SupplierDrawerProps) {
  const [form, setForm] = useState<CreateSupplierDTO | UpdateSupplierDTO>({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name,
        phone: supplier.phone,
        address: supplier.address,
      });
    } else {
      setForm({
        name: "",
        phone: "",
        address: "",
      });
    }
  }, [supplier, opened]);

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.address) {
      return Toast.error("Please fill in all fields!");
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
      title={supplier ? "تعديل مورد" : "اضافة مورد جديد"}
    >
      <div dir="rtl" className="flex flex-col gap-4">
        <TextInput
          variant="filled"
          radius="md"
          label="الاسم"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
        />
        <TextInput
          variant="filled"
          radius="md"
          label="الهاتف"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.currentTarget.value })}
        />
        <TextInput
          variant="filled"
          radius="md"
          label="العنوان"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.currentTarget.value })}
        />

        <div className="mt-4 flex justify-center gap-2">
          <Button
            variant="light"
            color={supplier ? "orange" : "green"}
            onClick={handleSubmit}
            fullWidth
          >
            {supplier ? "تحديث" : "اضافة"}
          </Button>
          <Button color="red" variant="light" onClick={onClose} fullWidth>
            الغاء
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
