import { MatchExplanation } from "@/types/match";
import { CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MatchExplanationViewProps {
  explanation: MatchExplanation | null;
  isLoading: boolean;
}

export function MatchExplanationView({ explanation, isLoading }: MatchExplanationViewProps) {
  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Why This Matches</h2>
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </section>
    );
  }

  if (!explanation) return null;

  return (
    <section className="space-y-6">
      <div className="space-y-2 border-b pb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Why You Match
        </h2>
        <p className="text-muted-foreground">
          {explanation.summary}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Strengths */}
        {explanation.strengths.length > 0 && (
          <div className="space-y-3 p-4 rounded-xl border bg-card/50">
            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Your Strengths
            </h4>
            <ul className="space-y-2">
              {explanation.strengths.map((strength, i) => (
                <li key={i} className="text-sm font-medium flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {explanation.recommendations.length > 0 && (
          <div className="space-y-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
            <h4 className="text-xs font-semibold tracking-wider text-primary uppercase flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Recommended Next Steps
            </h4>
            <ul className="space-y-2">
              {explanation.recommendations.map((rec, i) => (
                <li key={i} className="text-sm font-medium flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Detailed Reasons */}
      {explanation.reasons.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Detailed Breakdown</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {explanation.reasons.map((reason, i) => (
              <div key={i} className="flex flex-col gap-1 p-3 rounded-lg border bg-background/50">
                <span className="font-semibold text-sm capitalize">{reason.title}</span>
                <span className="text-xs text-muted-foreground">{reason.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
