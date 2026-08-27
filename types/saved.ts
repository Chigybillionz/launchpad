import { Opportunity } from "./opportunity";

export type ApplicationStatus =
  | "APPLIED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface SavedOpportunity {
  id: string;
  userId: string;
  opportunityId: string;
  createdAt: string;
  opportunity?: Opportunity;
}

export interface Application {
  id: string;
  userId: string;
  opportunityId: string;
  status: ApplicationStatus;
  appliedAt: string;
  notes?: string | null;
  externalApplicationUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  opportunity?: Opportunity;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
