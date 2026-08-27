"use client";

import { motion } from "framer-motion";
import {
  Crosshair,
  Brain,
  Route,
  Shield,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/layout/container";

const benefits = [
  {
    icon: Crosshair,
    title: "Precision matching",
    description:
      "Every opportunity is scored across five dimensions — skills, experience, location, interests, and goals.",
  },
  {
    icon: Brain,
    title: "AI-powered readiness",
    description:
      "Get a personalized preparation plan for any opportunity, built from your exact skill gaps.",
  },
  {
    icon: Route,
    title: "Clear next steps",
    description:
      "Stop guessing what to learn. Launchpad shows you the exact path from where you are to where you want to be.",
  },
  {
    icon: Shield,
    title: "Apply with confidence",
    description:
      "Understand your fit before you apply. No more wasted applications on mismatched roles.",
  },
  {
    icon: BarChart3,
    title: "Track your progress",
    description:
      "Monitor saved opportunities, application status, and readiness scores in one dashboard.",
  },
  {
    icon: Sparkles,
    title: "Grows with you",
    description:
      "As your skills improve, your matches evolve. Launchpad keeps up with your growth.",
  },
];

export function Benefits() {
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
            Why Launchpad
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for real outcomes
          </h2>
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-4xl gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4 },
                  },
                }}
                className="group"
              >
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg border border-border/60 bg-card transition-colors group-hover:border-primary/25 group-hover:bg-primary/5">
                  <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <h3 className="mb-1 text-sm font-semibold">{b.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {b.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
