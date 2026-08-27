export type ApplicationStatus =
  | "saved"
  | "preparing"
  | "applied"
  | "interview"
  | "accepted"
  | "rejected";

export interface SavedOpportunity {
  id: string;
  userId: string;
  opportunityId: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}
