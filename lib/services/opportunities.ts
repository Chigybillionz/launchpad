import { MatchedOpportunity, MatchExplanation } from "@/types/match";

export interface GetOpportunitiesParams {
  search?: string;
  type?: string;
  remote?: boolean | string;
  location?: string;
  experienceLevel?: string;
  page?: number;
  limit?: number;
}

export const OpportunitiesService = {
  async getOpportunities(params: GetOpportunitiesParams = {}) {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.set("search", params.search);
    if (params.type && params.type !== "all") searchParams.set("type", params.type);
    if (params.remote !== undefined && params.remote !== "all" && params.remote !== "") searchParams.set("remote", params.remote.toString());
    if (params.location && params.location !== "all") searchParams.set("location", params.location);
    if (params.experienceLevel && params.experienceLevel !== "all") searchParams.set("experienceLevel", params.experienceLevel);
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());

    const res = await fetch(`/api/matches?${searchParams.toString()}`);
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error?.message || "Failed to fetch opportunities");
    }

    return {
      data: json.data.matches,
      total: json.data.pagination.total,
      page: json.data.pagination.page,
      limit: json.data.pagination.limit,
      hasMore: json.data.pagination.page < json.data.pagination.totalPages,
    };
  },

  async getOpportunityWithMatch(id: string): Promise<MatchedOpportunity> {
    const res = await fetch(`/api/matches/${id}`);
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error?.message || "Opportunity not found");
    }

    return json.data;
  },

  async getOpportunityExplanation(id: string): Promise<{ match: MatchedOpportunity["match"]; explanation: MatchExplanation }> {
    const res = await fetch(`/api/matches/${id}/explanation`);
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error?.message || "Explanation not found");
    }

    return json.data;
  },

  async saveOpportunity(id: string): Promise<void> {
    const res = await fetch("/api/saved-opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: id }),
    });

    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error?.message || "Failed to save opportunity");
    }
  },

  async unsaveOpportunity(id: string): Promise<void> {
    const res = await fetch(`/api/saved-opportunities/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error?.message || "Failed to unsave opportunity");
    }
  },

  async isOpportunitySaved(id: string): Promise<boolean> {
    const res = await fetch(`/api/saved-opportunities/${id}`);
    if (!res.ok) return false;
    const json = await res.json();
    return json.data?.saved || false;
  }
};
