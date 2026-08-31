import { z } from "zod";

const stringArrayDedupe = z
  .array(z.string().trim().min(1, "Value cannot be empty"))
  .transform((val) => Array.from(new Set(val)));

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").optional(),
  role: z.string().trim().optional(),
  experienceLevel: z.string().transform(s => s.toUpperCase()).pipe(z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])).optional(),
  location: z.string().trim().optional(),
  skills: stringArrayDedupe.optional(),
  interests: stringArrayDedupe.optional(),
  goals: stringArrayDedupe.optional(),
  workPreferences: stringArrayDedupe.optional(),
});

export const completeProfileSchema = updateProfileSchema.extend({
  name: z.string().trim().min(1, "Name is required"),
  role: z.string().trim().min(1, "Role is required"),
  experienceLevel: z.string().transform(s => s.toUpperCase()).pipe(z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])),
  location: z.string().trim().min(1, "Location is required"),
  skills: stringArrayDedupe.refine((val) => val.length > 0, "At least one skill is required"),
  interests: stringArrayDedupe.refine((val) => val.length > 0, "At least one interest is required"),
  goals: stringArrayDedupe.refine((val) => val.length > 0, "At least one goal is required"),
});
