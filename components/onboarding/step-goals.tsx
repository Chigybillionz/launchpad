import { GOALS } from "@/lib/constants";
import type { OnboardingData } from "@/types";
import { cn } from "@/lib/utils";

interface StepGoalsProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}

export function StepGoals({ data, updateData, errors }: StepGoalsProps) {
  const toggleGoal = (goal: string) => {
    if (data.goals.includes(goal)) {
      updateData({
        goals: data.goals.filter((g) => g !== goal),
      });
    } else {
      updateData({
        goals: [...data.goals, goal],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Your Goals</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What kind of opportunities are you looking for?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {GOALS.map((goal) => {
          const isSelected = data.goals.includes(goal);
          return (
            <button
              key={goal}
              type="button"
              onClick={() => toggleGoal(goal)}
              className={cn(
                "flex h-20 flex-col items-center justify-center rounded-xl border text-center transition-all",
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/60 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              <span className="text-sm font-medium">{goal}</span>
            </button>
          );
        })}
      </div>
      {errors.goals && (
        <p className="text-center text-xs text-destructive">{errors.goals}</p>
      )}
    </div>
  );
}
