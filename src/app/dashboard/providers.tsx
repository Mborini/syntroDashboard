// dashboard/providers.tsx
"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { AuthProvider } from "./auth-provider";
import "@/lib/i18n";
import "@mantine/core/styles.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <AuthProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </AuthProvider>
    </MantineProvider>
  );
}
