import { MatchResult } from "@/types/match";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface MatchAnalysisCardProps {
  match: MatchResult;
}

export function MatchAnalysisCard({ match }: MatchAnalysisCardProps) {
  const { score, label, reasons, breakdown } = match;

  let colorClass = "text-muted-foreground";
  if (score >= 90) colorClass = "text-green-500 dark:text-green-400";
  else if (score >= 75) colorClass = "text-amber-500 dark:text-amber-400";
  else if (score >= 60) colorClass = "text-blue-500 dark:text-blue-400";

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Match Analysis</CardTitle>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold ${colorClass}`}>{score}%</span>
          <span className="text-lg font-medium text-muted-foreground">{label}</span>
        </div>
        {reasons && reasons.length > 0 && (
          <div className="mt-4 space-y-2">
            {reasons.map((reason, i) => (
              <CardDescription key={i} className="text-sm text-foreground font-medium italic">
                &ldquo;{reason}&rdquo;
              </CardDescription>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Skills Match</span>
            <span className="font-medium">{breakdown?.skills || 0}%</span>
          </div>
          <Progress value={breakdown?.skills || 0} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Experience Match</span>
            <span className="font-medium">{breakdown?.experience || 0}%</span>
          </div>
          <Progress value={breakdown?.experience || 0} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Location Match</span>
            <span className="font-medium">{breakdown?.location || 0}%</span>
          </div>
          <Progress value={breakdown?.location || 0} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Goal Match</span>
            <span className="font-medium">{breakdown?.goals || 0}%</span>
          </div>
          <Progress value={breakdown?.goals || 0} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Interest Match</span>
            <span className="font-medium">{breakdown?.interests || 0}%</span>
          </div>
          <Progress value={breakdown?.interests || 0} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
