import type { DashboardData } from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_DASHBOARD_DATA: DashboardData = {
  summary: {
    relevantOpportunities: 12,
    strongMatches: 5,
    applications: 3,
    skillsToImprove: 2,
  },
  topOpportunities: [
    {
      id: "opp_1",
      title: "Frontend Developer Internship",
      organization: "Tech Innovators Inc.",
      description: "Join our frontend team to build modern web applications using React and Next.js.",
      type: "internship",
      location: "San Francisco, CA",
      remote: true,
      deadline: "2026-09-15T00:00:00.000Z",
      requiredSkills: ["React", "TypeScript", "Tailwind CSS"],
      experienceLevel: "beginner",
      eligibility: "Currently enrolled in a computer science program.",
      applicationUrl: "https://example.com/apply",
      tags: ["frontend", "web", "react"],
      createdAt: new Date().toISOString(),
      matchPercentage: 92,
    },
    {
      id: "opp_2",
      title: "Full Stack Fellowship",
      organization: "Open Source Foundation",
      description: "A 6-month fellowship contributing to critical open source infrastructure.",
      type: "fellowship",
      location: "Global",
      remote: true,
      deadline: "2026-10-01T00:00:00.000Z",
      requiredSkills: ["Node.js", "TypeScript", "PostgreSQL"],
      experienceLevel: "intermediate",
      eligibility: "Demonstrated interest in open source.",
      applicationUrl: "https://example.com/apply2",
      tags: ["open-source", "backend"],
      createdAt: new Date().toISOString(),
      matchPercentage: 85,
    },
  ],
  applicationProgress: {
    saved: 8,
    preparing: 2,
    applied: 3,
    interview: 1,
    accepted: 0,
  },
  skillReadiness: [
    { skill: "TypeScript", percentage: 65 },
    { skill: "Testing (Jest/Cypress)", percentage: 40 },
  ],
  recentActivity: [
    {
      id: "act_1",
      type: "applied",
      description: "Applied to Frontend Developer Internship at Tech Innovators Inc.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: "act_2",
      type: "plan_generated",
      description: "Generated readiness plan for Full Stack roles.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: "act_3",
      type: "saved",
      description: "Saved 'Backend Engineering Bootcamp' opportunity.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    },
  ],
};

export const DashboardService = {
  async getDashboardData(_userId?: string): Promise<DashboardData> {
    void _userId; // mock implementation
    await delay(700); // Simulate network latency

    if (typeof window === "undefined") {
      throw new Error("Cannot fetch dashboard on server without DB connection");
    }

    return MOCK_DASHBOARD_DATA;
  },
};
