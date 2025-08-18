// app/providers.tsx
"use client";

import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./auth-provider";
import '@/lib/i18n';

export function Providers({ children }: { children: React.ReactNode }) {


  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <AuthProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
