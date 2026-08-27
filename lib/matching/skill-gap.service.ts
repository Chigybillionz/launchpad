import { User, Opportunity } from "@prisma/client";
import { SkillGap, SkillGapAnalysis, GlobalSkillGap, GlobalSkillGapAnalysis, SkillPriority } from "@/types/skill-gap";
import { MatchingService } from "./matching.service";

export const SkillGapService = {
  getImportanceScore(priority: SkillPriority): number {
    switch (priority) {
      case "HIGH": return 90;
      case "MEDIUM": return 65;
      case "LOW": return 35;
    }
  },

  calculateSkillPriority(index: number, totalMissing: number, totalRequired: number): SkillPriority {
    if (totalRequired <= 3) {
      return "HIGH";
    } else if (totalRequired <= 6) {
      if (index < 2) return "HIGH";
      return "MEDIUM";
    } else {
      if (index < 3) return "HIGH";
      if (index < 6) return "MEDIUM";
      return "LOW";
    }
  },

  getSkillGapSummary(matched: number, required: number): string {
    if (required === 0) {
      return "No specific skills were listed for this opportunity.";
    }
    if (matched === required) {
      return "You currently have all the required skills for this opportunity.";
    }

    const gaps = required - matched;
    if (matched === 0) {
      return `You are missing all ${required} required skills. Consider strengthening the highlighted skills before applying.`;
    }
    
    // Some matched
    if (matched < required / 2) {
       return `You currently match ${matched} of the ${required} required skills. Consider strengthening the highlighted skills before applying.`;
    }

    return `You currently match ${matched} of the ${required} required skills and have ${gaps} skill gap${gaps === 1 ? '' : 's'} to address.`;
  },

  analyzeSkillGap(userSkills: string[], requiredSkills: string[]): SkillGapAnalysis {
    if (!userSkills.length && !requiredSkills.length) {
      return {
        totalRequiredSkills: 0,
        matchedSkills: [],
        missingSkills: [],
        skillMatchPercentage: 100,
        summary: this.getSkillGapSummary(0, 0),
      };
    }

    if (!userSkills.length && requiredSkills.length > 0) {
      const missingSkills: SkillGap[] = requiredSkills.map((skill, index) => {
        const priority = this.calculateSkillPriority(index, requiredSkills.length, requiredSkills.length);
        return {
          skill,
          priority,
          importance: this.getImportanceScore(priority),
        };
      });

      return {
        totalRequiredSkills: requiredSkills.length,
        matchedSkills: [],
        missingSkills,
        skillMatchPercentage: 0,
        summary: "Add your skills to your profile to see your skill gaps.", // Custom summary based on empty user profile
      };
    }

    const matchResult = MatchingService.calculateSkillMatch(userSkills, requiredSkills);
    const { matchedSkills, missingSkills: rawMissingSkills } = matchResult;

    const totalRequired = requiredSkills.length;
    const matchPercentage = totalRequired > 0 ? Math.round((matchedSkills.length / totalRequired) * 100) : 100;

    const missingSkills: SkillGap[] = rawMissingSkills.map((skill, index) => {
      const priority = this.calculateSkillPriority(index, rawMissingSkills.length, totalRequired);
      return {
        skill,
        priority,
        importance: this.getImportanceScore(priority),
      };
    });

    return {
      totalRequiredSkills: totalRequired,
      matchedSkills,
      missingSkills,
      skillMatchPercentage: matchPercentage,
      summary: this.getSkillGapSummary(matchedSkills.length, totalRequired),
    };
  },

  getSkillGapForOpportunity(user: Partial<User>, opportunity: Partial<Opportunity>): SkillGapAnalysis {
    return this.analyzeSkillGap(user.skills || [], opportunity.requiredSkills || []);
  },

  getSkillGapsAcrossOpportunities(user: Partial<User>, opportunities: Partial<Opportunity>[]): GlobalSkillGapAnalysis {
    const userSkills = user.skills || [];
    const skillFrequencies = new Map<string, number>();

    for (const opportunity of opportunities) {
      if (!opportunity.requiredSkills || opportunity.requiredSkills.length === 0) continue;
      
      const gapAnalysis = this.analyzeSkillGap(userSkills, opportunity.requiredSkills);
      for (const gap of gapAnalysis.missingSkills) {
        // Use the original required skill formatting that was flagged as missing
        const count = skillFrequencies.get(gap.skill) || 0;
        skillFrequencies.set(gap.skill, count + 1);
      }
    }

    const globalGaps: GlobalSkillGap[] = Array.from(skillFrequencies.entries()).map(([skill, frequency]) => {
      let priority: SkillPriority = "LOW";
      if (frequency >= 5) priority = "HIGH";
      else if (frequency >= 2) priority = "MEDIUM";

      return {
        skill,
        frequency,
        priority,
      };
    });

    // Sort by priority, then frequency
    const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    globalGaps.sort((a, b) => {
      if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (a.frequency !== b.frequency) {
         return b.frequency - a.frequency;
      }
      return 0; // maintain original insertion order if everything is equal
    });

    return {
      skills: globalGaps
    };
  }
};
