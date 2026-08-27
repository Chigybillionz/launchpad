export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  experienceLevel: ExperienceLevel;
  location: string;
  skills: string[];
  interests: string[];
  goals: string[];
  workPreferences?: string[];
  avatarUrl?: string;
  profileCompleted?: boolean;
  createdAt: string;
}
