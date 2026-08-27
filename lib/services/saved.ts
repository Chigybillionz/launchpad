import { ApplicationStatus, SavedOpportunity } from "@/types/saved";
import { mockOpportunities } from "./opportunities";
import { Opportunity } from "@/types/opportunity";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface PopulatedSavedOpportunity {
  savedRecord: SavedOpportunity;
  opportunity: Opportunity;
}

export const SavedService = {
  async getSavedOpportunities(statusFilter: string = "all"): Promise<PopulatedSavedOpportunity[]> {
    await delay(600);
    if (typeof window === "undefined") return [];

    const saved: SavedOpportunity[] = JSON.parse(localStorage.getItem("v2_saved_opportunities") || "[]");
    
    const populated = saved
      .map(record => ({
        savedRecord: record,
        opportunity: mockOpportunities.find(o => o.id === record.opportunityId)
      }))
      .filter(item => item.opportunity !== undefined) as PopulatedSavedOpportunity[];

    let sorted = populated.sort((a, b) => new Date(b.savedRecord.updatedAt).getTime() - new Date(a.savedRecord.updatedAt).getTime());

    if (statusFilter !== "all") {
      sorted = sorted.filter(item => item.savedRecord.status === statusFilter);
    }

    return sorted;
  },

  async saveOpportunity(opportunityId: string): Promise<SavedOpportunity> {
    await delay(400);
    if (typeof window === "undefined") throw new Error("Window is undefined");

    const saved: SavedOpportunity[] = JSON.parse(localStorage.getItem("v2_saved_opportunities") || "[]");
    
    let record = saved.find(s => s.opportunityId === opportunityId);
    if (!record) {
      record = {
        id: Math.random().toString(36).substring(2, 9),
        userId: "user_1",
        opportunityId,
        status: "saved",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saved.push(record);
      localStorage.setItem("v2_saved_opportunities", JSON.stringify(saved));
    }
    
    return record;
  },

  async updateStatus(opportunityId: string, status: ApplicationStatus): Promise<void> {
    await delay(400);
    if (typeof window === "undefined") return;

    const saved: SavedOpportunity[] = JSON.parse(localStorage.getItem("v2_saved_opportunities") || "[]");
    const index = saved.findIndex(s => s.opportunityId === opportunityId);
    
    if (index !== -1) {
      saved[index].status = status;
      saved[index].updatedAt = new Date().toISOString();
      localStorage.setItem("v2_saved_opportunities", JSON.stringify(saved));
    }
  },

  async removeSaved(opportunityId: string): Promise<void> {
    await delay(400);
    if (typeof window === "undefined") return;

    let saved: SavedOpportunity[] = JSON.parse(localStorage.getItem("v2_saved_opportunities") || "[]");
    saved = saved.filter(s => s.opportunityId !== opportunityId);
    localStorage.setItem("v2_saved_opportunities", JSON.stringify(saved));
  },

  async checkStatus(opportunityId: string): Promise<ApplicationStatus | null> {
    await delay(200);
    if (typeof window === "undefined") return null;

    const saved: SavedOpportunity[] = JSON.parse(localStorage.getItem("v2_saved_opportunities") || "[]");
    const record = saved.find(s => s.opportunityId === opportunityId);
    return record ? record.status : null;
  }
};
