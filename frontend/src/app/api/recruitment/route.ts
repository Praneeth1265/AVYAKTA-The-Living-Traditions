import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase/server";
import { z } from "zod";

const branches = [
  "CSE",
  "AIML",
  "ECE",
  "Pharm.D.",
  "B.Pharm.",
  "MBA",
  "BBA",
  "MBBS",
  "Nursing",
  "AHS",
  "BPT",
  "FOMC",
];

// Validation schema (matching frontend)
const recruitmentSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(1024, "Name must not exceed 1024 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  domain: z.string().min(1, "Domain is required"),
  srn: z
    .string()
    .length(13, "SRN must be exactly 13 characters")
    .regex(
      /^PES2[A-Z]{2}\d{2}[A-Z]{2}\d{3}$/,
      "SRN format: PES2 + 2 letters + 2 numbers + 2 letters + 3 numbers (e.g., PES2UG23CS135)",
    ),
  sem: z
    .string()
    .refine(
      (val) => parseInt(val) >= 1 && parseInt(val) <= 8,
      "Semester must be between 1-8",
    ),
  branch: z.enum(branches as [string, ...string[]], {
    message: "Please select a valid branch",
  }),
  section: z
    .string()
    .min(1, "Section is required")
    .max(1024, "Section must not exceed 1024 characters"),
  links: z.string().optional(),
  experience: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 1024,
      "Experience must not exceed 1024 characters",
    ),
  why_you: z
    .string()
    .min(10, "Please provide at least 10 characters")
    .max(1024, "Must not exceed 1024 characters"),
  why_us: z
    .string()
    .min(10, "Please provide at least 10 characters")
    .max(1024, "Must not exceed 1024 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Server-side validation
    const validation = recruitmentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.error.flatten() },
        { status: 400 },
      );
    }

    const data = validation.data;

    // Parse links (comes as JSON string from frontend)
    const linksJson = data.links ? data.links : null;

    // Insert into database using Supabase admin client
    const { data: insertedData, error } = await supabaseAdmin
      .from("recruitment")
      .insert([
        {
          name: data.name,
          domain: data.domain,
          srn: data.srn,
          sem: data.sem || null,
          branch: data.branch || null,
          section: data.section || null,
          links: linksJson,
          experience: data.experience || null,
          why_you: data.why_you || null,
          why_us: data.why_us || null,
          phone_number: data.phone_number || null,
          email: data.email,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "Recruitment application submitted successfully",
        data: insertedData?.[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Recruitment submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit recruitment application" },
      { status: 500 },
    );
  }
}

// GET endpoint removed due to privacy concerns
// PII (email, phone) should not be exposed publicly
// If retrieval is needed, implement proper authentication/authorization
