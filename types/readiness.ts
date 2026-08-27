export interface ReadinessTask {
  id: string;
  title: string;
  description: string;
  estimatedEffort: string;
  completed: boolean;
}

export interface ReadinessDay {
  dayNumber: number;
  tasks: ReadinessTask[];
}

export interface SkillToImprove {
  skill: string;
  reason: string;
  estimatedEffort: "LOW" | "MEDIUM" | "HIGH";
}

export interface ReadinessPlan {
  opportunityId: string;
  summary: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  skillsToImprove: SkillToImprove[];
  days: ReadinessDay[];
  interviewPreparation: string[];
  applicationAdvice: string[];
  generatedAt: string;
}

export interface ReadinessApiResponse {
  matchScore: number;
  matchLabel: string;
  aiAvailable: boolean;
  readinessPlan: ReadinessPlan | null;
  fallback?: {
    message: string;
    missingSkills: string[];
  };
}
