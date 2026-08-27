import { Opportunity } from "./opportunity";

export interface DashboardSummary {
  relevantOpportunities: number;
  strongMatches: number;
  applications: number;
  skillsToImprove: number;
}

export interface TopOpportunity extends Opportunity {
  matchPercentage: number;
  recommendationReason?: string;
}

export interface ApplicationProgress {
  saved: number;
  preparing: number;
  applied: number;
  interview: number;
  accepted: number;
}

export interface SkillReadinessItem {
  skill: string;
  percentage: number;
}

export interface RecentActivity {
  id: string;
  type: "saved" | "plan_generated" | "applied" | "interview" | "other";
  description: string;
  timestamp: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  topOpportunities: TopOpportunity[];
  applicationProgress: ApplicationProgress;
  skillReadiness: SkillReadinessItem[];
  recentActivity: RecentActivity[];
}
