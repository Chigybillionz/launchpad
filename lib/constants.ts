import type { ExperienceLevel, OpportunityType, ApplicationStatus } from "@/types";

// ─── Skills ─────────────────────────────────────────────────────────
export const SKILL_CATEGORIES = {
  frontend: [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Vue",
    "Angular",
    "Svelte",
    "Tailwind CSS",
  ],
  backend: [
    "Node.js",
    "Python",
    "Java",
    "Go",
    "Rust",
    "Ruby",
    "PHP",
    "C#",
    "Express",
    "Django",
    "FastAPI",
    "Spring",
  ],
  data: [
    "SQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "GraphQL",
    "Prisma",
    "Firebase",
  ],
  devops: [
    "Git",
    "Docker",
    "Kubernetes",
    "AWS",
    "GCP",
    "Azure",
    "CI/CD",
    "Linux",
  ],
  design: [
    "Figma",
    "UI Design",
    "UX Research",
    "Prototyping",
    "Design Systems",
  ],
  mobile: [
    "React Native",
    "Flutter",
    "Swift",
    "Kotlin",
    "iOS",
    "Android",
  ],
  other: [
    "Machine Learning",
    "Data Science",
    "Cybersecurity",
    "Blockchain",
    "Technical Writing",
    "Project Management",
    "Agile",
    "Testing",
  ],
} as const;

export const ALL_SKILLS = Object.values(SKILL_CATEGORIES).flat();

// ─── Experience Levels ──────────────────────────────────────────────
export const EXPERIENCE_LEVELS: {
  value: ExperienceLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "beginner",
    label: "Beginner",
    description: "Less than 1 year of experience or still learning fundamentals",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "1–3 years of experience with some projects completed",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "3+ years of experience with significant project history",
  },
];

// ─── Opportunity Types ──────────────────────────────────────────────
export const OPPORTUNITY_TYPES: {
  value: OpportunityType;
  label: string;
}[] = [
  { value: "internship", label: "Internship" },
  { value: "job", label: "Job" },
  { value: "fellowship", label: "Fellowship" },
  { value: "scholarship", label: "Scholarship" },
  { value: "grant", label: "Grant" },
  { value: "hackathon", label: "Hackathon" },
  { value: "bootcamp", label: "Bootcamp" },
  { value: "program", label: "Program" },
];

// ─── Goals ──────────────────────────────────────────────────────────
export const GOALS = [
  "Job",
  "Internship",
  "Hackathon",
  "Fellowship",
  "Scholarship",
  "Grant",
  "Mentorship",
  "Bootcamp",
  "Portfolio",
] as const;

// ─── Interests ──────────────────────────────────────────────────────
export const INTERESTS = [
  "Web Development",
  "Mobile Development",
  "AI / Machine Learning",
  "Data Science",
  "Blockchain",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "UI/UX Design",
  "Game Development",
  "Open Source",
  "Startups",
] as const;

// ─── Work Preferences ───────────────────────────────────────────────
export const WORK_PREFERENCES = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
] as const;

// ─── Application Status ─────────────────────────────────────────────
export const APPLICATION_STATUSES: {
  value: ApplicationStatus;
  label: string;
  color: string;
}[] = [
  { value: "APPLIED", label: "Applied", color: "info" },
  { value: "UNDER_REVIEW", label: "Under Review", color: "secondary" },
  { value: "SHORTLISTED", label: "Shortlisted", color: "warning" },
  { value: "INTERVIEW", label: "Interview", color: "warning" },
  { value: "ACCEPTED", label: "Accepted", color: "success" },
  { value: "REJECTED", label: "Rejected", color: "destructive" },
  { value: "WITHDRAWN", label: "Withdrawn", color: "default" },
];

// ─── Match Score Tiers ──────────────────────────────────────────────
export const MATCH_TIERS = [
  { min: 90, max: 100, label: "Excellent Match", level: "excellent" },
  { min: 75, max: 89, label: "Strong Match", level: "strong" },
  { min: 60, max: 74, label: "Potential Match", level: "potential" },
  { min: 0, max: 59, label: "Low Match", level: "low" },
] as const;

export function getMatchTier(score: number) {
  return (
    MATCH_TIERS.find((t) => score >= t.min && score <= t.max) ?? MATCH_TIERS[3]
  );
}

// ─── Navigation ─────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Opportunities", href: "/dashboard/opportunities", icon: "Compass" },
  { label: "Saved", href: "/dashboard/saved", icon: "Bookmark" },
  { label: "Profile", href: "/dashboard/profile", icon: "User" },
] as const;

// ─── Animation Conventions ──────────────────────────────────────────
export const MOTION = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  staggerContainer: {
    animate: { transition: { staggerChildren: 0.08 } },
  },
  staggerItem: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.25 },
  },
} as const;
