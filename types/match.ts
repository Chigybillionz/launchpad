import type { Opportunity } from "./opportunity";

export interface MatchReason {
  category: "skills" | "experience" | "goals" | "location" | "interests";
  title: string;
  description: string;
}

export interface MatchExplanation {
  headline: string;
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  reasons: MatchReason[];
}

export interface MatchResult {
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
  reasons?: string[]; // Legacy reasons from TASK 05 UI, can be kept for backward compatibility if needed, though explanation engine handles this mostly now.
}

export interface MatchedOpportunity {
  opportunity: Opportunity;
  match: MatchResult;
  recommendationReason?: string;
}
