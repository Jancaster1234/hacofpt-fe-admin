// src/app/[locale]/layout.tsx
"use client";

import { Outfit } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthProvider from "@/context/AuthProvider";
import { CustomQueryClientProvider } from "@/context/QueryClientProvider";
import { Providers } from "./providers";
import React from "react";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Use React.use() to properly unwrap the params Promise
  const unwrappedParams = React.use(params);
  const { locale } = unwrappedParams;

  return (
    <html lang={locale}>
      <body className={`${outfit.variable} dark:bg-gray-900`}>
        <Providers locale={locale}>
          <CustomQueryClientProvider>
            <AuthProvider>
              <ThemeProvider>
                <SidebarProvider>{children}</SidebarProvider>
              </ThemeProvider>
            </AuthProvider>
          </CustomQueryClientProvider>
        </Providers>
      </body>
    </html>
  );
}
