import { CheckCircle2, XCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchResult } from "@/types/match";

interface SkillGapAnalysisProps {
  match: MatchResult;
  onGeneratePlan: () => void;
  isGenerating: boolean;
  hasGenerated: boolean;
}

export function SkillGapAnalysis({ match, onGeneratePlan, isGenerating, hasGenerated }: SkillGapAnalysisProps) {
  const { matchedSkills, missingSkills } = match;

  if (matchedSkills.length === 0 && missingSkills.length === 0) {
    return null;
  }

  const hasMissingSkills = missingSkills.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* YOU HAVE */}
        <div className="space-y-3 p-4 rounded-xl border bg-card/50">
          <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            You Have
          </h4>
          {matchedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No matching skills found.</p>
          )}
        </div>

        {/* YOU NEED */}
        <div className="space-y-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <h4 className="text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-500 uppercase flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            You Need
          </h4>
          {hasMissingSkills ? (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="border-amber-500/30 text-amber-700 dark:text-amber-400 bg-background/50">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">You meet all skill requirements!</p>
          )}
        </div>
      </div>

      {hasMissingSkills && !hasGenerated && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-medium flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Bridge the Gap
            </h4>
            <p className="text-sm text-muted-foreground">
              Get a personalized, step-by-step AI readiness plan to master the missing skills.
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
