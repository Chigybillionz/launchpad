import { Check } from "lucide-react";
import { EXPERIENCE_LEVELS } from "@/lib/constants";
import type { OnboardingData } from "@/types";
import { cn } from "@/lib/utils";

interface StepExperienceProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}

export function StepExperience({ data, updateData, errors }: StepExperienceProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Experience Level</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Where are you in your career journey?
        </p>
      </div>

      <div className="space-y-3">
        {EXPERIENCE_LEVELS.map((level) => {
          const isSelected = data.experienceLevel === level.value;
          return (
            <button
              key={level.value}
              type="button"
              onClick={() => updateData({ experienceLevel: level.value })}
              className={cn(
                "relative flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border/60 bg-card hover:border-primary/30 hover:bg-primary/[0.02]"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {isSelected && <Check className="size-3.5 text-primary-foreground" />}
              </div>
              <div>
                <p className={cn("font-medium", isSelected ? "text-foreground" : "")}>
                  {level.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {level.description}
                </p>
              </div>
            </button>
          );
        })}
        {errors.experienceLevel && (
          <p className="text-center text-xs text-destructive">
            {errors.experienceLevel}
          </p>
        )}
      </div>
    </div>
  );
}
