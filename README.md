# Launchpad

AI-powered opportunity discovery and career-readiness platform. Launchpad helps students and early-career professionals find their next big opportunity—whether it's an internship, hackathon, fellowship, or full-time job.

## Features

- **Personalized opportunity matching**: Get matched based on your skills, interests, and goals.
- **Opportunity Radar**: Discover opportunities that align with your profile.
- **Match explanations**: Understand why you are a good fit for specific roles.
- **Skill-gap analysis**: See exactly what you're missing for a given opportunity.
- **AI readiness plans**: Generate a custom, day-by-day plan to prepare for applications.
- **Saved opportunities**: Save roles to apply to later.
- **Application tracking**: Keep track of where you've applied and update your status (Applied, Under Review, Interview, Accepted).
- **Admin dashboard**: Comprehensive analytics, user management, and opportunity management for administrators.

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **PostgreSQL**
- **Prisma**
- **Zod**
- **AI Provider** (OpenAI)

## Setup Instructions

1. **Clone the project:**
   ```bash
   git clone <repository-url>
   cd launchpad
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```
   Ensure you provide `DATABASE_URL` and `OPENAI_API_KEY`.
   For local admin testing, you can also set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`.

4. **Configure database:**
   Ensure PostgreSQL is running and your `DATABASE_URL` is correct.

5. **Run Prisma:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   *(Note: For production, use `prisma migrate deploy` instead of `db push`)*

6. **Seed demo data:**
   ```bash
   npx prisma db seed
   ```
   This will populate the database with a variety of opportunities and a local admin user (if configured).

7. **Start the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the application!
