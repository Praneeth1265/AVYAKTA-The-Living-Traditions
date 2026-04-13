"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema, LoginFormData } from "../../lib/validators/auth";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Handle success response (200 OK)
      if (response.ok) {
        setSuccessMessage("Login successful! Redirecting to dashboard...");
        // Give user a moment to see the success message, then redirect
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
        return;
      }

      // Handle error responses (4xx, 5xx)
      if (response.status >= 400) {
        try {
          const result = (await response.json()) as { error?: string };
          setError(result.error || "Failed to login. Please try again.");
        } catch {
          setError("Failed to login. Please try again.");
        }
        return;
      }

      // Fallback for unexpected response
      setError("An unexpected error occurred.");
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      {error && (
        <div className="bg-[#8B1A1A]/5 border border-[#8B1A1A]/30 text-[#8B1A1A] px-4 py-3 rounded-lg text-sm font-sans">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-[#1B5E3B]/5 border border-[#1B5E3B]/30 text-[#1B5E3B] px-4 py-3 rounded-lg text-sm font-sans">
          {successMessage}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-sans font-semibold tracking-wider uppercase text-[#737955] ml-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          className={`w-full px-4 py-3 rounded-lg border font-sans transition-all duration-300 focus:outline-none ${
            errors.email
              ? "border-[#8B1A1A] focus:ring-1 focus:ring-[#8B1A1A]"
              : "border-[#92791B]/40 hover:border-[#92791B]/70 focus:border-[#92791B] focus:ring-1 focus:ring-[#92791B]"
          } bg-[#F5F0E8] text-[#1C1C1C] placeholder-[#737955]/50 shadow-sm`}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-xs font-sans text-[#8B1A1A] ml-1 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-sans font-semibold tracking-wider uppercase text-[#737955] ml-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          className={`w-full px-4 py-3 rounded-lg border font-sans transition-all duration-300 focus:outline-none ${
            errors.password
              ? "border-[#8B1A1A] focus:ring-1 focus:ring-[#8B1A1A]"
              : "border-[#92791B]/40 hover:border-[#92791B]/70 focus:border-[#92791B] focus:ring-1 focus:ring-[#92791B]"
          } bg-[#F5F0E8] text-[#1C1C1C] placeholder-[#737955]/50 shadow-sm`}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-xs font-sans text-[#8B1A1A] ml-1 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#92791B] hover:bg-[#C9A84C] text-[#F5F0E8] font-sans font-medium py-3.5 rounded-lg transition-all duration-300 shadow-[0_4px_14px_rgba(146,121,27,0.25)] hover:shadow-[0_6px_20px_rgba(201,168,76,0.35)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
      >
        {isLoading ? "Signing in..." : "Enter"}
      </button>

      <div className="text-center">
        <a
          href="/auth/forgot-password"
          className="text-sm font-sans text-[#92791B] hover:text-[#C9A84C] transition-colors duration-300"
        >
          Forgot your password?
        </a>
      </div>
    </form>
  );
}
