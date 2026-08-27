import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SKILL_CATEGORIES } from "@/lib/constants";
import type { OnboardingData } from "@/types";

interface StepSkillsProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}

export function StepSkills({ data, updateData, errors }: StepSkillsProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      updateData({ skills: [...data.skills, trimmed] });
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill(inputValue);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    updateData({
      skills: data.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  // Flatten all predefined skills for suggestions (limited)
  const suggestedSkills = [
    ...SKILL_CATEGORIES.frontend.slice(0, 5),
    ...SKILL_CATEGORIES.backend.slice(0, 5),
  ].filter((s) => !data.skills.includes(s));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Your Skills</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What tools and technologies do you know?
        </p>
      </div>

      <div className="space-y-4">
        {/* Input */}
        <div>
          <div className="relative flex items-center gap-2">
            <Input
              placeholder="Type a skill and press Enter..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className={errors.skills ? "border-destructive" : ""}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleAddSkill(inputValue)}
              disabled={!inputValue.trim()}
            >
              Add
            </Button>
          </div>
          {errors.skills && (
            <p className="mt-1 text-xs text-destructive">{errors.skills}</p>
          )}
        </div>

        {/* Selected Skills */}
        <div className="min-h-[100px] rounded-xl border border-border/60 bg-muted/20 p-4">
          {data.skills.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No skills added yet.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 text-sm font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="flex size-4 items-center justify-center rounded-full hover:bg-muted-foreground/20"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Suggestions */}
        {suggestedSkills.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  className="flex items-center gap-1 rounded-full border border-border/60 bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Plus className="size-3" />
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
