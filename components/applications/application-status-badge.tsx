import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ApplicationStatus } from "@/types/saved";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  APPLIED: {
    label: "Applied",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  INTERVIEW: {
    label: "Interview",
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
  ACCEPTED: {
    label: "Accepted",
    className: "border-green-200 bg-green-50 text-green-700",
  },
  REJECTED: {
    label: "Rejected",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    className: "border-slate-200 bg-slate-50 text-slate-700",
  },
};

export function formatApplicationStatus(status: ApplicationStatus) {
  return statusConfig[status].label;
}

export function ApplicationStatusBadge({ status, className }: ApplicationStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn("whitespace-nowrap rounded-full font-medium shadow-none", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
