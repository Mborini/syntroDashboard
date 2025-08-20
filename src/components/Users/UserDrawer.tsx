"use client";

import { User, UserDrawerProps } from "@/types/user";
import { Drawer, TextInput, Button } from "@mantine/core";
import { useState } from "react";

export function UserDrawer({
  opened,
  onClose,
  user,
  onSubmit,
}: UserDrawerProps) {
  const [form, setForm] = useState<User>(user || { username: "", role: "" });

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      overlayProps={{ backgroundOpacity: 0.5, blur: 2 }}
      size="sm"
      title={user ? "Edit User" : "Add User"}
    >
      <div className="flex flex-col gap-4">
        <TextInput
          label="Username"
          radius={"md"}
          placeholder="Enter username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.currentTarget.value })
          }
          className="!text-sm"
        />
        <TextInput
          label="Role"
          radius={"md"}
          placeholder="Enter role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.currentTarget.value })}
          className="!text-sm"
        />
        <div className="mt-4 flex justify-center">
          <Button
            radius={"md"}
            w={"50%"}
            variant="light"
            onClick={handleSubmit}
            color={user ? "orange" : "green"}
          >
            {user ? "Update" : "Create"}
          </Button>
          <Button
            radius={"md"}
            w={"50%"}
            variant="light"
            color="red"
            onClick={onClose}
            className="ml-2"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
