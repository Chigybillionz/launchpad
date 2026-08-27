"use client";

import { motion } from "framer-motion";
import { Target, Zap, TrendingUp } from "lucide-react";
import { Container } from "@/components/layout/container";

const stats = [
  {
    icon: Target,
    value: "Smart Matching",
    description: "Opportunities scored against your exact skill profile",
  },
  {
    icon: Zap,
    value: "AI-Powered Plans",
    description: "Personalized readiness plans to close your skill gaps",
  },
  {
    icon: TrendingUp,
    value: "Career Clarity",
    description: "Understand where you stand and what to do next",
  },
];

export function TrustStatement() {
  return (
    <section className="border-y border-border/60 bg-muted/30 py-16 sm:py-20">
      <Container>
        <motion.div
          className="grid gap-8 sm:grid-cols-3 sm:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.value}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                className="flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <p className="text-sm font-semibold">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
