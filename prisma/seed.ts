import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Check if we already have opportunities to prevent duplicate seeding
  const count = await prisma.opportunity.count()
  if (count > 0) {
    console.log(`Database already has ${count} opportunities. Skipping seed.`)
    return
  }

  const opportunities = [
    {
      title: "Frontend Developer Internship",
      organization: "Vercel",
      description: "Join the framework team to build scalable web applications. You will work on Next.js core features.",
      type: "INTERNSHIP",
      location: "San Francisco, CA",
      remote: true,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1 month from now
      requiredSkills: ["React", "TypeScript", "Next.js"],
      experienceLevel: "BEGINNER",
      eligibility: "Students currently enrolled in a BS/MS program.",
      applicationUrl: "https://vercel.com/careers",
      tags: ["frontend", "web", "react"],
    },
    {
      title: "AI Research Fellowship",
      organization: "OpenAI",
      description: "Research cutting-edge foundation models. Focus on alignment and reasoning capabilities.",
      type: "FELLOWSHIP",
      location: "San Francisco, CA",
      remote: true,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      requiredSkills: ["Python", "PyTorch", "Machine Learning"],
      experienceLevel: "ADVANCED",
      eligibility: "PhD candidates or recent graduates.",
      applicationUrl: "https://openai.com/careers",
      tags: ["ai", "research", "ml"],
    },
    {
      title: "Senior Full-stack Engineer",
      organization: "Stripe",
      description: "Full-stack role focusing on high-performance financial systems and API design.",
      type: "JOB",
      location: "New York, NY",
      remote: false,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      requiredSkills: ["Ruby", "TypeScript", "React", "PostgreSQL"],
      experienceLevel: "ADVANCED",
      eligibility: "5+ years of experience.",
      applicationUrl: "https://stripe.com/jobs",
      tags: ["fullstack", "engineering", "fintech"],
    },
    {
      title: "Global Hackathon 2026",
      organization: "Major League Hacking",
      description: "48-hour coding challenge to solve global climate issues. $50k prize pool.",
      type: "HACKATHON",
      location: "Virtual",
      remote: true,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      requiredSkills: ["Problem Solving", "Teamwork"],
      experienceLevel: "BEGINNER",
      eligibility: "Open to all developers and students.",
      applicationUrl: "https://mlh.io",
      tags: ["hackathon", "competition", "climate"],
    },
    {
      title: "Women in Tech Scholarship",
      organization: "Google",
      description: "$10,000 scholarship for aspiring female engineers and computer scientists.",
      type: "SCHOLARSHIP",
      location: "Global",
      remote: true,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 4)),
      requiredSkills: ["Leadership", "Community"],
      experienceLevel: "BEGINNER",
      eligibility: "Female students in STEM fields.",
      applicationUrl: "https://buildyourfuture.withgoogle.com",
      tags: ["scholarship", "diversity"],
    },
    {
      title: "Seed Grant for Open Source",
      organization: "GitHub",
      description: "Funding for promising open-source projects addressing developer tooling.",
      type: "GRANT",
      location: "Remote",
      remote: true,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      requiredSkills: ["Open Source", "Architecture", "Community Management"],
      experienceLevel: "INTERMEDIATE",
      eligibility: "Maintainers of active open-source projects.",
      applicationUrl: "https://github.com/grants",
      tags: ["grant", "funding", "oss"],
    },
    {
      title: "Product Designer",
      organization: "Figma",
      description: "Help design the future of collaborative interfaces.",
      type: "JOB",
      location: "London, UK",
      remote: false,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      requiredSkills: ["Figma", "UI/UX", "Prototyping"],
      experienceLevel: "INTERMEDIATE",
      eligibility: "3+ years of design experience.",
      applicationUrl: "https://figma.com/careers",
      tags: ["design", "product"],
    },
    {
      title: "Launchpad Mentorship Program",
      organization: "Launchpad Foundation",
      description: "Get paired with an industry expert for 6 months to accelerate your career.",
      type: "MENTORSHIP",
      location: "Remote",
      remote: true,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      requiredSkills: ["Curiosity", "Growth Mindset"],
      experienceLevel: "BEGINNER",
      eligibility: "Early career professionals.",
      applicationUrl: "https://launchpad.com/mentorship",
      tags: ["mentorship", "career"],
    },
    {
      title: "Y Combinator Winter 2027",
      organization: "Y Combinator",
      description: "Startup accelerator program. Receive $500k in funding and world-class mentorship.",
      type: "STARTUP_PROGRAM",
      location: "San Francisco, CA",
      remote: false,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 5)),
      requiredSkills: ["Entrepreneurship", "Product Management"],
      experienceLevel: "INTERMEDIATE",
      eligibility: "Early stage startup founders.",
      applicationUrl: "https://ycombinator.com/apply",
      tags: ["startup", "accelerator"],
    },
    {
      title: "Backend Engineering Training",
      organization: "Meta",
      description: "Intensive 12-week training program in scalable systems engineering.",
      type: "TRAINING",
      location: "Menlo Park, CA",
      remote: false,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      requiredSkills: ["C++", "Python", "Data Structures"],
      experienceLevel: "BEGINNER",
      eligibility: "Recent grads with CS degrees.",
      applicationUrl: "https://metacareers.com",
      tags: ["training", "backend"],
    },
    {
      title: "Cloud Infrastructure Engineer",
      organization: "AWS",
      description: "Design and maintain core AWS networking infrastructure.",
      type: "JOB",
      location: "Seattle, WA",
      remote: true,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      requiredSkills: ["Networking", "Linux", "Python", "AWS"],
      experienceLevel: "ADVANCED",
      eligibility: "4+ years infrastructure experience.",
      applicationUrl: "https://amazon.jobs",
      tags: ["cloud", "infrastructure"],
    },
    {
      title: "React Native Developer",
      organization: "Discord",
      description: "Build fluid, high-performance mobile experiences for millions of gamers.",
      type: "JOB",
      location: "Remote",
      remote: true,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      requiredSkills: ["React Native", "TypeScript", "iOS", "Android"],
      experienceLevel: "INTERMEDIATE",
      eligibility: "2+ years mobile dev experience.",
      applicationUrl: "https://discord.com/jobs",
      tags: ["mobile", "frontend"],
    },
    {
      title: "Cybersecurity Scholarship",
      organization: "NSA",
      description: "Full-tuition scholarship for students pursuing degrees in cybersecurity.",
      type: "SCHOLARSHIP",
      location: "United States",
      remote: false,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      requiredSkills: ["Security", "Networking"],
      experienceLevel: "BEGINNER",
      eligibility: "US Citizens enrolled in approved university programs.",
      applicationUrl: "https://nsa.gov",
      tags: ["cybersecurity", "scholarship"],
    },
    {
      title: "Data Science Intern",
      organization: "Spotify",
      description: "Analyze listening patterns and help improve recommendation algorithms.",
      type: "INTERNSHIP",
      location: "Stockholm, Sweden",
      remote: true,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      requiredSkills: ["Python", "SQL", "Statistics", "Pandas"],
      experienceLevel: "BEGINNER",
      eligibility: "Currently pursuing a degree in a quantitative field.",
      applicationUrl: "https://spotifyjobs.com",
      tags: ["data", "analytics"],
    },
    {
      title: "Developer Advocate",
      organization: "Supabase",
      description: "Create content, build demos, and engage with the developer community.",
      type: "JOB",
      location: "Remote",
      remote: true,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      requiredSkills: ["PostgreSQL", "TypeScript", "Public Speaking", "Writing"],
      experienceLevel: "INTERMEDIATE",
      eligibility: "Previous devrel or content creation experience.",
      applicationUrl: "https://supabase.com/careers",
      tags: ["devrel", "community", "database"],
    }
  ]

  console.log(`Seeding ${opportunities.length} opportunities...`)
  for (const opp of opportunities) {
    await prisma.opportunity.create({
      data: opp
    })
  }
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
