export interface LearningResource {
  title: string;
  url: string;
  type: "tutorial" | "documentation" | "interactive" | "course" | "roadmap";
  provider: string;
  isFree?: boolean;
}

export interface SkillLearningPlan {
  skill: string;
  summary: string;
  quickTip: string;
  quests: string[];
  resources: LearningResource[];
}

const CURATED_RESOURCES: Record<string, SkillLearningPlan> = {
  postgresql: {
    skill: "PostgreSQL",
    summary: "Master modern relational databases, SQL queries, relational joins, and indexing.",
    quickTip: "Postgres is the world's most popular open-source SQL database. Start with basic SELECT/JOIN queries, then schema migrations with Prisma.",
    quests: [
      "Master SELECT, WHERE, GROUP BY and multi-table JOINs",
      "Design relational schemas with foreign keys & unique constraints",
      "Learn indexing (B-Tree, GIN) and query performance basics with EXPLAIN",
      "Connect PostgreSQL to Next.js using Prisma ORM"
    ],
    resources: [
      {
        title: "Supabase Interactive Postgres Guide",
        url: "https://supabase.com/docs/guides/database/overview",
        type: "interactive",
        provider: "Supabase",
        isFree: true,
      },
      {
        title: "SQLZoo Interactive SQL Tutorial",
        url: "https://sqlzoo.net/",
        type: "interactive",
        provider: "SQLZoo",
        isFree: true,
      },
      {
        title: "PostgreSQL Tutorial for Beginners",
        url: "https://www.postgresqltutorial.com/",
        type: "tutorial",
        provider: "PostgreSQL Tutorial",
        isFree: true,
      },
      {
        title: "PostgreSQL Developer Roadmap",
        url: "https://roadmap.sh/postgresql-dba",
        type: "roadmap",
        provider: "Roadmap.sh",
        isFree: true,
      },
    ],
  },
  postgres: {
    skill: "PostgreSQL",
    summary: "Master modern relational databases, SQL queries, relational joins, and indexing.",
    quickTip: "Start with basic SELECT/JOIN queries, then schema design and Prisma migrations.",
    quests: [
      "Master SELECT, WHERE, GROUP BY and multi-table JOINs",
      "Design relational schemas with foreign keys & constraints",
      "Connect PostgreSQL to Next.js using Prisma ORM"
    ],
    resources: [
      {
        title: "Supabase Interactive Postgres Guide",
        url: "https://supabase.com/docs/guides/database/overview",
        type: "interactive",
        provider: "Supabase",
        isFree: true,
      },
      {
        title: "SQLZoo Interactive SQL Tutorial",
        url: "https://sqlzoo.net/",
        type: "interactive",
        provider: "SQLZoo",
        isFree: true,
      },
    ],
  },
  sql: {
    skill: "SQL",
    summary: "Learn structured query language to query, filter, and transform relational datasets.",
    quickTip: "Focus on aggregation, JOINs, subqueries, and grouping.",
    quests: [
      "Write multi-table queries with INNER, LEFT, and FULL JOINs",
      "Practice aggregations using COUNT, SUM, AVG, and HAVING",
      "Understand table indexing and primary/foreign keys"
    ],
    resources: [
      {
        title: "SQLZoo Interactive SQL Tutorial",
        url: "https://sqlzoo.net/",
        type: "interactive",
        provider: "SQLZoo",
        isFree: true,
      },
      {
        title: "W3Schools SQL Tutorial",
        url: "https://www.w3schools.com/sql/",
        type: "tutorial",
        provider: "W3Schools",
        isFree: true,
      },
    ],
  },
  typescript: {
    skill: "TypeScript",
    summary: "Add static typing to JavaScript to eliminate runtime bugs and improve developer ergonomics.",
    quickTip: "Start by typing function arguments and return types, then learn Generics and Zod schemas.",
    quests: [
      "Define interfaces and union types for API responses",
      "Practice Generics in utility functions",
      "Use TypeScript with Next.js App Router and React Server Components"
    ],
    resources: [
      {
        title: "Total TypeScript Essentials",
        url: "https://www.totaltypescript.com/tutorials",
        type: "interactive",
        provider: "Total TypeScript",
        isFree: true,
      },
      {
        title: "Official TypeScript Handbook",
        url: "https://www.typescriptlang.org/docs/handbook/intro.html",
        type: "documentation",
        provider: "TypeScript",
        isFree: true,
      },
    ],
  },
  react: {
    skill: "React",
    summary: "Build component-driven user interfaces with modern React 19, hooks, and server components.",
    quickTip: "Master useState, useEffect, and component composition before diving into Next.js App Router.",
    quests: [
      "Build reusable UI components with props and state",
      "Understand React rendering lifecycle and hooks",
      "Integrate asynchronous data fetching and loading states"
    ],
    resources: [
      {
        title: "React.dev Interactive Documentation",
        url: "https://react.dev/learn",
        type: "interactive",
        provider: "React",
        isFree: true,
      },
    ],
  },
  "next.js": {
    skill: "Next.js",
    summary: "Full-stack React framework with server-side rendering, API routes, and routing conventions.",
    quickTip: "Learn App Router conventions (layout, page, loading, route handlers, proxy/middleware).",
    quests: [
      "Build server and client components in Next.js App Router",
      "Create API Route Handlers for REST endpoints",
      "Implement dynamic routing and search params"
    ],
    resources: [
      {
        title: "Next.js Official Learn Course",
        url: "https://nextjs.org/learn",
        type: "interactive",
        provider: "Vercel",
        isFree: true,
      },
    ],
  },
  python: {
    skill: "Python",
    summary: "Versatile programming language for web backends, data science, and AI/ML pipelines.",
    quickTip: "Write idiomatic Python with list comprehensions, type hints, and standard libraries.",
    quests: [
      "Build simple REST APIs with FastAPI or Flask",
      "Work with data structures, JSON, and file I/O",
      "Explore libraries like Pandas and NumPy for data manipulation"
    ],
    resources: [
      {
        title: "Python.org Beginner's Guide",
        url: "https://docs.python.org/3/tutorial/",
        type: "documentation",
        provider: "Python",
        isFree: true,
      },
      {
        title: "Real Python Tutorials",
        url: "https://realpython.com/",
        type: "tutorial",
        provider: "Real Python",
        isFree: true,
      },
    ],
  },
  "public speaking": {
    skill: "Public Speaking",
    summary: "Communicate technical concepts clearly to developer audiences and conference attendees.",
    quickTip: "Start with 5-minute lightning talks or demo recordings to build confidence and rhythm.",
    quests: [
      "Record a 3-minute video explaining a technical project or feature",
      "Prepare a slide deck with high signal-to-noise ratio",
      "Practice answering spontaneous technical Q&A"
    ],
    resources: [
      {
        title: "Developer Relations Guide to Speaking",
        url: "https://devrel.net/category/speaking",
        type: "tutorial",
        provider: "DevRel.net",
        isFree: true,
      },
      {
        title: "Toastmasters Tips for Public Speaking",
        url: "https://www.toastmasters.org/resources/public-speaking-tips",
        type: "tutorial",
        provider: "Toastmasters",
        isFree: true,
      },
    ],
  },
  writing: {
    skill: "Technical Writing",
    summary: "Produce clear, concise tutorials, documentation, and technical blog posts.",
    quickTip: "Structure posts with a clear hook, problem definition, code sample, and key takeaways.",
    quests: [
      "Write a step-by-step tutorial solving a specific developer pain point",
      "Document an API endpoint with request/response schemas",
      "Review and edit copy to eliminate jargon and fluff"
    ],
    resources: [
      {
        title: "Google Technical Writing Course",
        url: "https://developers.google.com/tech-writing",
        type: "course",
        provider: "Google Developers",
        isFree: true,
      },
    ],
  },
  docker: {
    skill: "Docker",
    summary: "Containerize applications for consistent local development and cloud deployments.",
    quickTip: "Learn Dockerfile commands (FROM, RUN, COPY, CMD) and docker-compose for multi-container setups.",
    quests: [
      "Containerize a Node.js / Next.js web application",
      "Use docker-compose to run PostgreSQL and Redis locally",
      "Optimize container images using multi-stage builds"
    ],
    resources: [
      {
        title: "Docker Get Started Guide",
        url: "https://docs.docker.com/get-started/",
        type: "documentation",
        provider: "Docker",
        isFree: true,
      },
    ],
  },
};

