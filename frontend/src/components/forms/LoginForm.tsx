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

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to login. Please try again.");
        return;
      }

      setSuccessMessage("Login successful! Redirecting...");
      
      // Wait a moment before redirecting
      setTimeout(() => {
        router.push("/avyakta-control/admin/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto shadow-[0_12px_40px_rgba(28,28,28,0.15)] rounded-2xl overflow-hidden border border-[#92791B]/20">
      
      {/* NEW HEADER 
        This completely replaces the orange block. 
        It uses Charcoal Black and Light Gold to fit the Avyakta design system. 
      */}
      <div className="bg-[#1C1C1C] pt-10 pb-8 px-6 text-center relative border-b border-[#C9A84C]/20">
        <h1 className="text-4xl font-serif text-[#C9A84C] tracking-wide relative z-10">
          Avyakta
        </h1>
        <p className="text-xs font-sans text-[#737955] uppercase tracking-[0.2em] mt-2 relative z-10">
          The Living Traditions
        </p>
        
        {/* Subtle decorative dots replacing the plain white ones */}
        <div className="flex justify-center gap-1.5 mt-5 relative z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-[#92791B]/60"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#92791B]/60"></div>
        </div>
      </div>

      {/* YOUR ORIGINAL FORM (Light Theme) */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-[#F5F0E8] p-10 relative"
      >
        {/* Subtle Indian-inspired decorative border overlay */}
        <div className="absolute inset-2 rounded-xl border border-[#C9A84C]/15 pointer-events-none" />

        {/* Error State */}
        {error && (
          <div className="bg-[#8B1A1A]/5 border border-[#8B1A1A]/30 text-[#8B1A1A] px-4 py-3 rounded-lg text-sm font-sans flex items-center relative z-10">
            {error}
          </div>
        )}

        {/* Success State */}
        {successMessage && (
          <div className="bg-[#1B5E3B]/5 border border-[#1B5E3B]/30 text-[#1B5E3B] px-4 py-3 rounded-lg text-sm font-sans flex items-center relative z-10">
            {successMessage}
          </div>
        )}

        {/* Heading */}
        <div className="text-center space-y-2 relative z-10">
          <h2 className="text-3xl font-serif text-[#1C1C1C] tracking-wide">
            Welcome Back
          </h2>
          <p className="text-sm font-sans text-[#737955]">
            Continue your journey with Avyakta
          </p>
        </div>

        {/* Email Input */}
        <div className="space-y-1.5 relative z-10">
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
            <p className="text-xs font-sans text-[#8B1A1A] ml-1 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1.5 relative z-10">
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
            <p className="text-xs font-sans text-[#8B1A1A] ml-1 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#92791B] hover:bg-[#C9A84C] text-[#F5F0E8] font-sans font-medium py-3.5 rounded-lg transition-all duration-300 shadow-[0_4px_14px_rgba(146,121,27,0.25)] hover:shadow-[0_6px_20px_rgba(201,168,76,0.35)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 relative z-10"
        >
          {isLoading ? "Signing in..." : "Enter"}
        </button>

        {/* Forgot Password */}
        <div className="text-center relative z-10">
          <a
            href="/auth/forgot-password"
            className="text-sm font-sans text-[#92791B] hover:text-[#C9A84C] transition-colors duration-300"
          >
            Forgot your password?
          </a>
        </div>
      </form>
    </div>
  );
}