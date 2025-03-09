// src/app/layout.tsx
import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthProvider from "@/context/AuthProvider";
import { CustomQueryClientProvider } from "@/context/QueryClientProvider";
const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} dark:bg-gray-900`}>
        <CustomQueryClientProvider>
          <AuthProvider>
            <ThemeProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </ThemeProvider>
          </AuthProvider>
        </CustomQueryClientProvider>
      </body>
    </html>
  );
}
