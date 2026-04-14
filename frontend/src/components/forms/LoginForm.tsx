"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, LoginFormData } from "../../lib/validators/auth";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

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
        setSuccessMessage("Login successful! Redirecting...");
        // Redirect to the redirect URL if provided, otherwise to dashboard
        const destination = redirectUrl || "/dashboard";
        router.push(destination);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-0 w-full">
      {error && <div className="login-error">{error}</div>}

      {successMessage && <div className="login-success">{successMessage}</div>}

      <div className="login-form-group">
        <label htmlFor="email" className="login-form-group-label">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          className={`login-form-input ${
            errors.email ? "border-[#8B1A1A]" : ""
          }`}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-xs text-[#8B1A1A] ml-1 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="login-form-group">
        <label htmlFor="password" className="login-form-group-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          className={`login-form-input ${
            errors.password ? "border-[#8B1A1A]" : ""
          }`}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-xs text-[#8B1A1A] ml-1 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={isLoading} className="login-submit-btn">
        {isLoading ? "Signing in..." : "Enter"}
      </button>
    </form>
  );
}
