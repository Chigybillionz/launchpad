"use client";

import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApplicationStatus } from "@/types/saved";
import { formatApplicationStatus } from "./application-status-badge";

interface StatusUpdaterProps {
  currentStatus: ApplicationStatus;
  onStatusChange: (status: ApplicationStatus) => void;
  disabled?: boolean;
}

const statuses: ApplicationStatus[] = [
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
];

export function StatusUpdater({ currentStatus, onStatusChange, disabled }: StatusUpdaterProps) {
  return (
    <div className="flex items-center gap-2">
      {disabled && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
      <Select
        value={currentStatus}
        onValueChange={(value) => {
          if (typeof value === "string") onStatusChange(value as ApplicationStatus);
        }}
        disabled={disabled}
      >
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Update status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {formatApplicationStatus(status)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
