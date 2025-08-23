"use client";

import { Toast } from "@/lib/toast";
import {
  CreateUserDTO,
  FormUser,
  UpdateUserDTO,
  User,
  UserDrawerProps,
} from "@/types/user";
import { Drawer, TextInput, Button, Select } from "@mantine/core";
import { useState, useEffect } from "react";
import { AppButton } from "../ui-elements/button";

interface Role {
  id: number;
  name: string;
}

export function UserDrawer({
  opened,
  onClose,
  user,
  onSubmit,
}: UserDrawerProps) {
  const [form, setForm] = useState<FormUser>({
    username: "",
    role_id: undefined,
    is_active: true,
    password: "",
  });
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        role_id: (user as any).role_id,
        is_active: user.is_active,
      });
    } else {
      setForm({
        username: "",
        role_id: undefined,
        is_active: true,
        password: "",
      });
    }

    // fetch roles
    async function loadRoles() {
      try {
        const res = await fetch("/api/roles");
        const data: Role[] = await res.json();
        setRoles(data);
      } catch (error) {
        console.error("Failed to load roles", error);
      }
    }
    loadRoles();
  }, [user, opened]);

  const handleSubmit = () => {
    if (!form.role_id) return Toast.error("Please select a role!");
    onSubmit(form as CreateUserDTO | UpdateUserDTO);
    onClose();
  };

  return (
    <Drawer
      bg={"red"}
      opened={opened}
      onClose={onClose}
      position="right"
      size="sm"
      title={user ? "Edit User" : "Add User"}
    >
      <div className="flex flex-col gap-4">
        <TextInput
          radius={"md"}
          label="Username"
          placeholder="Enter username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.currentTarget.value })
          }
        />

        <Select
          radius={"md"}
          label="Role"
          placeholder="Select role"
          value={form.role_id?.toString()}
          onChange={(val) => setForm({ ...form, role_id: Number(val) })}
          data={roles.map((r) => ({ value: r.id.toString(), label: r.name }))}
        />

        {!user && (
          <TextInput
            label="Password"
            radius={"md"}
            placeholder="Enter password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.currentTarget.value })
            }
          />
        )}

        <div className="mt-4 flex justify-center gap-2">
          <AppButton
            color={user ? "orange" : "green"}
            onClick={handleSubmit}
            fullWidth
          >
            {user ? "Update" : "Create"}
          </AppButton>
          <AppButton color="red" onClick={onClose} fullWidth>
            Cancel
          </AppButton>
        </div>
      </div>
    </Drawer>
  );
}
