import { PageHeader } from "@/components/layout/page-header";
import { OpportunityDetailClient } from "@/components/opportunities/opportunity-detail-client";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default async function GuestOpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
              <Button variant="outline" render={<Link href="/login" />}>Log In</Button>
              <Button render={<Link href="/register" />}>Create Free Account</Button>
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
