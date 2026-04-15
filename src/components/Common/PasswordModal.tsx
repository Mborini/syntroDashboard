"use client";

import { Modal, PasswordInput, Button, Group } from "@mantine/core";
import { useState } from "react";

interface PasswordModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export default function PasswordModal({
  opened,
  onClose,
  onConfirm,
}: PasswordModalProps) {
  const [password, setPassword] = useState("");

  const handleConfirm = () => {
    if (!password) return;
    onConfirm(password);
    setPassword("");
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Change Password" centered>
      <Group className="justify-end">
        <Button variant="default" onClick={onClose}>
          Cancel
          <PasswordInput
            variant="filled"
            radius="lg"
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            mb="md"
          />
        </Button>
        <Button color="violet" onClick={handleConfirm}>
          Save
        </Button>
      </Group>
    </Modal>
  );
}
