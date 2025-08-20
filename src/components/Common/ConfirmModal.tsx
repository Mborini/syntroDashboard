"use client";

import { ConfirmModalProps } from "@/types/common";
import { Modal, Text, Group, Button } from "@mantine/core";



export default function ConfirmModal({
  opened,
  onClose,
  onConfirm,
  title = "Confirm",
  message = "Are you sure you want to delete this item?",
}: ConfirmModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Text mb="md">{message}</Text>
      <Group >
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button color="red" onClick={() => { onConfirm(); onClose(); }}>
          Confirm
        </Button>
      </Group>
    </Modal>
  );
}
