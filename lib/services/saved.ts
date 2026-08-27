import { Opportunity } from "@/types/opportunity";
import { Pagination, SavedOpportunity } from "@/types/saved";

export interface PopulatedSavedOpportunity {
  id: string;
  createdAt: string;
  opportunity: Opportunity;
}

export interface SavedListResponse {
  items: PopulatedSavedOpportunity[];
  pagination: Pagination;
}

export const SavedService = {
  async getSavedOpportunities(page = 1, limit = 10): Promise<SavedListResponse> {
    const res = await fetch(`/api/saved-opportunities?page=${page}&limit=${limit}`);
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || "Failed to load saved opportunities");
    }

    return json.data;
  },

  async saveOpportunity(opportunityId: string): Promise<{ saved: true }> {
    const res = await fetch("/api/saved-opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId }),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || "Failed to save opportunity");
    }

    return json.data;
  },

  async removeSaved(opportunityId: string): Promise<{ saved: false }> {
    const res = await fetch(`/api/saved-opportunities/${opportunityId}`, {
      method: "DELETE",
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || "Failed to remove saved opportunity");
    }

    return json.data;
  },

  async isSaved(opportunityId: string): Promise<boolean> {
    const res = await fetch(`/api/saved-opportunities/${opportunityId}`);
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || "Failed to load saved status");
    }

    return Boolean(json.data.saved);
  },

  async checkStatus(opportunityId: string): Promise<SavedOpportunity | null> {
    const saved = await this.isSaved(opportunityId);
    return saved ? { id: "", userId: "", opportunityId, createdAt: new Date().toISOString() } : null;
  },
};
