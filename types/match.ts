import type { Opportunity } from "./opportunity";

export interface MatchResult {
  score: number;
  skillScore: number;
  experienceScore: number;
  locationScore: number;
  interestScore: number;
  goalScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  explanation?: string;
}

export interface MatchedOpportunity {
  opportunity: Opportunity;
  match: MatchResult;
}
