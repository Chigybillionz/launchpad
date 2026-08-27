import { useState, useMemo } from "react";
import { Clock, Sparkles } from "lucide-react";
import { ReadinessPlan } from "@/types/readiness";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReadinessPlanViewProps {
  plan: ReadinessPlan;
}

export function ReadinessPlanView({ plan }: ReadinessPlanViewProps) {
  // Flatten tasks to keep track of completion by id
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

  return (
    <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Your AI Readiness Plan
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Follow this step-by-step guide to bridge your skill gap.
          </p>
        </div>
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

      <div className="space-y-4 pt-4">
        {plan.days.map((day) => (
          <Card key={day.dayNumber} className="overflow-hidden">
            <CardHeader className="bg-muted/50 py-3 px-5 border-b">
              <CardTitle className="text-base font-semibold">Day {day.dayNumber}</CardTitle>
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
  );
}
