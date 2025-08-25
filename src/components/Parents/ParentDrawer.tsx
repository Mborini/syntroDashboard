"use client";

import { useEffect, useState } from "react";
import { Drawer, TextInput, Select, Switch } from "@mantine/core";
import { AppButton } from "../ui-elements/button";
import {
  CreateParentDTO,
  ParentDrawerProps,
  UpdateParentDTO,
} from "@/types/parent";

export function ParentDrawer({
  opened,
  onClose,
  parent,
  onSubmit,
}: ParentDrawerProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (parent) {
      setName(parent.name);
      setPhoneNumber(parent.phone_number);
      setIsActive(parent.is_active);
      setPassword(parent.password);
    } else {
      setName("");
      setPhoneNumber("");
      setIsActive(true);
      setPassword("");
    }
  }, [parent, opened]);

  const handleSubmit = () => {
    const data: CreateParentDTO | UpdateParentDTO = {
      name,
      is_active: isActive,
      password,
      phone_number: phoneNumber,
    };
    console.log(data);
    onSubmit(data);
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="sm"
      title={parent ? "تعديل ولي الأمر" : "إضافة ولي أمر"}
    >
      <div className="flex flex-col gap-4">
        <TextInput
          variant="filled"
          radius="lg"
          label="اسم ولي الأمر"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        <TextInput
          variant="filled"
          radius="lg"
          label="رقم الهاتف"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.currentTarget.value)}
        />
        {!parent && (
          <TextInput
            variant="filled"
            radius="lg"
            label="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)} 

          />
        )}
        <Switch
          label="فعال"
          color="green"
          size="sm"
          checked={isActive}
          onChange={(e) => setIsActive(e.currentTarget.checked)}
        />
        <AppButton
          onClick={handleSubmit}
          color={parent ? "orange" : "blue"}
          fullWidth
        >
          {parent ? "تحديث" : "إضافة"}
        </AppButton>
      </div>
    </Drawer>
  );
}
