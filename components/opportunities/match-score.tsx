import { cn } from "@/lib/utils";

interface MatchScoreProps {
  score: number;
  className?: string;
}

export function MatchScore({ score, className }: MatchScoreProps) {
  let colorClass = "bg-muted text-muted-foreground";
  let ringClass = "ring-muted/20";
  
  if (score >= 90) {
    colorClass = "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400";
    ringClass = "ring-green-500/30";
  } else if (score >= 75) {
    colorClass = "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400";
    ringClass = "ring-amber-500/30";
  } else if (score >= 60) {
    colorClass = "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400";
    ringClass = "ring-blue-500/30";
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        colorClass,
        ringClass,
        className
      )}
    >
      {score}% Match
    </div>
  );
}
