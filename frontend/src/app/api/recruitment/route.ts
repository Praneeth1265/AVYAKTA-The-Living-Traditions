import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase/server";
import { z } from "zod";

// Validation schema (matching frontend)
const recruitmentSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  domain: z.string().min(1, "Domain is required"),
  srn: z.string().min(1, "SRN is required"),
  sem: z
    .string()
    .refine(
      (val) => parseInt(val) >= 1 && parseInt(val) <= 8,
      "Semester must be between 1-8"
    ),
  branch: z.string().min(1, "Branch is required"),
  section: z.string().min(1, "Section is required"),
  links: z.string().optional(),
  experience: z.string().optional(),
  why_you: z.string().min(10, "Please provide at least 10 characters"),
  why_us: z.string().min(10, "Please provide at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Server-side validation
    const validation = recruitmentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Filter empty links and convert to JSON string
    const validLinks = data.links
      ? data.links
          .split("\n")
          .map((link) => link.trim())
          .filter((link) => link.length > 0)
      : [];
    const linksJson = validLinks.length > 0 ? JSON.stringify(validLinks) : null;

    // Insert into database using Supabase admin client
    const { data: insertedData, error } = await supabaseAdmin
      .from("recruitment")
      .insert([
        {
          name: data.name,
          domain: data.domain || null,
          srn: data.srn || null,
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
      { status: 201 }
    );
  } catch (error) {
    console.error("Recruitment submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit recruitment application" },
      { status: 500 }
    );
  }
}

// GET endpoint removed due to privacy concerns
// PII (email, phone) should not be exposed publicly
// If retrieval is needed, implement proper authentication/authorization
