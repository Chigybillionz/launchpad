import { Opportunity } from "@/types/opportunity";
import { MatchedOpportunity, MatchResult } from "@/types/match";

export const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Frontend Developer Internship",
    organization: "TechCorp",
    description: "Join our team to build scalable web applications.",
    type: "internship",
    location: "San Francisco, CA",
    remote: true,
    deadline: "2026-09-30",
    requiredSkills: ["React", "JavaScript", "Git"],
    experienceLevel: "Entry Level",
    eligibility: "Students currently enrolled in a BS/MS program.",
    applicationUrl: "#",
    tags: ["frontend", "web"],
    createdAt: "2026-08-20T10:00:00Z",
    matchScore: 92,
  },
  {
    id: "2",
    title: "AI Research Fellowship",
    organization: "OpenAI Labs",
    description: "Research cutting-edge foundation models.",
    type: "fellowship",
    location: "Remote",
    remote: true,
    deadline: "2026-10-15",
    requiredSkills: ["Python", "PyTorch", "Machine Learning"],
    experienceLevel: "Advanced",
    eligibility: "PhD candidates or recent graduates.",
    applicationUrl: "#",
    tags: ["ai", "research"],
    createdAt: "2026-08-15T10:00:00Z",
    matchScore: 85,
  },
  {
    id: "3",
    title: "Software Engineer",
    organization: "Innovate Inc.",
    description: "Full-stack role focusing on high-performance systems.",
    type: "job",
    location: "New York, NY",
    remote: false,
    deadline: "2026-09-01",
    requiredSkills: ["TypeScript", "Node.js", "SQL"],
    experienceLevel: "Mid Level",
    eligibility: "3+ years of experience.",
    applicationUrl: "#",
    tags: ["fullstack", "engineering"],
    createdAt: "2026-08-01T10:00:00Z",
    matchScore: 78,
  },
  {
    id: "4",
    title: "Global Hackathon 2026",
    organization: "HackerEarth",
    description: "48-hour coding challenge to solve global issues.",
    type: "hackathon",
    location: "Virtual",
    remote: true,
    deadline: "2026-09-10",
    requiredSkills: ["Problem Solving", "Teamwork"],
    experienceLevel: "All Levels",
    eligibility: "Open to all developers.",
    applicationUrl: "#",
    tags: ["hackathon", "competition"],
    createdAt: "2026-08-25T10:00:00Z",
    matchScore: 95,
  },
  {
    id: "5",
    title: "Women in Tech Scholarship",
    organization: "TechFoundation",
    description: "$10,000 scholarship for aspiring female engineers.",
    type: "scholarship",
    location: "Global",
    remote: true,
    deadline: "2026-11-01",
    requiredSkills: ["Leadership", "Community"],
    experienceLevel: "Student",
    eligibility: "Female students in STEM.",
    applicationUrl: "#",
    tags: ["scholarship", "diversity"],
    createdAt: "2026-08-10T10:00:00Z",
    matchScore: 88,
  },
  {
    id: "6",
    title: "Seed Grant for Open Source",
    organization: "OpenSource Foundation",
    description: "Funding for promising open-source projects.",
    type: "grant",
    location: "Remote",
    remote: true,
    deadline: "2026-12-31",
    requiredSkills: ["Open Source", "Architecture"],
    experienceLevel: "Intermediate",
    eligibility: "Maintainers of open-source projects.",
    applicationUrl: "#",
    tags: ["grant", "funding"],
    createdAt: "2026-08-26T10:00:00Z",
    matchScore: 70,
  },
  {
    id: "7",
    title: "Senior Product Designer",
    organization: "Creative Co.",
    description: "Lead design initiatives for our flagship product.",
    type: "job",
    location: "London, UK",
    remote: false,
    deadline: "2026-09-20",
    requiredSkills: ["Figma", "UI/UX", "Prototyping"],
    experienceLevel: "Senior",
    eligibility: "5+ years of design experience.",
    applicationUrl: "#",
    tags: ["design", "product"],
    createdAt: "2026-08-05T10:00:00Z",
    matchScore: 65,
  },
  {
    id: "8",
    title: "Launchpad Mentorship Program",
    organization: "Launchpad",
    description: "Get paired with an industry expert for 6 months.",
    type: "mentorship",
    location: "Remote",
    remote: true,
    deadline: "2026-09-15",
    requiredSkills: ["Curiosity", "Growth Mindset"],
    experienceLevel: "Entry Level",
    eligibility: "Early career professionals.",
    applicationUrl: "#",
    tags: ["mentorship", "career"],
    createdAt: "2026-08-22T10:00:00Z",
    matchScore: 99,
  },
  {
    id: "9",
    title: "Y Combinator Winter 2027",
    organization: "Y Combinator",
    description: "Startup accelerator program.",
    type: "startup program",
    location: "San Francisco, CA",
    remote: false,
    deadline: "2026-10-01",
    requiredSkills: ["Entrepreneurship", "Product Management"],
    experienceLevel: "All Levels",
    eligibility: "Early stage startups.",
    applicationUrl: "#",
    tags: ["startup", "accelerator"],
    createdAt: "2026-08-18T10:00:00Z",
    matchScore: 82,
  },
];

