export type OpportunityType =
  | "internship"
  | "job"
  | "fellowship"
  | "scholarship"
  | "grant"
  | "hackathon"
  | "bootcamp"
  | "program"
  | "mentorship"
  | "startup program";

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  type: OpportunityType;
  location: string;
  remote: boolean;
  deadline: string;
  requiredSkills: string[];
  experienceLevel: string;
  eligibility: string;
  applicationUrl: string;
  tags: string[];
  createdAt: string;
  matchScore?: number;
}
