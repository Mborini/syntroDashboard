"use client";
import { ConfirmModalProps } from "@/types/common";
import { Modal, Text, Group } from "@mantine/core";
import { AppButton } from "../ui-elements/button";
import { BadgeCheck, OctagonAlertIcon, TriangleAlert } from "lucide-react";

export default function ConfirmModal({
  opened,
  onClose,
  onConfirm,
  color = "red",
  title = "Confirm",
  message = "Are you sure you want to delete it?",
}: ConfirmModalProps) {
  let titleIcon = <OctagonAlertIcon color="red" />;
  if (color === "green") {
    titleIcon = <BadgeCheck color="green" />;
  } else if (color === "yellow") {
    titleIcon = <TriangleAlert color="yellow" />;
  }
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title={
        <Group>
          {titleIcon}
          <Text>{title}</Text>
        </Group>
      }
    >
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
