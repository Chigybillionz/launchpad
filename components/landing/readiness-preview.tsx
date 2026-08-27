"use client";

import { motion } from "framer-motion";
import { Check, X, Lightbulb, BookOpen } from "lucide-react";
import { Container } from "@/components/layout/container";

const userSkills = ["React", "JavaScript", "Git"];
const missingSkills = ["TypeScript", "Testing"];

const planSteps = [
  "Complete a TypeScript fundamentals course (2 weeks)",
  "Build a small project using TypeScript + React",
  "Learn Jest and React Testing Library basics",
  "Write tests for your existing projects",
];

export function ReadinessPreview() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="mb-14 text-center"
        >
          <p className="mb-2 text-sm font-medium text-primary">
            AI Readiness Engine
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Know exactly what to learn
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            See your skill gaps and get a step-by-step plan to close them.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-3xl gap-6 lg:grid-cols-2">
          {/* Skill gap analysis */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-xl border border-border/60 bg-card p-6"
          >
            <h3 className="mb-5 text-sm font-semibold">Skill Analysis</h3>

            {/* Matched */}
            <div className="mb-5">
              <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                You have
              </p>
              <div className="space-y-2">
                {userSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2.5 rounded-lg bg-emerald-500/8 px-3 py-2 text-sm"
                  >
                    <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500/15">
                      <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div>
              <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Missing
              </p>
              <div className="space-y-2">
                {missingSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2.5 rounded-lg bg-amber-500/8 px-3 py-2 text-sm"
                  >
                    <div className="flex size-5 items-center justify-center rounded-full bg-amber-500/15">
                      <X className="size-3 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Readiness plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="rounded-xl border border-border/60 bg-card p-6"
          >
            <div className="mb-5 flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                <Lightbulb className="size-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold">Your Readiness Plan</h3>
            </div>

            <p className="mb-5 text-sm text-muted-foreground">
              Based on your profile and the opportunity requirements, here&apos;s
              your personalized preparation plan:
            </p>

            <div className="space-y-3">
              {planSteps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border/80 bg-muted text-[10px] font-bold text-muted-foreground">
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2.5 text-xs text-primary">
              <BookOpen className="size-3.5" />
              <span className="font-medium">
                Estimated preparation time: 4–6 weeks
              </span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
