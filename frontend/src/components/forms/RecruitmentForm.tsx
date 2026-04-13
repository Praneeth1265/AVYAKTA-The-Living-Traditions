"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  recruitmentSchema,
  RECRUITMENT_BRANCHES,
  RecruitmentFormData,
} from "../../lib/validators/recruitment";

export default function RecruitmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [linkInputs, setLinkInputs] = useState([""]); // Local state for dynamic links

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    if (!successMessage) return;

    const timeoutId = setTimeout(() => setSuccessMessage(""), 5000);
    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RecruitmentFormData>({
    resolver: zodResolver(recruitmentSchema),
  });

  const addLinkInput = () => setLinkInputs([...linkInputs, ""]);
  const removeLinkInput = (index: number) => {
    setLinkInputs(linkInputs.filter((_, i) => i !== index));
  };
  const updateLinkInput = (index: number, value: string) => {
    const newLinks = [...linkInputs];
    newLinks[index] = value;
    setLinkInputs(newLinks);
  };

  const onSubmit = async (data: RecruitmentFormData) => {
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Filter empty links and convert to JSON string
      const validLinks = linkInputs.filter((link) => link.trim().length > 0);
      const linksJson =
        validLinks.length > 0 ? JSON.stringify(validLinks) : undefined;

      const payload = {
        ...data,
        links: linksJson,
      };

      const response = await fetch("/api/recruitment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "Failed to submit application");
        return;
      }

      setSuccessMessage("Application submitted successfully!");
      reset();
      setLinkInputs([""]);
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
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
            type="text"
            placeholder="Your full name"
            maxLength={1024}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p id="name-error" className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
            type="email"
            placeholder="your@email.com"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
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
          <label className="block text-sm font-medium mb-1">
            SRN <span className="text-red-500">*</span>
          </label>
          <input
            {...register("srn", {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            })}
            type="text"
            placeholder="SRN"
            maxLength={13}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
          />
          {errors.srn && (
            <p className="text-red-500 text-sm mt-1">{errors.srn.message}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Format: PES2 + 2 Alpha + 2 numbers + 2 Alpha + 3 numbers
          </p>
        </div>

        {/* Year Field */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            id="year"
            aria-describedby={errors.year ? "year-error" : undefined}
            {...register("year", { valueAsNumber: true })}
            type="number"
            min="1"
            step="1"
            placeholder="Enter year"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.year && (
            <p id="year-error" className="text-red-500 text-sm mt-1">
              {errors.year.message}
            </p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Enter your academic year (must be greater than 0, integers only)
          </p>
        </div>

        {/* Branch Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Branch <span className="text-red-500">*</span>
          </label>
          <select
            {...register("branch")}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your branch</option>
            {RECRUITMENT_BRANCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {errors.branch && (
            <p className="text-red-500 text-sm mt-1">{errors.branch.message}</p>
          )}
        </div>

        {/* Section Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Section <span className="text-red-500">*</span>
          </label>
          <input
            {...register("section")}
            type="text"
            placeholder="Your section"
            maxLength={1024}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.section && (
            <p className="text-red-500 text-sm mt-1">
              {errors.section.message}
            </p>
          )}
        </div>

        {/* Experience Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Experience</label>
          <textarea
            {...register("experience")}
            placeholder="Your relevant experience"
            rows={2}
            maxLength={1024}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.experience && (
            <p className="text-red-500 text-sm mt-1">
              {errors.experience.message}
            </p>
          )}
        </div>

        {/* Links Field (Dynamic Array UI) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Showcase Your Work (Links)
          </label>
          <div className="space-y-2">
            {linkInputs.map((link, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  placeholder="github, portfolio, drive links etc"
                  value={link}
                  onChange={(e) => updateLinkInput(index, e.target.value)}
                  maxLength={1024}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeLinkInput(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addLinkInput}
            disabled={linkInputs.length >= 10}
            className={`mt-2 px-4 py-2 text-white rounded-lg transition ${
              linkInputs.length >= 10
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            + Add Another Link
          </button>
          {linkInputs.length >= 10 && (
            <p className="text-orange-600 text-xs mt-2 font-medium">
              Maximum 10 links allowed
            </p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            You may include links to your portfolio, GitHub, Google Drive, or
            any previous work/projects to showcase your experience (optional,
            max 10 links)
          </p>
        </div>

        {/* Why You Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            What do you bring to the table?{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("why_you")}
            placeholder="Tell us why you're interested in AVYAKTA (minimum 10 characters)"
            rows={3}
            maxLength={1024}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.why_you && (
            <p className="text-red-500 text-sm mt-1">
              {errors.why_you.message}
            </p>
          )}
        </div>

        {/* Why Us Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Why AVYAKTA? <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("why_us")}
            placeholder="What do you expect from AVYAKTA? (minimum 10 characters)"
            rows={3}
            maxLength={1024}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.why_us && (
            <p className="text-red-500 text-sm mt-1">{errors.why_us.message}</p>
          )}
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