export interface GetOpportunitiesParams {
  search?: string;
  type?: string;
  remote?: boolean | string;
  location?: string;
  experienceLevel?: string;
  page?: number;
  limit?: number;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const OpportunitiesService = {
  async getOpportunities(params: GetOpportunitiesParams = {}) {
    await delay(600); // Simulate network latency

    let filtered = [...mockOpportunities];

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(searchLower) ||
          opp.organization.toLowerCase().includes(searchLower) ||
          opp.requiredSkills.some((skill) =>
            skill.toLowerCase().includes(searchLower)
          ) ||
          opp.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (params.type && params.type !== "all") {
      const filterType = params.type.toLowerCase();
      filtered = filtered.filter(
        (opp) => opp.type.toLowerCase() === filterType
      );
    }

    if (params.remote !== undefined && params.remote !== "all" && params.remote !== "") {
      const isRemote = params.remote === true || params.remote === "true";
      const isNotRemote = params.remote === false || params.remote === "false";
      
      if (isRemote || isNotRemote) {
        filtered = filtered.filter((opp) => opp.remote === isRemote);
      }
    }

    if (params.location && params.location !== "all") {
      filtered = filtered.filter(
        (opp) =>
          opp.location.toLowerCase().includes(params.location!.toLowerCase()) ||
          (params.location === "Remote" && opp.remote)
      );
    }

    if (params.experienceLevel && params.experienceLevel !== "all") {
      filtered = filtered.filter((opp) =>
        opp.experienceLevel
          .toLowerCase()
          .includes(params.experienceLevel!.toLowerCase())
      );
    }

    const page = params.page || 1;
    const limit = params.limit || 6;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginated = filtered.slice(startIndex, endIndex);

    return {
      data: paginated,
      total: filtered.length,
      page,
      limit,
      hasMore: endIndex < filtered.length,
    };
  },

  async getOpportunityWithMatch(id: string): Promise<MatchedOpportunity> {
    await delay(700);

    const opportunity = mockOpportunities.find((o) => o.id === id);
    if (!opportunity) {
      throw new Error("Opportunity not found");
    }

    // Mock match analysis based on the opportunity
    const baseScore = opportunity.matchScore || 75;
    
    // Create some dummy match details based on the title/type
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

  // Mock save functionality (using localStorage if available, or just memory)
  async saveOpportunity(id: string): Promise<void> {
    await delay(500);
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("saved_opportunities") || "[]");
      if (!saved.includes(id)) {
        saved.push(id);
        localStorage.setItem("saved_opportunities", JSON.stringify(saved));
      }
    }
  },

  async unsaveOpportunity(id: string): Promise<void> {
    await delay(500);
    if (typeof window !== "undefined") {
      let saved = JSON.parse(localStorage.getItem("saved_opportunities") || "[]");
      saved = saved.filter((savedId: string) => savedId !== id);
      localStorage.setItem("saved_opportunities", JSON.stringify(saved));
    }
  },

  async isOpportunitySaved(id: string): Promise<boolean> {
    await delay(300);
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("saved_opportunities") || "[]");
      return saved.includes(id);
    }
    return false;
  }
};
