import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { OpportunityDetailClient } from "@/components/opportunities/opportunity-detail-client";
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
    };
  }

  return {
    title: `${opp.title} at ${opp.organization} | Launchpad`,
    description: `${opp.organization} is hiring for ${opp.title} (${opp.remote ? "Remote" : opp.location}). Check your match score on Launchpad.`,
  };
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader title="Opportunity Details" />
      <OpportunityDetailClient id={id} />
    </div>
  );
}
