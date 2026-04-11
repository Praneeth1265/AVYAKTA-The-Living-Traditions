"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const recruitmentSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  domain: z.string().min(1, "Domain is required"),
  srn: z.string().optional(),
  sem: z
    .string()
    .refine(
      (val) => val === "" || (parseInt(val) >= 1 && parseInt(val) <= 8),
      "Semester must be between 1-8",
    )
    .optional(),
  branch: z.string().optional(),
  section: z.string().optional(),
  links: z.string().optional(),
  experience: z.string().optional(),
  why_you: z.string().optional(),
  why_us: z.string().optional(),
});

export type RecruitmentFormData = z.infer<typeof recruitmentSchema>;

export default function RecruitmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RecruitmentFormData>({
    resolver: zodResolver(recruitmentSchema),
  });

  const onSubmit = async (data: RecruitmentFormData) => {
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/recruitment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "Failed to submit application");
        return;
      }

      setSuccessMessage("Application submitted successfully!");
      reset();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Recruitment Form</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="Your full name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="your@email.com"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            {...register("phone_number")}
            type="tel"
            placeholder="9876543210"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone_number && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phone_number.message}
            </p>
          )}
        </div>

        {/* Domain Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Domain <span className="text-red-500">*</span>
          </label>
          <select
            {...register("domain")}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your domain of interest</option>
            <option value="Technical">Technical</option>
            <option value="Design">Design</option>
            <option value="Event Management">Event Management</option>
            <option value="Ethics and Discipline">Ethics and Discipline</option>
            <option value="Media and Visibility">Media and Visibility</option>
            <option value="Logistics and Operations">
              Logistics and Operations
            </option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
          </select>
          {errors.domain && (
            <p className="text-red-500 text-sm mt-1">{errors.domain.message}</p>
          )}
        </div>

        {/* SRN Field */}
        <div>
          <label className="block text-sm font-medium mb-1">SRN</label>
          <input
            {...register("srn")}
            type="text"
            placeholder="Your SRN/Roll Number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Semester Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Semester</label>
          <input
            {...register("sem")}
            type="number"
            min="1"
            max="8"
            placeholder="1-8"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.sem && (
            <p className="text-red-500 text-sm mt-1">{errors.sem.message}</p>
          )}
        </div>

        {/* Branch Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Branch</label>
          <input
            {...register("branch")}
            type="text"
            placeholder="Your branch/stream"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Section Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Section</label>
          <input
            {...register("section")}
            type="text"
            placeholder="Your section"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Links Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Portfolio/Links
          </label>
          <textarea
            {...register("links")}
            placeholder="Portfolio links, GitHub, etc."
            rows={2}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Experience Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Experience</label>
          <textarea
            {...register("experience")}
            placeholder="Your relevant experience"
            rows={2}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Why You Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Why do you want to join?
          </label>
          <textarea
            {...register("why_you")}
            placeholder="Tell us why you're interested in AVYAKTA"
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Why Us Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Why AVYAKTA?</label>
          <textarea
            {...register("why_us")}
            placeholder="What do you expect from AVYAKTA?"
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
