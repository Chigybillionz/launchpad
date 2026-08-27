import { Input } from "@/components/ui/input";
import type { OnboardingData } from "@/types";

interface StepBasicInfoProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}

export function StepBasicInfo({ data, updateData, errors }: StepBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Basic Information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Let&apos;s start with the essentials.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="name"
            placeholder="chigozie okorie"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="role" className="text-sm font-medium">
            Current Role or Title
          </label>
          <Input
            id="role"
            placeholder="e.g., Computer Science Student, Frontend Developer"
            value={data.role}
            onChange={(e) => updateData({ role: e.target.value })}
            className={errors.role ? "border-destructive" : ""}
          />
          {errors.role && (
            <p className="text-xs text-destructive">{errors.role}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="location" className="text-sm font-medium">
            Location
          </label>
          <Input
            id="location"
            placeholder="e.g., San Francisco, CA"
            value={data.location}
            onChange={(e) => updateData({ location: e.target.value })}
            className={errors.location ? "border-destructive" : ""}
          />
          {errors.location && (
            <p className="text-xs text-destructive">{errors.location}</p>
          )}
        </div>
      </div>
    </div>
  );
}
