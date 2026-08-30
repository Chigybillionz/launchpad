import { z } from "zod";

// Base schemas corresponding to our types

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string(),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  location: z.string(),
  skills: z.array(z.string()),
  interests: z.array(z.string()),
  goals: z.array(z.string()),
  workPreferences: z.array(z.string()).optional(),
  avatarUrl: z.string().url().optional(),
});

export const opportunitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  organization: z.string().min(1, "Organization is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum([
    "internship",
    "job",
    "fellowship",
    "scholarship",
    "grant",
    "hackathon",
    "bootcamp",
    "program",
    "mentorship",
    "startup program"
  ]),
  location: z.string(),
  remote: z.boolean(),
  deadline: z.string().datetime(),
  requiredSkills: z.array(z.string()),
  experienceLevel: z.string(),
  eligibility: z.string(),
  applicationUrl: z.string().url().refine((val) => val.startsWith("http://") || val.startsWith("https://"), {
    message: "URL must start with http:// or https://",
  }),
  tags: z.array(z.string()),
});

export const savedOpportunitySchema = z.object({
  opportunityId: z.string().uuid(),
});

export const idParamSchema = z.object({
  id: z.string().uuid("Invalid ID"),
});

export const opportunityIdParamSchema = z.object({
  opportunityId: z.string().uuid("Invalid opportunity ID"),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const applicationStatusSchema = z.enum([
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
]);

export const createApplicationSchema = z.object({
  opportunityId: z.string().uuid("Invalid opportunity ID"),
});

export const updateApplicationSchema = z.object({
  status: applicationStatusSchema,
});

export const applicationQuerySchema = paginationQuerySchema.extend({
  status: applicationStatusSchema.optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export * from "./profile.validator";
export * from "./opportunity.validator";
