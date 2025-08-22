// components/AppButton.tsx
"use client";

import { Button } from "@mantine/core";
import { ReactNode } from "react";

interface AppButtonProps {
  color?: string;
  onClick?: () => void;
  children: ReactNode;
  radius?: "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
}

export function AppButton({
  color,
  onClick,
  children,
  radius = "md",
  fullWidth = false,
}: AppButtonProps) {
  return (
    <Button
      radius={radius}
      color={color}
      onClick={onClick}
      w={fullWidth ? "100%" : undefined}
    >
      {children}
    </Button>
  );
}
