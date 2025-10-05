"use client";

import { Toast } from "@/lib/toast";
import { CreateCustomerDTO, CustomerDrawerProps, UpdateCustomerDTO } from "@/types/customer";

import { Button, Drawer, TextInput } from "@mantine/core";
import { useState, useEffect } from "react";

export function CustomerDrawer({
  opened,
  onClose,
  customer,
  onSubmit,
}: CustomerDrawerProps) {
  const [form, setForm] = useState<CreateCustomerDTO | UpdateCustomerDTO>({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
      });
    } else {
      setForm({
        name: "",
        phone: "",
        address: "",
      });
    }
  }, [customer, opened]);

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.address) {
      return Toast.error("الرجاء تعبئة جميع الحقول!");
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
      title={customer ? "تعديل زبون" : "اضافة زبون جديد"}
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
            color={customer ? "orange" : "green"}
            onClick={handleSubmit}
            fullWidth
          >
            {customer ? "تحديث" : "اضافة"}
          </Button>
          <Button color="red" variant="light" onClick={onClose} fullWidth>
            الغاء
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
