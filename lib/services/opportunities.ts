import { Opportunity } from "@/types/opportunity";
import { MatchedOpportunity, MatchResult } from "@/types/match";

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

    const res = await fetch(`/api/opportunities?${searchParams.toString()}`);
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error?.message || "Failed to fetch opportunities");
    }

    return {
      data: json.data.opportunities,
      total: json.data.pagination.total,
      page: json.data.pagination.page,
      limit: json.data.pagination.limit,
      hasMore: json.data.pagination.page < json.data.pagination.totalPages,
    };
  },

  async getOpportunityWithMatch(id: string): Promise<MatchedOpportunity> {
    const res = await fetch(`/api/opportunities/${id}`);
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error?.message || "Opportunity not found");
    }

    const opportunity: Opportunity = json.data.opportunity;

    // Placeholder match analysis based on the opportunity (to be replaced in Task 05)
    const baseScore = 75;
    const matchedSkills = opportunity.requiredSkills.slice(0, Math.max(1, opportunity.requiredSkills.length - 1));
    const missingSkills = opportunity.requiredSkills.slice(Math.max(1, opportunity.requiredSkills.length - 1));

    const match: MatchResult = {
      score: baseScore,
      skillScore: Math.min(100, baseScore + 5),
      experienceScore: baseScore - 5,
      locationScore: opportunity.remote ? 100 : 80,
      interestScore: Math.min(100, baseScore + 10),
      goalScore: baseScore,
      matchedSkills,
      missingSkills,
      explanation: `You already have ${matchedSkills.join(", ")} experience, which closely matches the core requirements for this ${opportunity.type}.`,
    };

    return {
      opportunity,
      match,
    };
  },

  // Mock save functionality
  async saveOpportunity(id: string): Promise<void> {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("saved_opportunities") || "[]");
      if (!saved.includes(id)) {
        saved.push(id);
        localStorage.setItem("saved_opportunities", JSON.stringify(saved));
      }
    }
  },

  async unsaveOpportunity(id: string): Promise<void> {
    if (typeof window !== "undefined") {
      let saved = JSON.parse(localStorage.getItem("saved_opportunities") || "[]");
      saved = saved.filter((savedId: string) => savedId !== id);
      localStorage.setItem("saved_opportunities", JSON.stringify(saved));
    }
  },

  async isOpportunitySaved(id: string): Promise<boolean> {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("saved_opportunities") || "[]");
      return saved.includes(id);
    }
    return false;
  }
};
