// src/components/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    // Store the current authentication state before navigation
    const accessToken = localStorage.getItem("accessToken");

    // Replace the locale segment in the URL
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);

    // Set a flag to prevent token removal during locale change
    sessionStorage.setItem("localeChange", "true");
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleLocaleChange("en")}
        className={locale === "en" ? "font-bold" : ""}
      >
        English
      </button>
      <button
        onClick={() => handleLocaleChange("vi")}
        className={locale === "vi" ? "font-bold" : ""}
      >
        Tiếng Việt
      </button>
    </div>
  );
}
