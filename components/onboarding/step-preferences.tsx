import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WORK_PREFERENCES } from "@/lib/constants";
import type { OnboardingData } from "@/types";
import { cn } from "@/lib/utils";

interface StepPreferencesProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}

export function StepPreferences({ data, updateData, errors }: StepPreferencesProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddLocation = (location: string) => {
    const trimmed = location.trim();
    if (trimmed && !data.locationPreferences.includes(trimmed)) {
      updateData({
        locationPreferences: [...data.locationPreferences, trimmed],
      });
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLocation(inputValue);
    }
  };

  const handleRemoveLocation = (locationToRemove: string) => {
    updateData({
      locationPreferences: data.locationPreferences.filter(
        (loc) => loc !== locationToRemove
      ),
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Work Preferences</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          How and where do you want to work?
        </p>
      </div>

      <div className="space-y-6">
        {/* Work Preference */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Work Style</label>
          <div className="grid grid-cols-3 gap-3">
            {WORK_PREFERENCES.map((pref) => {
              const isSelected = data.workPreference === pref.value;
              return (
                <button
                  key={pref.value}
                  type="button"
                  onClick={() => updateData({ workPreference: pref.value })}
                  className={cn(
                    "flex h-12 items-center justify-center rounded-lg border text-sm font-medium transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                      : "border-border/60 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  {pref.label}
                </button>
              );
            })}
          </div>
          {errors.workPreference && (
            <p className="text-xs text-destructive">{errors.workPreference}</p>
          )}
        </div>

        {/* Location Preferences */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Preferred Locations</label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. New York, London, Remote"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleAddLocation(inputValue)}
              disabled={!inputValue.trim()}
            >
              Add
            </Button>
          </div>

          <div className="min-h-[80px] rounded-lg border border-border/60 bg-muted/20 p-3">
            {data.locationPreferences.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No locations added yet.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.locationPreferences.map((loc) => (
                  <Badge
                    key={loc}
                    variant="secondary"
                    className="flex items-center gap-1.5 pl-2.5 pr-1 py-1"
                  >
                    {loc}
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(loc)}
                      className="flex size-4 items-center justify-center rounded-full hover:bg-muted-foreground/20"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
