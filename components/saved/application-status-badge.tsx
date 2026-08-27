import { ApplicationStatus } from "@/types/saved";
import { Badge } from "@/components/ui/badge";
import { Bookmark, FileText, Send, Calendar, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; icon: React.ReactNode; className: string }> = {
  saved: {
    label: "Saved",
    icon: <Bookmark className="w-3 h-3 mr-1" />,
    className: "bg-muted text-muted-foreground hover:bg-muted/80 border-transparent",
  },
  preparing: {
    label: "Preparing",
    icon: <FileText className="w-3 h-3 mr-1" />,
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200 border-blue-200 dark:border-blue-800",
  },
  applied: {
    label: "Applied",
    icon: <Send className="w-3 h-3 mr-1" />,
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 hover:bg-purple-200 border-purple-200 dark:border-purple-800",
  },
  interview: {
    label: "Interview",
    icon: <Calendar className="w-3 h-3 mr-1" />,
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 hover:bg-amber-200 border-amber-200 dark:border-amber-800",
  },
  accepted: {
    label: "Accepted",
    icon: <CheckCircle className="w-3 h-3 mr-1" />,
    className: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 hover:bg-green-200 border-green-200 dark:border-green-800",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle className="w-3 h-3 mr-1" />,
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
  },
};

export function ApplicationStatusBadge({ status, className }: ApplicationStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge 
      variant="outline" 
      className={cn("whitespace-nowrap transition-colors rounded-full font-medium shadow-none", config.className, className)}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}
