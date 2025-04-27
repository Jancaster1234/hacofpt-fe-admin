// src/middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "vi"],

  // Used when no locale matches
  defaultLocale: "en",

  // Optionally persist the locale in a cookie
  localeDetection: true,
});

export const config = {
  // Match all pathnames except for
  // - ... certain files/directories like api, images, etc.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
