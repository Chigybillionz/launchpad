"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export function FinalCta() {
  return (
    <section className="border-t border-border/60 bg-muted/20 py-20 sm:py-28">
      <Container size="sm">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to launch?
          </h2>
          <p className="mt-4 max-w-md text-base text-muted-foreground">
            Build your profile in under two minutes and discover opportunities
            matched to your skills.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/onboarding" />}>
              Get Started — It&apos;s Free
              <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
