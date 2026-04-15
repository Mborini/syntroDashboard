// components/ui-elements/button.tsx
"use client";

import { Button, ButtonProps } from "@mantine/core";
import { ReactNode } from "react";

export interface AppButtonProps extends Omit<ButtonProps, "children"> {
  fullWidth?: boolean;
  children?: ReactNode; // children لازم يكون ReactNode مش string
}

export function AppButton({
  children,
  radius = "md",
  fullWidth = false,
  ...rest
}: AppButtonProps) {
  return (
    <Button
      variant="light"
      radius={radius}
      w={fullWidth ? "100%" : undefined}
      {...rest} // هنا onClick, color, disabled, size كلها تمر
    >
      {children}
    </Button>
  );
}
