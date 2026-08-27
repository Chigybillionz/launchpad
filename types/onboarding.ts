import type { ExperienceLevel } from "./user";

export interface OnboardingData {
  // Step 1 — Basic info
  name: string;
  role: string;
  location: string;
  // Step 2 — Experience
  experienceLevel: ExperienceLevel | "";
  // Step 3 — Skills
  skills: string[];
  // Step 4 — Interests
  interests: string[];
  // Step 5 — Goals
  goals: string[];
  // Step 6 — Preferences
  workPreference: string;
  locationPreferences: string[];
}

export const INITIAL_ONBOARDING_DATA: OnboardingData = {
  name: "",
  role: "",
  location: "",
  experienceLevel: "",
  skills: [],
  interests: [],
  goals: [],
  workPreference: "",
  locationPreferences: [],
};

export const ONBOARDING_STEPS = [
  { id: 1, title: "Basic Info", description: "Tell us about yourself" },
  { id: 2, title: "Experience", description: "Your experience level" },
  { id: 3, title: "Skills", description: "What can you do?" },
  { id: 4, title: "Interests", description: "What excites you?" },
  { id: 5, title: "Goals", description: "What are you looking for?" },
  { id: 6, title: "Preferences", description: "How you want to work" },
  { id: 7, title: "Summary", description: "Review your profile" },
] as const;
