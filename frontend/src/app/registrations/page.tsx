"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase/client";
import MandalaBg from "@/components/shared/MandalaBg";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  srn: z.string().regex(/^[A-Z]{2}\d{2}[A-Z]{2}\d{3}$/i, "Invalid SRN (e.g. PES2UG21CS001)"),
  semester: z.string().min(1, "Semester is required"),
  branch: z.string().min(2, "Branch is required"),
  section: z.string().min(1, "Section is required"),
  links: z.string().optional(),
  availability: z.string().min(1, "Availability is required"),
  experience: z.string().min(10, "Min 10 characters"),
  why_you: z.string().min(20, "Min 20 characters"),
  why_us: z.string().min(20, "Min 20 characters"),
});

type FormData = z.infer<typeof schema>;

const RESPONSIBILITIES = [
  "Be active in club activities, meetings, and events",
  "Help plan and execute events with the team",
  "Take up tasks and complete them on time",
  "Work together, support each other",
  "Share ideas and contribute creatively",
  "Stay committed and be reliable",
];

const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function RegistrationsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError("");
    const db = getSupabase();
    if (!db) { setServerError("Database not configured yet."); return; }
    const { error } = await db.from("registrations").insert([data]);
    if (error) { setServerError("Something went wrong. Please try again."); return; }
    setSubmitted(true);
  }

  if (submitted) return <SuccessScreen />;

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(170deg, #e8a020 0%, #c8601a 40%, #8b1a1a 100%)" }}
    >
      <MandalaBg />

      <div className="relative z-10 max-w-lg mx-auto px-5 py-12 pb-20">

        {/* Title */}
        <h1
          className="text-5xl font-bold text-center mb-8 tracking-wide"
          style={{ fontFamily: "Cormorant Garamond, serif", color: "#f5f0e8" }}
        >
          Registrations
        </h1>

        {/* Responsibilities */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#f5f0e8" }}>
            Responsibilities
          </h2>
          <ul className="space-y-1">
            {RESPONSIBILITIES.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: "#f5f0e8" }}>
                <span style={{ color: "#f5f0e8" }}>•</span>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}>{r}</span>
              </li>
            ))}
          </ul>
        </section>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

          {/* General Info */}
          <section>
            <SectionHeading>General Info</SectionHeading>
            <div className="space-y-4">
              <FormField label="Name" error={errors.name?.message}>
                <input {...register("name")} placeholder="" className={inputCls(!!errors.name)} />
              </FormField>
              <FormField label="SRN" error={errors.srn?.message}>
                <input {...register("srn")} placeholder="e.g. PES2UG21CS001" className={inputCls(!!errors.srn)} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Semester" error={errors.semester?.message}>
                  <select {...register("semester")} className={inputCls(!!errors.semester)}>
                    <option value=""></option>
                    {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </FormField>
                <FormField label="Section" error={errors.section?.message}>
                  <select {...register("section")} className={inputCls(!!errors.section)}>
                    <option value=""></option>
                    {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </FormField>
              </div>
              <FormField label="Branch" error={errors.branch?.message}>
                <input {...register("branch")} placeholder="e.g. CSE, ECE" className={inputCls(!!errors.branch)} />
              </FormField>
              <FormField label="Links (GitHub, LinkedIn, Portfolio)" error={errors.links?.message}>
                <input {...register("links")} placeholder="Comma-separated URLs" className={inputCls(false)} />
              </FormField>
              <FormField label="Availability &amp; Commitment" error={errors.availability?.message}>
                <input {...register("availability")} placeholder="e.g. Weekday evenings" className={inputCls(!!errors.availability)} />
              </FormField>
              <FormField label="Experience" error={errors.experience?.message}>
                <textarea {...register("experience")} rows={3} placeholder="Relevant experience, skills, clubs..." className={inputCls(!!errors.experience)} />
              </FormField>
            </div>
          </section>

          {/* Final Section */}
          <section>
            <SectionHeading>Final Section</SectionHeading>
            <div className="space-y-4">
              <FormField label="Why You?" error={errors.why_you?.message}>
                <textarea {...register("why_you")} rows={3} placeholder="What makes you a great fit?" className={inputCls(!!errors.why_you)} />
              </FormField>
              <FormField label="Why Us?" error={errors.why_us?.message}>
                <textarea {...register("why_us")} rows={3} placeholder="Why do you want to join Avyakta?" className={inputCls(!!errors.why_us)} />
              </FormField>
            </div>
          </section>

          {serverError && (
            <p className="text-sm text-center font-medium" style={{ color: "#f5f0e8", background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "8px" }}>
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-full font-bold text-base tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
            style={{
              background: "#f5f0e8",
              color: "#8b1a1a",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </main>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-3xl font-semibold mb-5"
      style={{ fontFamily: "Cormorant Garamond, serif", color: "#f5f0e8" }}
    >
      {children}
    </h2>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "#f5f0e8" }}
        dangerouslySetInnerHTML={{ __html: label }}
      />
      {children}
      {error && <span className="text-xs font-medium" style={{ color: "#f5f0e8", opacity: 0.8 }}>{error}</span>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-full px-5 py-3 text-sm outline-none transition-all duration-200",
    "bg-[rgba(245,240,232,0.85)] text-[#1c1c1c] placeholder-[rgba(28,28,28,0.4)]",
    hasError
      ? "ring-2 ring-[#1c1c1c]"
      : "focus:ring-2 focus:ring-[rgba(245,240,232,0.9)]",
  ].join(" ");
}

function SuccessScreen() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(170deg, #e8a020 0%, #c8601a 40%, #8b1a1a 100%)" }}
    >
      <MandalaBg />
      <div className="relative z-10 text-center px-8">
        <svg className="mx-auto mb-6" width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="31" stroke="#f5f0e8" strokeWidth="1.5" />
          <path d="M20 33 L28 41 L44 24" stroke="#f5f0e8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2
          className="text-4xl font-bold mb-3"
          style={{ fontFamily: "Cormorant Garamond, serif", color: "#f5f0e8" }}
        >
          You&apos;re Registered
        </h2>
        <p style={{ color: "rgba(245,240,232,0.75)" }}>
          We&apos;ve received your submission. We&apos;ll be in touch soon.
        </p>
      </div>
    </main>
  );
}
