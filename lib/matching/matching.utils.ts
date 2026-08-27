export const MATCH_WEIGHTS = {
  skills: 0.5,
  experience: 0.2,
  goals: 0.15,
  location: 0.1,
  interests: 0.05,
};

export function normalizeString(str: string): string {
  if (!str) return "";
  return str.trim().toLowerCase();
}

export function getMatchLabel(score: number): string {
  if (score >= 90) return "Excellent Match";
  if (score >= 75) return "Strong Match";
  if (score >= 60) return "Potential Match";
  if (score >= 40) return "Weak Match";
  return "Low Match";
}

// Map Opportunity Type to standard User Goal categories
export const GOAL_TO_OPPORTUNITY_TYPE_MAP: Record<string, string> = {
  INTERNSHIP: "Internship",
  JOB: "Job",
  HACKATHON: "Hackathon",
  SCHOLARSHIP: "Scholarship",
  FELLOWSHIP: "Fellowship",
  GRANT: "Grant",
  MENTORSHIP: "Mentorship",
  STARTUP_PROGRAM: "Startup / Entrepreneurship",
  TRAINING: "Learning / Training",
};
