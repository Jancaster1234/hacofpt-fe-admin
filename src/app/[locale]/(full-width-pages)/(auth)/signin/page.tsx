// src/app/[locale]/(full-width-pages)/(auth)/signin/page.tsx
import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | Hacof Admin",
  description: "This is Hacof Admin Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
