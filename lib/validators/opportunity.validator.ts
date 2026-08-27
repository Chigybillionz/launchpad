import { z } from "zod";

const stringArrayDedupe = z
  .array(z.string().trim().min(1, "Value cannot be empty"))
  .transform((val) => Array.from(new Set(val)));

export const opportunityQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  search: z.string().trim().optional(),
  type: z.enum(["JOB", "INTERNSHIP", "HACKATHON", "SCHOLARSHIP", "FELLOWSHIP", "GRANT", "MENTORSHIP", "STARTUP_PROGRAM", "TRAINING"]).optional(),
  experienceLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  remote: z.enum(["true", "false"]).transform((val) => val === "true").optional(),
  location: z.string().trim().optional(),
  skill: z.string().trim().optional(),
  deadline: z.enum(["upcoming"]).optional(),
  sort: z.enum(["newest", "oldest", "deadline"]).default("newest"),
});

export const createOpportunitySchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  organization: z.string().trim().min(1, "Organization is required"),
  description: z.string().trim().min(1, "Description is required"),
  type: z.enum(["JOB", "INTERNSHIP", "HACKATHON", "SCHOLARSHIP", "FELLOWSHIP", "GRANT", "MENTORSHIP", "STARTUP_PROGRAM", "TRAINING"]),
  location: z.string().trim().optional().default("Remote"),
  remote: z.boolean().optional().default(false),
  deadline: z.coerce.date(),
  requiredSkills: stringArrayDedupe.optional().default([]),
  experienceLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional().default("BEGINNER"),
  eligibility: z.string().trim().optional().default(""),
  applicationUrl: z.string().trim().url("Valid URL required"),
  tags: stringArrayDedupe.optional().default([]),
});

export const updateOpportunitySchema = createOpportunitySchema.partial();
