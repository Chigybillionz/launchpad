import { Badge } from "@/components/ui/badge";
import { EXPERIENCE_LEVELS } from "@/lib/constants";
import type { OnboardingData } from "@/types";

interface StepSummaryProps {
  data: OnboardingData;
}

export function StepSummary({ data }: StepSummaryProps) {
  const experienceLabel =
    EXPERIENCE_LEVELS.find((l) => l.value === data.experienceLevel)?.label ||
    "Not specified";

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Review Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Make sure everything looks good before we build your radar.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        {/* Header */}
        <div className="border-b border-border/60 bg-muted/30 p-6">
          <h3 className="text-xl font-bold">{data.name}</h3>
          <p className="text-sm font-medium text-primary">{data.role}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span>{data.location}</span>
            <span>•</span>
            <span>{experienceLabel}</span>
            <span>•</span>
            <span className="capitalize">{data.workPreference}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Skills */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Interests */}
          {data.interests.length > 0 && (
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.interests.map((interest) => (
                  <Badge key={interest} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Goals */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Goals
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.goals.map((goal) => (
                <Badge key={goal} className="bg-primary/10 text-primary hover:bg-primary/20">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>

          {/* Locations */}
          {data.locationPreferences.length > 0 && (
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Preferred Locations
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.locationPreferences.map((loc) => (
                  <Badge key={loc} variant="outline" className="text-muted-foreground">
                    {loc}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
