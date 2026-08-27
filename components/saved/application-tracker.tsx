import { ApplicationStatus } from "@/types/saved";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ApplicationTrackerProps {
  currentStatus: ApplicationStatus;
}

const PILELINE_STAGES: { status: ApplicationStatus; label: string }[] = [
  { status: "saved", label: "Saved" },
  { status: "preparing", label: "Preparing" },
  { status: "applied", label: "Applied" },
  { status: "interview", label: "Interview" },
  { status: "accepted", label: "Accepted" },
];

export function ApplicationTracker({ currentStatus }: ApplicationTrackerProps) {
  if (currentStatus === "rejected") {
    return (
      <div className="w-full flex items-center justify-center py-4 bg-destructive/5 rounded-lg">
        <span className="text-sm font-medium text-destructive">
          Application Rejected
        </span>
      </div>
    );
  }

  const currentIndex = PILELINE_STAGES.findIndex(s => s.status === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full py-2 overflow-x-auto pb-4 hide-scrollbar">
      <div className="min-w-[400px] flex items-start justify-between w-full relative">
        {/* Background Track */}
        <div className="absolute left-[10%] right-[10%] top-3.5 h-[2px] bg-muted z-0" />
        
        {/* Active Track */}
        <div 
          className="absolute left-[10%] top-3.5 h-[2px] bg-primary transition-all duration-500 ease-in-out z-0"
          style={{ width: `${(activeIndex / (PILELINE_STAGES.length - 1)) * 80}%` }}
        />

        {PILELINE_STAGES.map((stage, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <div key={stage.status} className="relative z-10 flex flex-col items-center gap-2 flex-1">
              <div 
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 shadow-sm",
                  isCompleted 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : isActive 
                      ? "bg-background border-primary text-primary ring-4 ring-primary/10" 
                      : "bg-background border-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span 
                className={cn(
                  "text-[11px] sm:text-xs font-semibold text-center transition-colors duration-300 uppercase tracking-wider",
                  isCompleted || isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
