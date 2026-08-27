"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";
import { ApplicationsService } from "@/lib/services/applications";
import { Application, ApplicationStatus } from "@/types/saved";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationStatusBadge } from "./application-status-badge";
import { ApplicationTimeline } from "./application-timeline";
import { StatusUpdater } from "./status-updater";

interface ApplicationDetailClientProps {
  id: string;
}

export function ApplicationDetailClient({ id }: ApplicationDetailClientProps) {
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadApplication = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await ApplicationsService.getApplication(id);
      setApplication(result);
    } catch (err) {
      console.error(err);
      setError("Unable to load application.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadApplication();
    }, 0);
    return () => clearTimeout(timeout);
  }, [loadApplication]);

  const handleStatusChange = async (status: ApplicationStatus) => {
    if (!application || status === application.status) return;

    try {
      setIsUpdating(true);
      setMessage("Updating status...");
      const updated = await ApplicationsService.updateStatus(application.id, status);
      setApplication(updated);
      setMessage("Status updated.");
    } catch (err) {
      console.error(err);
      setMessage("Unable to update application status.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 py-12 text-center text-destructive">
        <p className="font-medium">{error || "Application not found."}</p>
        <Button variant="outline" className="mt-4" render={<Link href="/dashboard/applications" />}>
          Back to Applications
        </Button>
      </div>
    );
  }

  const opportunity = application.opportunity;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" render={<Link href="/dashboard/applications" />}>
        <ArrowLeft className="mr-2 size-4" />
        Back
      </Button>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <ApplicationStatusBadge status={application.status} />
            <div>
              <h1 className="text-2xl font-bold">{opportunity?.title}</h1>
              <p className="text-muted-foreground">{opportunity?.organization}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="size-4" />
                Applied {new Date(application.appliedAt).toLocaleDateString()}
              </span>
              <span>Last updated {new Date(application.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {opportunity && (
              <Button variant="outline" render={<Link href={`/dashboard/opportunities/${opportunity.id}`} />}>
                View Opportunity
                <ExternalLink className="ml-2 size-4" />
              </Button>
            )}
            <StatusUpdater currentStatus={application.status} onStatusChange={handleStatusChange} disabled={isUpdating} />
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Application Progress</h2>
        <ApplicationTimeline status={application.status} appliedAt={application.appliedAt} updatedAt={application.updatedAt} />
      </div>

      {application.notes && (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-2 text-lg font-semibold">Notes</h2>
          <p className="text-muted-foreground">{application.notes}</p>
        </div>
      )}
    </div>
  );
}
