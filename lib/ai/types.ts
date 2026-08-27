import { z } from "zod";

// --- Zod schemas for validating AI output ---

export const aiSkillToImproveSchema = z.object({
  skill: z.string(),
  reason: z.string(),
  estimatedEffort: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export const aiActionStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  description: z.string(),
  timeframe: z.string(),
});

export const aiReadinessPlanSchema = z.object({
  summary: z.string(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  skillsToImprove: z.array(aiSkillToImproveSchema),
  actionPlan: z.array(aiActionStepSchema),
  interviewPreparation: z.array(z.string()),
  applicationAdvice: z.array(z.string()),
});

// --- TypeScript types derived from schemas ---

export type AISkillToImprove = z.infer<typeof aiSkillToImproveSchema>;
export type AIActionStep = z.infer<typeof aiActionStepSchema>;
export type AIReadinessPlan = z.infer<typeof aiReadinessPlanSchema>;

// --- Input type for the AI service ---

export interface ReadinessInput {
  user: {
    name: string;
    role: string;
    experienceLevel: string;
    location: string;
    skills: string[];
    interests: string[];
    goals: string[];
  };
  opportunity: {
    title: string;
    organization: string;
    type: string;
    location: string;
    remote: boolean;
    requiredSkills: string[];
    experienceLevel: string;
    description: string;
  };
  match: {
    score: number;
    label: string;
    breakdown: {
      skills: number;
      experience: number;
      goals: number;
      location: number;
      interests: number;
    };
    matchedSkills: string[];
    missingSkills: string[];
  };
  skillGap: {
    missingSkills: Array<{
      skill: string;
      priority: string;
      importance: number;
    }>;
    skillMatchPercentage: number;
  };
}
