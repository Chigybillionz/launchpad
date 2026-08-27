import { SkillGapAnalysis, GlobalSkillGapAnalysis } from "@/types/skill-gap";

export const SkillGapService = {
  async getOpportunitySkillGap(opportunityId: string): Promise<SkillGapAnalysis> {
    const res = await fetch(`/api/skill-gaps/${opportunityId}`);
    const json = await res.json();

    if (!json.success) {
      throw new Error(json.error?.message || "Failed to fetch skill gap analysis");
    }

    return json.data.analysis;
  },

  async getGlobalSkillGaps(): Promise<GlobalSkillGapAnalysis> {
    const res = await fetch("/api/skill-gaps");
    const json = await res.json();

    if (!json.success) {
      throw new Error(json.error?.message || "Failed to fetch global skill gaps");
    }

    return json.data;
  },
};
