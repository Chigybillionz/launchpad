"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SkillGapService } from "@/lib/services/skill-gaps";
import { GlobalSkillGapAnalysis, SkillPriority } from "@/types/skill-gap";
import { Target } from "lucide-react";

export function SkillsToStrengthen() {
  const [data, setData] = useState<GlobalSkillGapAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const analysis = await SkillGapService.getGlobalSkillGaps();
        setData(analysis);
      } catch (error) {
        console.error("Failed to load skill gaps:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Skills to Strengthen</CardTitle>
          <CardDescription>Analyzing opportunities to identify skill gaps...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.skills.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Skills to Strengthen</CardTitle>
          <CardDescription>Areas to focus on for your targeted roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-center border rounded-lg border-dashed bg-muted/30">
            <Target className="h-10 w-10 text-muted-foreground mb-3 opacity-20" />
            <h3 className="font-medium">No major skill gaps</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
              You have a strong skill match for most recommended opportunities!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Skills to Strengthen</CardTitle>
        <CardDescription>Top missing skills required for your targeted roles.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.skills.slice(0, 5).map((item, i) => {
          const badgeProps = getPriorityBadgeProps(item.priority);
          return (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="space-y-1">
                <p className="font-medium leading-none">{item.skill}</p>
                <p className="text-xs text-muted-foreground">
                  Required by {item.frequency} opportunit{item.frequency === 1 ? 'y' : 'ies'}
                </p>
              </div>
              <Badge variant={badgeProps.variant} className={badgeProps.className}>
                {item.priority} PRIORITY
              </Badge>
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Generate Readiness Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