export function getSkillLearningPlan(skillName: string): SkillLearningPlan {
  const normalized = skillName.trim().toLowerCase();
  
  if (CURATED_RESOURCES[normalized]) {
    return CURATED_RESOURCES[normalized];
  }

  // Check partial key matches
  for (const key of Object.keys(CURATED_RESOURCES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return CURATED_RESOURCES[key];
    }
  }

  // Dynamic fallback for any other skill
  return {
    skill: skillName,
    summary: `Build proficiency in ${skillName} through hands-on practice and guided documentation.`,
    quickTip: `Focus on fundamentals, core syntax/concepts, and build a mini-project showcasing ${skillName}.`,
    quests: [
      `Review official documentation and core principles of ${skillName}`,
      `Build a small practical demo project utilizing ${skillName}`,
      `Review best practices and common pitfalls in production code`
    ],
    resources: [
      {
        title: `${skillName} on Roadmap.sh`,
        url: `https://roadmap.sh`,
        type: "roadmap",
        provider: "Roadmap.sh",
        isFree: true,
      },
      {
        title: `Search tutorials for ${skillName}`,
        url: `https://www.google.com/search?q=${encodeURIComponent(skillName + " tutorial for beginners")}`,
        type: "tutorial",
        provider: "Google",
        isFree: true,
      },
    ],
  };
}
