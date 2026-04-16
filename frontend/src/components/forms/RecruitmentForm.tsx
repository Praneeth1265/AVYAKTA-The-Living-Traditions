"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  recruitmentSchema,
  RECRUITMENT_BRANCHES,
  RECRUITMENT_DOMAINS,
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
    control,
  } = useForm<RecruitmentFormData>({
    resolver: zodResolver(recruitmentSchema),
  });

  const selectedFirstPreference = useWatch({
    control,
    name: "first_preference_domain",
  });

  const selectedSecondDomain = useWatch({
    control,
    name: "second_domain_preference",
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
    <div>
      {/* Ethics Statement */}
      <div className="ethics-statement">
        <div className="ethics-title">Our Commitment to You</div>
        <div className="ethics-content">
          By joining Avyakta, you&apos;re becoming part of a diverse community
          dedicated to celebrating cultural traditions while fostering
          innovation, creativity, and personal growth. We believe in fostering
          an inclusive space where your unique perspectives are valued.
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="message-box success-box">✓ {successMessage}</div>
      )}

      {errorMessage && (
        <div className="message-box error-box">✕ {errorMessage}</div>
      )}

      {/* Form Container */}
      <div className="recruitment-form-container">
        <form onSubmit={handleSubmit(onSubmit)} className="recruitment-form">
          {/* LEFT COLUMN */}
          <div className="form-left">
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name <span className="required">*</span>
              </label>
              <input
                id="name"
                aria-describedby={errors.name ? "name-error" : undefined}
                {...register("name")}
                type="text"
                placeholder="Your full name"
                maxLength={1024}
                className="form-input"
              />
              {errors.name && (
                <p id="name-error" className="form-error">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email <span className="required">*</span>
              </label>
              <input
                id="email"
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
                type="email"
                placeholder="your@email.com"
                className="form-input"
              />
              {errors.email && (
                <p id="email-error" className="form-error">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="form-group">
              <label className="form-label">
                Phone Number <span className="required">*</span>
              </label>
              <input
                {...register("phone_number")}
                type="tel"
                placeholder="9876543210"
                className="form-input"
              />
              {errors.phone_number && (
                <p className="form-error">{errors.phone_number.message}</p>
              )}
              <p className="form-hint">10-digit mobile number</p>
            </div>

            {/* First Domain Preference */}
            <div className="form-group">
              <label className="form-label">
                First Domain Preference <span className="required">*</span>
              </label>
              <select
                {...register("first_preference_domain")}
                className="form-select"
              >
                <option value="">Select your domain</option>
                {RECRUITMENT_DOMAINS.map((domain) => (
                  <option
                    key={domain}
                    value={domain}
                    disabled={domain === selectedSecondDomain}
                  >
                    {domain}
                  </option>
                ))}
              </select>
              {errors.first_preference_domain && (
                <p className="form-error">
                  {errors.first_preference_domain.message}
                </p>
              )}
            </div>

            {/* Second Domain Preference */}
            <div className="form-group">
              <label className="form-label">Second Domain (Optional)</label>
              <select
                {...register("second_domain_preference")}
                className="form-select"
              >
                <option value="">Select secondary domain</option>
                {RECRUITMENT_DOMAINS.map((domain) => (
                  <option
                    key={domain}
                    value={domain}
                    disabled={domain === selectedFirstPreference}
                  >
                    {domain}
                  </option>
                ))}
              </select>
              {errors.second_domain_preference && (
                <p className="form-error">
                  {errors.second_domain_preference.message}
                </p>
              )}
              <p className="form-hint">If interested in another domain</p>
            </div>

            {/* Year Field */}
            <div className="form-group">
              <label htmlFor="year" className="form-label">
                Year <span className="required">*</span>
              </label>
              <input
                id="year"
                aria-describedby={errors.year ? "year-error" : undefined}
                {...register("year", { valueAsNumber: true })}
                type="number"
                min="1"
                step="1"
                placeholder="Enter year"
                className="form-input"
              />
              {errors.year && (
                <p id="year-error" className="form-error">
                  {errors.year.message}
                </p>
              )}
              <p className="form-hint">Academic year (integers only)</p>
            </div>

            {/* Section Field */}
            <div className="form-group">
              <label className="form-label">
                Section <span className="required">*</span>
              </label>
              <input
                {...register("section")}
                type="text"
                placeholder="Your section"
                maxLength={1024}
                className="form-input"
              />
              {errors.section && (
                <p className="form-error">{errors.section.message}</p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="form-right">
            {/* SRN Field */}
            <div className="form-group">
              <label className="form-label">
                SRN <span className="required">*</span>
              </label>
              <input
                {...register("srn", {
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase();
                  },
                })}
                type="text"
                placeholder="PES2......"
                maxLength={13}
                className="form-input uppercase"
              />
              {errors.srn && <p className="form-error">{errors.srn.message}</p>}
              <p className="form-hint">
                Format: PES2 + 2 letters + 2 numbers + 2 letters + 3 numbers
              </p>
            </div>

            {/* Branch Field */}
            <div className="form-group">
              <label className="form-label">
                Branch <span className="required">*</span>
              </label>
              <select {...register("branch")} className="form-select">
                <option value="">Select your branch</option>
                {RECRUITMENT_BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {errors.branch && (
                <p className="form-error">{errors.branch.message}</p>
              )}
            </div>

            {/* Experience Field */}
            <div className="form-group">
              <label className="form-label">Experience</label>
              <textarea
                {...register("experience")}
                placeholder="Your relevant experience and achievements"
                maxLength={1024}
                className="form-textarea"
              />
              {errors.experience && (
                <p className="form-error">{errors.experience.message}</p>
              )}
              <p className="form-hint">Optional - Tell us about your skills</p>
            </div>

            {/* Why You Field */}
            <div className="form-group">
              <label className="form-label">
                What Do You Bring? <span className="required">*</span>
              </label>
              <textarea
                {...register("why_you")}
                placeholder="Why are you interested in Avyakta?"
                maxLength={1024}
                className="form-textarea"
              />
              {errors.why_you && (
                <p className="form-error">{errors.why_you.message}</p>
              )}
              <p className="form-hint">Minimum 10 characters</p>
            </div>

            {/* Why Us Field */}
            <div className="form-group">
              <label className="form-label">
                Why Avyakta? <span className="required">*</span>
              </label>
              <textarea
                {...register("why_us")}
                placeholder="What do you expect from Avyakta?"
                maxLength={1024}
                className="form-textarea"
              />
              {errors.why_us && (
                <p className="form-error">{errors.why_us.message}</p>
              )}
              <p className="form-hint">Minimum 10 characters</p>
            </div>
          </div>

          {/* FULL WIDTH SECTIONS */}

          {/* Links Section */}
          <div className="links-container">
            <div className="links-title">📚 Showcase Your Work (Optional)</div>
            <div>
              {linkInputs.map((link, index) => (
                <div key={index} className="link-input-wrapper">
                  <input
                    type="url"
                    placeholder="Paste your portfolio, GitHub, Google Drive, or project link"
                    value={link}
                    onChange={(e) => updateLinkInput(index, e.target.value)}
                    maxLength={1024}
                    className="form-input"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeLinkInput(index)}
                      className="remove-link-btn"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLinkInput}
              disabled={linkInputs.length >= 10}
              className="add-link-btn"
            >
              + Add Another Link
            </button>
            {linkInputs.length >= 10 && (
              <p className="form-error" style={{ marginTop: "0.8rem" }}>
                Maximum 10 links allowed
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`submit-button ${isSubmitting ? "button-loading" : ""}`}
          >
            {isSubmitting ? "" : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
