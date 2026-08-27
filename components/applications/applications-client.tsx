"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Calendar, Eye } from "lucide-react";
import { ApplicationsService } from "@/lib/services/applications";
import { Application, ApplicationStatus } from "@/types/saved";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationStatusBadge } from "./application-status-badge";

const filters: { label: string; value: ApplicationStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Applied", value: "APPLIED" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Interview", value: "INTERVIEW" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Rejected", value: "REJECTED" },
];

export function ApplicationsClient() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ApplicationsService.getApplications({ status: filter, limit: 20 });
      setApplications(response.items);
    } catch (err) {
      console.error(err);
      setError("Unable to load applications.");
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadApplications();
    }, 0);
    return () => clearTimeout(timeout);
  }, [loadApplications]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((item) => (
          <Button
            key={item.value}
            size="sm"
            variant={filter === item.value ? "default" : "outline"}
            onClick={() => setFilter(item.value)}
            className="rounded-full"
          >
            {item.label}
          </Button>
        ))}
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 py-12 text-center text-destructive">
          <p className="font-medium">{error}</p>
          <Button variant="outline" className="mt-4" onClick={loadApplications}>
            Try Again
          </Button>
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed bg-card/50 py-20 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
            <Briefcase className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No applications yet.</h3>
          <p className="mt-2 max-w-md text-muted-foreground">
            You haven&apos;t tracked any applications yet.
          </p>
          <Button className="mt-6" render={<Link href="/dashboard/opportunities" />}>
            Find Opportunities
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <div key={application.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div>
                    <h3 className="text-lg font-semibold">{application.opportunity?.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{application.opportunity?.organization}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      Applied {new Date(application.appliedAt).toLocaleDateString()}
                    </span>
                    <span>Last updated {new Date(application.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <ApplicationStatusBadge status={application.status} />
                  <Button variant="outline" render={<Link href={`/dashboard/applications/${application.id}`} />}>
                    <Eye className="mr-2 size-4" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filter === "REJECTED" && applications.length > 0 && (
            <p className="text-sm text-muted-foreground">Keep exploring. New opportunities may be a better fit.</p>
          )}
        </div>
      )}
    </div>
  );
}
