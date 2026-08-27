import { MatchResult, MatchExplanation, MatchReason } from "@/types/match";
import { Opportunity } from "@prisma/client";

export const ExplanationService = {
  generateExplanation(match: MatchResult, opportunity: Partial<Opportunity>): MatchExplanation {
    const { score, breakdown, missingSkills } = match;

    const headline = match.label;
    const summary = this.getSummary(score);
    const strengths = this.getStrengths(breakdown, opportunity);
    const gaps = this.getGaps(missingSkills);
    const recommendations = this.getRecommendations(missingSkills);
    const reasons = this.getReasons(breakdown, missingSkills, opportunity);

    return {
      headline,
      summary,
      strengths,
      gaps,
      recommendations,
      reasons,
    };
  },

  getSummary(score: number): string {
    if (score >= 75) {
      return "This opportunity aligns strongly with your current skills and goals.";
    }
    if (score >= 60) {
      return "This opportunity has good potential, but there are a few areas you may want to strengthen.";
    }
    return "This opportunity may require additional skills or experience before you apply.";
  },

  getStrengths(breakdown: MatchResult["breakdown"], opportunity: Partial<Opportunity>): string[] {
    const strengths: string[] = [];

    if (breakdown.skills === 100) {
      strengths.push("You have all the required technical skills.");
    } else if (breakdown.skills >= 90) {
      strengths.push("You have most or all of the required skills.");
    }

    if (breakdown.experience === 100) {
      strengths.push("Your experience level matches the opportunity.");
    }

    if (breakdown.goals >= 80) {
      strengths.push("This opportunity aligns with your career goals.");
    }

    if (breakdown.location === 100) {
      if (opportunity.remote) {
        strengths.push("This opportunity is remote, so location is not a barrier.");
      } else {
        strengths.push("The opportunity matches your location.");
      }
    }

    if (breakdown.interests >= 80) {
      strengths.push("This opportunity aligns well with your interests.");
    }

    return strengths;
  },

  getGaps(missingSkills: string[]): string[] {
    if (missingSkills.length === 0) {
      return ["No major skill gaps identified."];
    }
    
    return missingSkills.map(skill => `${skill} is listed as a required skill you don't currently have.`);
  },

  getRecommendations(missingSkills: string[]): string[] {
    if (missingSkills.length === 0) {
      return ["You are well-prepared to apply."];
    }

    if (missingSkills.length === 1) {
      return [`Review ${missingSkills[0]} fundamentals before applying.`];
    }

    return [
      `Focus on the listed skill gaps before applying.`,
      `Review fundamentals in ${missingSkills.slice(0, 2).join(" and ")}.`
    ];
  },

  getReasons(breakdown: MatchResult["breakdown"], missingSkills: string[], opportunity: Partial<Opportunity>): MatchReason[] {
    const reasons: MatchReason[] = [];

    if (breakdown.skills === 100) {
      reasons.push({
        category: "skills",
        title: "Strong skill alignment",
        description: "You match all of the required technical skills."
      });
    } else if (breakdown.skills >= 80) {
      reasons.push({
        category: "skills",
        title: "Good skill alignment",
        description: "You match most of the required technical skills."
      });
    }

    if (breakdown.experience === 100) {
      reasons.push({
        category: "experience",
        title: "Experience level fits",
        description: "Your experience level matches this opportunity."
      });
    }

    if (breakdown.goals >= 80) {
      reasons.push({
        category: "goals",
        title: "Matches your goals",
        description: "This opportunity aligns with your career goals."
      });
    }

    if (breakdown.location === 100) {
      reasons.push({
        category: "location",
        title: "Location fits",
        description: opportunity.remote ? "Remote work provides maximum flexibility." : "This opportunity is in your current location."
      });
    }

    if (breakdown.interests >= 80) {
      reasons.push({
        category: "interests",
        title: "Interest alignment",
        description: "This role covers topics you are interested in."
      });
    }

    return reasons;
  },

  getRecommendationReason(match: MatchResult): string {
    const parts = [];
    if (match.breakdown.skills >= 80) parts.push("skills");
    if (match.breakdown.goals >= 80) parts.push("goals");
    if (match.breakdown.experience === 100) parts.push("experience");

    if (parts.length > 0) {
      const formattedParts = parts.slice(0, 2).join(" and ");
      return `Strong match for your ${formattedParts}.`;
    }

    return "Good potential match to explore.";
  }
};
