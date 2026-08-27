import { ReadinessApiResponse } from "@/types/readiness";

export const ReadinessService = {
  async generatePlan(opportunityId: string): Promise<ReadinessApiResponse> {
    const res = await fetch(`/api/ai/readiness/${opportunityId}`);
    const json = await res.json();

    if (!json.success) {
      throw new Error(json.error?.message || "Failed to generate readiness plan");
    }

    return json.data;
  },
};
