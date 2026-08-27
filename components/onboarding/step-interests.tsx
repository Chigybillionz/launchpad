import { INTERESTS } from "@/lib/constants";
import type { OnboardingData } from "@/types";
import { cn } from "@/lib/utils";

interface StepInterestsProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}

export function StepInterests({ data, updateData, errors }: StepInterestsProps) {
  const toggleInterest = (interest: string) => {
    if (data.interests.includes(interest)) {
      updateData({
        interests: data.interests.filter((i) => i !== interest),
      });
    } else {
      updateData({
        interests: [...data.interests, interest],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Your Interests</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select areas you are passionate about.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {INTERESTS.map((interest) => {
          const isSelected = data.interests.includes(interest);
          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/60 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              {interest}
            </button>
          );
        })}
      </div>
      {errors.interests && (
        <p className="text-center text-xs text-destructive">
          {errors.interests}
        </p>
      )}
    </div>
  );
}
