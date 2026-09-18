import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { OpportunityDetailClient } from "@/components/opportunities/opportunity-detail-client";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const opp = await prisma.opportunity.findUnique({
    where: { id },
  });

  if (!opp) {
    return {
      title: "Opportunity | Launchpad",
      description: "Discover tech opportunities matched to your skills on Launchpad.",
    };
  }

  const title = `${opp.title} at ${opp.organization} | Launchpad`;
  const skillsText = opp.requiredSkills.slice(0, 4).join(", ");
  const description = `${opp.organization} is hiring for ${opp.title} (${opp.remote ? "Remote" : opp.location}). Required skills: ${skillsText}. Check your interactive game score & skill match on Launchpad!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Launchpad",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function GuestOpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = `/discover/opportunities/${id}`;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-primary/5 border border-primary/20 rounded-xl p-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                You are in Guest Mode
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Create a free account to save opportunities, track your applications, and get AI readiness plans.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button variant="outline" render={<Link href={`/login?redirectTo=${encodeURIComponent(destination)}`} />}>Log In</Button>
              <Button render={<Link href={`/register?redirectTo=${encodeURIComponent(destination)}`} />}>Create Free Account</Button>
            </div>
          </div>

          <PageHeader title="Opportunity Details" />
          <OpportunityDetailClient id={id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
