// src/app/[locale]/providers.tsx
"use client";

import { useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import { ToastProvider } from "@/components/ui/toast-provider";

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const [messages, setMessages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const importedMessages = (await import(`../../messages/${locale}.json`))
          .default;
        setMessages(importedMessages);
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);
        // Fallback to English if the requested locale doesn't exist
        if (locale !== "en") {
          try {
            const fallbackMessages = (await import(`../../messages/en.json`))
              .default;
            setMessages(fallbackMessages);
          } catch (fallbackError) {
            console.error("Failed to load fallback messages:", fallbackError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [locale]);

  // Show a loading indicator while messages are being loaded
  if (isLoading || !messages) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
      <ToastProvider />
    </NextIntlClientProvider>
  );
}
