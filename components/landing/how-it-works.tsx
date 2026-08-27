"use client";

import { motion } from "framer-motion";
import { UserPlus, Compass, BarChart3, Rocket } from "lucide-react";
import { Container } from "@/components/layout/container";

const steps = [
  {
    number: "01",
    title: "Build your profile",
    description: "Add your skills, experience level, and career goals.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Discover your matches",
    description:
      "See opportunities ranked by how well they fit your profile.",
    icon: Compass,
  },
  {
    number: "03",
    title: "Close your skill gaps",
    description:
      "Get an AI-powered plan to prepare for any opportunity.",
    icon: BarChart3,
  },
  {
    number: "04",
    title: "Take your next step",
    description: "Apply with confidence knowing you're ready.",
    icon: Rocket,
  },
];

export function HowItWorks() {
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
          <p className="mb-2 text-sm font-medium text-primary">How it works</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Four steps to launch
          </h2>
        </motion.div>

        <motion.div
          className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Connector line (desktop only) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[2.75rem] hidden h-px bg-border/60 lg:block"
          />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45 },
                  },
                }}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Step number dot */}
                <div className="relative z-10 mb-5 flex size-14 items-center justify-center rounded-2xl border border-border/80 bg-card shadow-sm transition-colors group-hover:border-primary/30 group-hover:bg-primary/5">
                  <Icon className="size-6 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>

                <span className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
                  {step.number}
                </span>
                <h3 className="mb-1 text-base font-semibold">{step.title}</h3>
                <p className="max-w-[220px] text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
