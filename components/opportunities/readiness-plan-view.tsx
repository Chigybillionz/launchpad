"use client";

import { useState, useMemo } from "react";
import { Clock, Sparkles, Target, Lightbulb, MessageSquare, FileText } from "lucide-react";
import { ReadinessPlan, SkillToImprove } from "@/types/readiness";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReadinessPlanViewProps {
  plan: ReadinessPlan;
}

function getEffortBadgeProps(effort: SkillToImprove["estimatedEffort"]) {
  switch (effort) {
    case "HIGH":
      return { className: "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-800" };
    case "MEDIUM":
      return { className: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-800" };
    case "LOW":
      return { className: "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-800" };
  }
}

function getPriorityBadgeProps(priority: ReadinessPlan["priority"]) {
  switch (priority) {
    case "HIGH":
      return { className: "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-800" };
    case "MEDIUM":
      return { className: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-800" };
    case "LOW":
      return { className: "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-800" };
  }
}

export function ReadinessPlanView({ plan }: ReadinessPlanViewProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const totalTasks = useMemo(() => {
    return plan.days.reduce((acc, day) => acc + day.tasks.length, 0);
  }, [plan]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const progressPercentage = totalTasks > 0 ? (completedTasks.size / totalTasks) * 100 : 0;
  const priorityProps = getPriorityBadgeProps(plan.priority);

  return (
    <div className="space-y-8 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Your AI Readiness Plan
          </h3>
          <Badge variant="outline" className={priorityProps.className}>
            {plan.priority} PRIORITY
          </Badge>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {plan.summary}
        </p>
      </div>

      {/* Skills to Improve */}
      {plan.skillsToImprove.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-primary" />
            Skills to Focus On
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {plan.skillsToImprove.map((skill) => {
              const effortProps = getEffortBadgeProps(skill.estimatedEffort);
              return (
                <div key={skill.skill} className="p-4 rounded-xl border bg-card/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{skill.skill}</span>
                    <Badge variant="outline" className={effortProps.className + " text-[10px] h-5"}>
                      {skill.estimatedEffort} EFFORT
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{skill.reason}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Plan with Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4 text-primary" />
            Your Preparation Plan
          </h4>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {completedTasks.size} <span className="text-muted-foreground text-lg font-medium">/ {totalTasks}</span>
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Completed
            </div>
          </div>
        </div>

        <Progress value={progressPercentage} className="h-2" />

        <div className="space-y-4 pt-2">
          {plan.days.map((day) => (
            <Card key={day.dayNumber} className="overflow-hidden">
              <CardHeader className="bg-muted/50 py-3 px-5 border-b">
                <CardTitle className="text-base font-semibold">Step {day.dayNumber}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y">
                {day.tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`flex gap-4 p-5 transition-colors ${completedTasks.has(task.id) ? 'bg-muted/20' : ''}`}
                  >
                    <Checkbox 
                      id={task.id}
                      checked={completedTasks.has(task.id)}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1"
                    />
                    <div className="space-y-1.5 flex-1">
                      <label 
                        htmlFor={task.id} 
                        className={`text-sm font-medium leading-none cursor-pointer ${completedTasks.has(task.id) ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {task.title}
                      </label>
                      <p className={`text-sm ${completedTasks.has(task.id) ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
                        {task.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        {task.estimatedEffort}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Interview Preparation */}
      {plan.interviewPreparation.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4 text-primary" />
            Interview Preparation
          </h4>
          <div className="rounded-xl border bg-card/50 p-5 space-y-3">
            {plan.interviewPreparation.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-primary font-bold mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Application Advice */}
      {plan.applicationAdvice.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            Application Advice
          </h4>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
            {plan.applicationAdvice.map((advice, i) => (
              <div key={i} className="flex items-start gap-2 text-sm font-medium">
                <span className="text-primary mt-0.5">•</span>
                <span>{advice}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
