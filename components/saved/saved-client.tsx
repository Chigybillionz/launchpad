"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PopulatedSavedOpportunity, SavedService } from "@/lib/services/saved";
import { ApplicationStatus } from "@/types/saved";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { ApplicationTracker } from "./application-tracker";
import { StatusUpdater } from "./status-updater";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Saved", value: "saved" },
  { label: "Preparing", value: "preparing" },
  { label: "Applied", value: "applied" },
  { label: "Interview", value: "interview" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

export function SavedClient() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [data, setData] = useState<PopulatedSavedOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await SavedService.getSavedOpportunities(activeFilter);
      setData(items);
    } catch (err) {
      console.error(err);
      setError("Failed to load saved opportunities.");
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    // We delay slightly to avoid React strict mode / synchronous setState warnings in this setup
    const timeout = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timeout);
  }, [loadData]);

  const handleStatusChange = async (opportunityId: string, newStatus: ApplicationStatus) => {
    try {
      await SavedService.updateStatus(opportunityId, newStatus);
      // Optimistic update
      setData((prev) => 
        prev.map(item => 
          item.opportunity.id === opportunityId 
            ? { ...item, savedRecord: { ...item.savedRecord, status: newStatus } }
            : item
        ).filter(item => activeFilter === "all" || item.savedRecord.status === activeFilter)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {FILTERS.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.value)}
            className="rounded-full shadow-none"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-[280px] w-full rounded-xl" />
          <Skeleton className="h-[280px] w-full rounded-xl" />
        </div>
      ) : error ? (
        <div className="py-12 text-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive">
          <p className="font-medium">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => loadData()}>
            Try Again
          </Button>
        </div>
      ) : data.length === 0 ? (
        <div className="py-24 text-center rounded-xl border border-dashed bg-card/50 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <BookmarkIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No saved opportunities yet.</h3>
          <p className="text-muted-foreground mb-6">
            Keep track of roles you&apos;re interested in by saving them from the Opportunity Radar.
          </p>
          <Button onClick={() => router.push("/dashboard/opportunities")}>
            Explore Opportunities
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {data.map(({ opportunity, savedRecord }) => (
            <div key={opportunity.id} className="relative rounded-xl border bg-card p-1 shadow-sm">
              <OpportunityCard opportunity={opportunity} />
              
              <div className="p-4 pt-2 md:p-6 md:pt-0 bg-card rounded-b-xl border-t mt-[-1px]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1 w-full max-w-2xl">
                    <ApplicationTracker currentStatus={savedRecord.status} />
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm text-muted-foreground font-medium hidden md:inline-block">Update Status:</span>
                    <StatusUpdater 
                      currentStatus={savedRecord.status} 
                      onStatusChange={(newStatus) => handleStatusChange(opportunity.id, newStatus)} 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
