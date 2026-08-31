import type { DashboardData } from "@/types";


const INITIAL_DASHBOARD_DATA: DashboardData = {
  summary: {
    relevantOpportunities: 0,
    strongMatches: 0,
    applications: 0,
    skillsToImprove: 0,
  },
  topOpportunities: [],
  applicationProgress: {
    saved: 0,
    preparing: 0,
    applied: 0,
    interview: 0,
    accepted: 0,
  },
  skillReadiness: [],
  recentActivity: [],
};

export const DashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch dashboard on server without DB connection");
    }
    return INITIAL_DASHBOARD_DATA;
  },
};
