"use client";

import { useEffect, useState, useCallback } from "react";
import { PopulatedSavedOpportunity, SavedService } from "@/lib/services/saved";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkIcon, Calendar, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";

export function SavedClient() {
  const [data, setData] = useState<PopulatedSavedOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await SavedService.getSavedOpportunities(1, 20);
      setData(response.items);
    } catch (err) {
      console.error(err);
      setError("Failed to load saved opportunities.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timeout);
  }, [loadData]);

  const handleRemove = async (opportunityId: string) => {
    try {
      setRemovingId(opportunityId);
      await SavedService.removeSaved(opportunityId);
      setData((prev) => prev.filter((item) => item.opportunity.id !== opportunityId));
    } catch (err) {
      console.error(err);
      setError("Unable to remove saved opportunity.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
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
          <Button render={<Link href="/dashboard/opportunities" />}>
            Explore Opportunities
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {data.map(({ opportunity, createdAt }) => (
            <div key={opportunity.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">{opportunity.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{opportunity.organization}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="capitalize">{opportunity.type}</Badge>
                    <Badge variant="outline">{opportunity.remote ? "Remote" : opportunity.location}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      Saved {new Date(createdAt).toLocaleDateString()}
                    </span>
                    <span>Deadline {new Date(opportunity.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                  <Button variant="outline" render={<Link href={`/dashboard/opportunities/${opportunity.id}`} />}>
                    View Opportunity
                    <ExternalLink className="ml-2 size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleRemove(opportunity.id)}
                    disabled={removingId === opportunity.id}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 size-4" />
                    {removingId === opportunity.id ? "Removing..." : "Remove Saved"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
