import { PageHeader } from "@/components/layout/page-header";
import { OpportunitiesClient } from "@/components/opportunities/opportunities-client";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function GuestDiscoverPage() {
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
                These opportunities are dynamically matched to the profile you just created. To save opportunities, track your applications, and receive continuous updates, you need to create a free account.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button variant="outline" render={<Link href="/login" />}>Log In</Button>
              <Button render={<Link href="/register" />}>Create Free Account</Button>
            </div>
          </div>

          <PageHeader
            title="Your Opportunity Radar"
            description="Discover roles matched to your skills and goals."
          />

          <OpportunitiesClient />
        </div>
      </main>

      <Footer />
    </div>
  );
}
