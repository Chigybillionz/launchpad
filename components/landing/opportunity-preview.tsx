"use client";

import { motion } from "framer-motion";
import {
  Bookmark,
  MapPin,
  Clock,
  Building2,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

interface PreviewCard {
  title: string;
  organization: string;
  type: string;
  location: string;
  remote: boolean;
  deadline: string;
  score: number;
  tags: string[];
}

const previewOpportunities: PreviewCard[] = [
  {
    title: "Frontend Developer Internship",
    organization: "TechVentures Inc.",
    type: "Internship",
    location: "San Francisco, CA",
    remote: true,
    deadline: "Mar 15, 2026",
    score: 92,
    tags: ["React", "TypeScript", "CSS"],
  },
  {
    title: "AI Innovation Hackathon",
    organization: "Google Developer Group",
    type: "Hackathon",
    location: "Virtual",
    remote: true,
    deadline: "Apr 1, 2026",
    score: 88,
    tags: ["Python", "Machine Learning", "APIs"],
  },
  {
    title: "Junior Software Developer",
    organization: "Stripe",
    type: "Job",
    location: "New York, NY",
    remote: false,
    deadline: "Mar 30, 2026",
    score: 84,
    tags: ["JavaScript", "Node.js", "PostgreSQL"],
  },
];

function scoreColor(score: number) {
  if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 75) return "text-blue-600 dark:text-blue-400";
  return "text-amber-600 dark:text-amber-400";
}

function scoreBg(score: number) {
  if (score >= 90) return "bg-emerald-500/10";
  if (score >= 75) return "bg-blue-500/10";
  return "bg-amber-500/10";
}

export function OpportunityPreview() {
  return (
    <section className="border-y border-border/60 bg-muted/20 py-20 sm:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="mb-14 text-center"
        >
          <p className="mb-2 text-sm font-medium text-primary">
            Opportunity Radar
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Opportunities ranked for you
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Every opportunity is scored against your profile so you can focus on
            what matters.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {previewOpportunities.map((opp) => (
            <motion.div
              key={opp.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45 },
                },
              }}
              className="group relative flex flex-col rounded-xl border border-border/60 bg-card p-5 transition-shadow hover:shadow-md"
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between">
                <Badge variant="secondary" className="text-[11px]">
                  {opp.type}
                </Badge>
                <button
                  aria-label="Bookmark opportunity"
                  className="text-muted-foreground/50 transition-colors hover:text-primary"
                >
                  <Bookmark className="size-4" />
                </button>
              </div>

              {/* Title */}
              <h3 className="mb-1 text-sm font-semibold leading-snug">
                {opp.title}
              </h3>

              {/* Org */}
              <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Building2 className="size-3" />
                {opp.organization}
              </div>

              {/* Match score */}
              <div
                className={`mb-4 flex items-center gap-2 rounded-lg px-3 py-2 ${scoreBg(opp.score)}`}
              >
                <span
                  className={`text-lg font-bold tabular-nums ${scoreColor(opp.score)}`}
                >
                  {opp.score}%
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Match
                </span>
              </div>

              {/* Meta */}
              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {opp.remote ? "Remote" : opp.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {opp.deadline}
                </span>
              </div>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {opp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
