"use client";
import { ConfirmModalProps } from "@/types/common";
import { Modal, Text, Group } from "@mantine/core";
import { AppButton } from "../ui-elements/button";

export default function ConfirmModal({
  opened,
  onClose,
  onConfirm,
  color = "red",
  title = "Confirm",
  message = "Are you sure you want to delete this item?",
}: ConfirmModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Text mb="md">{message}</Text>
      <Group>
        <AppButton color="gray" onClick={onClose}>
          Cancel
        </AppButton>
        <AppButton
          color={color}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Confirm
        </AppButton>
      </Group>
    </Modal>
  );
}
