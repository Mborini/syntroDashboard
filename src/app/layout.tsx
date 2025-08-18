// app/layout.tsx
import "@/css/satoshi.css";
import "@/css/style.css";

import { Providers } from "./dashboard/providers";
import type { PropsWithChildren } from "react";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="light" enableSystem={false} attribute="class">
          <NextTopLoader color="#5750F1" showSpinner={false} />

          <Providers>
            <main className="isolate mx-auto w-full overflow-hidden">
              {children}
            </main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
