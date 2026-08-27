import { CheckCircle2, XCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkillGapAnalysis as SkillGapAnalysisType, SkillPriority } from "@/types/skill-gap";
import { useEffect, useState } from "react";
import { SkillGapService } from "@/lib/services/skill-gaps";
import { Skeleton } from "@/components/ui/skeleton";

interface SkillGapAnalysisProps {
  opportunityId: string;
  onGeneratePlan: () => void;
  isGenerating: boolean;
  hasGenerated: boolean;
}

export function SkillGapAnalysis({ opportunityId, onGeneratePlan, isGenerating, hasGenerated }: SkillGapAnalysisProps) {
  const [analysis, setAnalysis] = useState<SkillGapAnalysisType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await SkillGapService.getOpportunitySkillGap(opportunityId);
        setAnalysis(data);
      } catch (error) {
        console.error("Failed to load skill gap analysis", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [opportunityId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const { matchedSkills, missingSkills, skillMatchPercentage, summary } = analysis;
  const hasMissingSkills = missingSkills.length > 0;

  const getPriorityBadgeProps = (priority: SkillPriority) => {
    switch (priority) {
      case "HIGH":
        return { variant: "destructive" as const, className: "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-800" };
      case "MEDIUM":
        return { variant: "outline" as const, className: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-800" };
      case "LOW":
        return { variant: "secondary" as const, className: "" };
    }
  };

  return (
    <div className="space-y-6" id="skill-gap-section">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">{skillMatchPercentage}% of required skills matched</span>
        <span className="font-medium text-primary">{summary}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* YOU HAVE */}
        <div className="space-y-3 p-4 rounded-xl border bg-card/50">
          <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Matched Skills
          </h4>
          {matchedSkills.length > 0 ? (
            <ul className="space-y-2">
              {matchedSkills.map((skill) => (
                <li key={skill} className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-green-500">✓</span> {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">No matching skills found.</p>
          )}
        </div>

        {/* YOU NEED */}
        <div className="space-y-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <h4 className="text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-500 uppercase flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Skills to Strengthen
          </h4>
          {hasMissingSkills ? (
            <ul className="space-y-3">
              {missingSkills.map((gap) => {
                const badgeProps = getPriorityBadgeProps(gap.priority);
                return (
                  <li key={gap.skill} className="flex items-center justify-between gap-2 text-sm font-medium">
                    <div className="flex flex-col">
                      <span>{gap.skill}</span>
                    </div>
                    <Badge variant={badgeProps.variant} className={badgeProps.className + " text-[10px] h-5"}>
                      {gap.priority}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">You meet all skill requirements!</p>
          )}
        </div>
      </div>

      {!hasGenerated && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-medium flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {hasMissingSkills ? "Bridge the Gap" : "Strengthen Your Application"}
            </h4>
            <p className="text-sm text-muted-foreground">
              {hasMissingSkills
                ? "Get a personalized, step-by-step AI readiness plan to master the missing skills."
                : "Get personalized interview prep and application advice to stand out."}
            </p>
          </div>
          <Button 
            onClick={onGeneratePlan} 
            disabled={isGenerating}
            className="w-full sm:w-auto shrink-0 shadow-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate Readiness Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
