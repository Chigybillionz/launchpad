export type SkillPriority = "HIGH" | "MEDIUM" | "LOW";

export interface SkillGap {
  skill: string;
  priority: SkillPriority;
  importance: number;
}

export interface SkillGapAnalysis {
  totalRequiredSkills: number;
  matchedSkills: string[];
  missingSkills: SkillGap[];
  skillMatchPercentage: number;
  summary: string;
}

export interface GlobalSkillGap {
  skill: string;
  frequency: number;
  priority: SkillPriority;
}

export interface GlobalSkillGapAnalysis {
  skills: GlobalSkillGap[];
}
