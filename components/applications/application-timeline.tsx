import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApplicationStatus } from "@/types/saved";
import { formatApplicationStatus } from "./application-status-badge";

interface ApplicationTimelineProps {
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
}

const successFlow: { status: ApplicationStatus; label: string }[] = [
  { status: "APPLIED", label: "Applied" },
  { status: "UNDER_REVIEW", label: "Under Review" },
  { status: "SHORTLISTED", label: "Shortlisted" },
  { status: "INTERVIEW", label: "Interview" },
  { status: "ACCEPTED", label: "Accepted" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ApplicationTimeline({ status, appliedAt, updatedAt }: ApplicationTimelineProps) {
  if (status === "REJECTED" || status === "WITHDRAWN") {
    return (
      <div className="rounded-lg border p-4">
        <p className={cn("font-semibold", status === "REJECTED" ? "text-red-700" : "text-slate-700")}>
          Application {formatApplicationStatus(status)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Last updated {formatDate(updatedAt)}</p>
      </div>
    );
  }

  const currentIndex = Math.max(0, successFlow.findIndex((step) => step.status === status));

  return (
    <div className="space-y-4">
      {successFlow.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.status} className="flex gap-3">
            <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border bg-background">
              {isComplete ? (
                <Check className="size-4 text-primary" />
              ) : (
                <Circle className={cn("size-3", isCurrent ? "fill-primary text-primary" : "text-muted-foreground")} />
              )}
            </div>
            <div>
              <p className={cn("text-sm font-semibold", isCurrent ? "text-foreground" : "text-muted-foreground")}>
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {index === 0 ? formatDate(appliedAt) : isCurrent ? "Current status" : "Pending"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
