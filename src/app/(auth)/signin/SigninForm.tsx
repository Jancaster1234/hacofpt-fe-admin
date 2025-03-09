// src/app/(auth)/signin/SigninForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth_v0";
import SocialLoginButtons from "./SocialLoginButtons";

const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth(); // Use the latest authentication hook
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      router.push("/"); // Redirect to dashboard after successful login
    } catch (err: any) {
      setError("Invalid credentials. Please try again.");
    }
  }

  return (
    <>
      <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
        Sign in to your account
      </h3>
      <p className="mb-11 text-center text-base font-medium text-body-color">
        Login to your account for a faster checkout.
      </p>

      {/* Social Login Buttons */}
      <SocialLoginButtons />

      {/* Divider */}
      <div className="mb-8 flex items-center justify-center">
        <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color/50 sm:block"></span>
        <p className="w-full px-5 text-center text-base font-medium text-body-color">
          Or, sign in with your email
        </p>
        <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color/50 sm:block"></span>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin}>
        <div className="mb-8">
          <label
            htmlFor="email"
            className="mb-3 block text-sm text-dark dark:text-white"
          >
            Your Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary"
          />
        </div>

        <div className="mb-8">
          <label
            htmlFor="password"
            className="mb-3 block text-sm text-dark dark:text-white"
          >
            Your Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary"
          />
        </div>

        <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
          <label className="flex cursor-pointer select-none items-center text-sm font-medium text-body-color">
            <input type="checkbox" className="mr-2" />
            Keep me signed in
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="mb-6">
          <button
            type="submit"
            className="w-full rounded-sm bg-primary px-9 py-4 text-base font-medium text-white hover:bg-primary/90"
          >
            Sign in
          </button>
        </div>
      </form>

      <p className="text-center text-base font-medium text-body-color">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </>
  );
};

export default SigninForm;
