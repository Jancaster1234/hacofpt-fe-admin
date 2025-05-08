// src/app/[locale]/(full-width-pages)/(auth)/signup/page.tsx
import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignUp Page | Hacof Admin",
  description: "This is SignUp Page Hacof Admin",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
