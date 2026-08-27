import { User, Opportunity } from "@prisma/client";
import { MatchResult } from "@/types/match";
import {
  MATCH_WEIGHTS,
  normalizeString,
  getMatchLabel,
  GOAL_TO_OPPORTUNITY_TYPE_MAP,
} from "./matching.utils";

const EXP_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export const MatchingService = {
  calculateMatchScore(user: Partial<User>, opportunity: Partial<Opportunity>): MatchResult {
    const { score: skillScore, matchedSkills, missingSkills } = this.calculateSkillMatch(
      user.skills || [],
      opportunity.requiredSkills || []
    );
    const experienceScore = this.calculateExperienceMatch(
      user.experienceLevel,
      opportunity.experienceLevel
    );
    const goalScore = this.calculateGoalMatch(user.goals || [], opportunity.type);
    const locationScore = this.calculateLocationMatch(
      user.location,
      opportunity.location,
      opportunity.remote
    );
    const interestScore = this.calculateInterestMatch(
      user.interests || [],
      opportunity.tags || []
    );

    const finalScore = Math.round(
      skillScore * MATCH_WEIGHTS.skills +
      experienceScore * MATCH_WEIGHTS.experience +
      goalScore * MATCH_WEIGHTS.goals +
      locationScore * MATCH_WEIGHTS.location +
      interestScore * MATCH_WEIGHTS.interests
    );

    const breakdown = {
      skills: Math.round(skillScore),
      experience: Math.round(experienceScore),
      goals: Math.round(goalScore),
      location: Math.round(locationScore),
      interests: Math.round(interestScore),
    };

    const reasons: string[] = [];
    if (skillScore >= 90) reasons.push("You have almost all the required technical skills.");
    else if (skillScore >= 50) reasons.push("You have a good foundation of the required skills.");
    else if (skillScore < 50 && (opportunity.requiredSkills?.length || 0) > 0) reasons.push("You may need to develop more of the required skills.");

    if (experienceScore === 100) reasons.push("Your experience level perfectly matches this opportunity.");
    else if (experienceScore === 75) reasons.push("Your experience level is closely aligned with the requirements.");

    if (goalScore === 100) reasons.push("This opportunity aligns perfectly with your goals.");

    if (locationScore === 100 && opportunity.remote) reasons.push("This opportunity is remote, making it a great location match.");
    else if (locationScore === 100) reasons.push("This opportunity is based in your location.");

    if (interestScore >= 50 && (opportunity.tags?.length || 0) > 0) reasons.push("This opportunity touches on topics you are interested in.");

    return {
      score: Math.max(0, Math.min(100, finalScore)),
      label: getMatchLabel(finalScore),
      breakdown,
      matchedSkills,
      missingSkills,
      reasons,
    };
  },

  calculateSkillMatch(userSkills: string[], requiredSkills: string[]) {
    if (!requiredSkills.length) {
      return { score: 100, matchedSkills: [], missingSkills: [] };
    }
    if (!userSkills.length) {
      return { score: 0, matchedSkills: [], missingSkills: requiredSkills };
    }

    const normalizedUserSkills = new Set(userSkills.map(normalizeString));
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const reqSkill of requiredSkills) {
      if (normalizedUserSkills.has(normalizeString(reqSkill))) {
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    }

    const score = (matchedSkills.length / requiredSkills.length) * 100;

    return {
      score,
      matchedSkills,
      missingSkills,
    };
  },

  calculateExperienceMatch(userExp?: string | null, oppExp?: string | null): number {
    if (!oppExp) return 100;
    if (!userExp) return 50;

    const uIdx = EXP_LEVELS.indexOf(userExp.toUpperCase());
    const oIdx = EXP_LEVELS.indexOf(oppExp.toUpperCase());

    if (uIdx === -1 || oIdx === -1) return 50; // Fallback for unknown levels

    const diff = Math.abs(uIdx - oIdx);
    if (diff === 0) return 100;
    if (diff === 1) return 75;
    return 40;
  },

  calculateGoalMatch(userGoals: string[], oppType?: string | null): number {
    if (!oppType) return 50;
    
    const mappedGoal = GOAL_TO_OPPORTUNITY_TYPE_MAP[oppType.toUpperCase()];
    if (!mappedGoal) return 50;

    if (!userGoals.length) return 50;

    const normalizedGoals = userGoals.map(normalizeString);
    if (normalizedGoals.includes(normalizeString(mappedGoal))) {
      return 100;
    }

    return 0;
  },

  calculateLocationMatch(userLoc?: string | null, oppLoc?: string | null, remote?: boolean | null): number {
    if (remote) return 100;
    if (!oppLoc) return 50;
    if (!userLoc) return 50;

    if (normalizeString(userLoc) === normalizeString(oppLoc)) {
      return 100;
    }

    return 0;
  },

  calculateInterestMatch(userInterests: string[], opportunityTags: string[]): number {
    if (!opportunityTags.length) return 50;
    if (!userInterests.length) return 50; // If user has no interests, give neutral score instead of 0

    const normalizedInterests = new Set(userInterests.map(normalizeString));
    let matches = 0;

    for (const tag of opportunityTags) {
      if (normalizedInterests.has(normalizeString(tag))) {
        matches++;
      }
    }

    return (matches / opportunityTags.length) * 100;
  },
};
