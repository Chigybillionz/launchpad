import { ApplicationStatus } from "@/types/saved";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bookmark, FileText, Send, Calendar, CheckCircle, XCircle } from "lucide-react";

interface StatusUpdaterProps {
  currentStatus: ApplicationStatus;
  onStatusChange: (newStatus: ApplicationStatus) => void;
  disabled?: boolean;
}

const statusOptions: { value: ApplicationStatus; label: string; icon: React.ReactNode }[] = [
  { value: "saved", label: "Saved", icon: <Bookmark className="w-4 h-4 text-muted-foreground" /> },
  { value: "preparing", label: "Preparing", icon: <FileText className="w-4 h-4 text-blue-500" /> },
  { value: "applied", label: "Applied", icon: <Send className="w-4 h-4 text-purple-500" /> },
  { value: "interview", label: "Interview", icon: <Calendar className="w-4 h-4 text-amber-500" /> },
  { value: "accepted", label: "Accepted", icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
  { value: "rejected", label: "Rejected", icon: <XCircle className="w-4 h-4 text-destructive" /> },
];

export function StatusUpdater({ currentStatus, onStatusChange, disabled }: StatusUpdaterProps) {
  const handleValueChange = (value: string | string[] | null) => {
    if (typeof value === "string") {
      onStatusChange(value as ApplicationStatus);
    }
  };

  return (
    <Select value={currentStatus} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className="w-[160px] bg-background">
        <SelectValue placeholder="Update status..." />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="cursor-pointer font-medium">
            <span className="flex items-center gap-2">
              {option.icon}
              {option.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
