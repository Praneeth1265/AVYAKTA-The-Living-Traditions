import { z } from "zod";

export const REGISTRATION_BRANCHES = [
  "CSE",
  "ECE",
  "EEE",
  "MECH",
  "BBA",
  "BCom",
  "BDes",
  "Architecture",
  "Pharmacy",
  "Law",
  "Other",
] as const;

export const EVENT_DOMAINS = [
  "Logistics",
  "Decor & Design",
  "Technical (Audio/Visual)",
  "Hospitality",
  "Marketing & PR",
  "Photography & Videography",
  "Artist Management",
  "Content Writing",
] as const;

export const registrationSchema = z
  .object({
    isVolunteer: z.boolean(),
    eventSelector: z.string().min(1, { message: "Please select an event." }),

    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be under 100 characters"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .max(255, "Email is too long"),
    branch: z.string().min(1, "Please select your branch"),
    classYear: z
      .number()
      .min(1, "Year must be between 1 and 5")
      .max(5, "Year must be between 1 and 5"),
    section: z.string().min(1, "Section is required").max(10),
    srn: z
      .string()
      .regex(
        /^(PES)[X12]20[1-9][A-Z]{2}[0-9]{5}$/i,
        "Please enter a valid PES SRN",
      )
      .max(13),
    phone_number: z
      .string()
      .regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),

    // Participant-only fields
    dietaryNeeds: z.string().max(200).optional(),
    teamName: z.string().max(100).optional(),

    // Volunteer-only fields
    volunteerDomain: z.string().optional(),
    volunteerExperience: z.string().max(1024).optional(),

    links: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isVolunteer) {
      if (!data.volunteerDomain) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["volunteerDomain"],
          message: "Please select a volunteer domain",
        });
      }
    }
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;
