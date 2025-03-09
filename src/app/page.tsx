// src/app/page.tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/signin"); // Redirects immediately to sign in page
  return null;
}
