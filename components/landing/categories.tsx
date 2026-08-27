"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  Landmark,
  DollarSign,
  Users,
  BookOpen,
} from "lucide-react";
import { Container } from "@/components/layout/container";

const categories = [
  { icon: Briefcase, label: "Jobs", count: "2,400+" },
  { icon: GraduationCap, label: "Internships", count: "1,800+" },
  { icon: Award, label: "Fellowships", count: "620+" },
  { icon: Code2, label: "Hackathons", count: "340+" },
  { icon: Landmark, label: "Scholarships", count: "950+" },
  { icon: DollarSign, label: "Grants", count: "480+" },
  { icon: Users, label: "Programs", count: "720+" },
  { icon: BookOpen, label: "Bootcamps", count: "260+" },
];

export function Categories() {
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
            Opportunity types
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Every kind of opportunity
          </h2>
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.label}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.3 },
                  },
                }}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-5 text-center transition-colors hover:border-primary/25 hover:bg-primary/[0.03]"
              >
                <Icon className="size-6 text-muted-foreground transition-colors group-hover:text-primary" />
                <span className="text-sm font-semibold">{cat.label}</span>
                <span className="text-xs text-muted-foreground">
                  {cat.count}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
