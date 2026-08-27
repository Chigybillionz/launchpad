import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ExplanationService } from "./explanation.service";
import { MatchResult } from "@/types/match";
import { Opportunity } from "@prisma/client";

describe("ExplanationService", () => {
  const mockOpportunity: Partial<Opportunity> = {
    remote: true,
  };

  const mockMatchPerfect: MatchResult = {
    score: 100,
    label: "Perfect Match",
    breakdown: {
      skills: 100,
      experience: 100,
      goals: 100,
      location: 100,
      interests: 100,
    },
    matchedSkills: ["React", "TypeScript"],
    missingSkills: [],
  };

  const mockMatchPartial: MatchResult = {
    score: 65,
    label: "Good Match",
    breakdown: {
      skills: 60,
      experience: 100,
      goals: 80,
      location: 0,
      interests: 50,
    },
    matchedSkills: ["React"],
    missingSkills: ["TypeScript", "Node.js"],
  };

  describe("getSummary", () => {
    test("returns strong alignment summary for score >= 75", () => {
      assert.ok(ExplanationService.getSummary(80).includes("aligns strongly"));
    });
    test("returns good potential summary for score >= 60", () => {
      assert.ok(ExplanationService.getSummary(65).includes("good potential"));
    });
    test("returns require additional skills summary for score < 60", () => {
      assert.ok(ExplanationService.getSummary(40).includes("require additional skills"));
    });
  });

  describe("getStrengths", () => {
    test("returns all strengths for perfect match", () => {
      const strengths = ExplanationService.getStrengths(mockMatchPerfect.breakdown, mockOpportunity);
      assert.equal(strengths.length, 5);
      assert.ok(strengths.includes("You have all the required technical skills."));
      assert.ok(strengths.includes("Your experience level matches the opportunity."));
    });
    test("returns partial strengths", () => {
      const strengths = ExplanationService.getStrengths(mockMatchPartial.breakdown, mockOpportunity);
      assert.ok(strengths.includes("Your experience level matches the opportunity."));
      assert.ok(strengths.includes("This opportunity aligns with your career goals."));
      assert.equal(strengths.some(s => s.includes("technical skills")), false);
    });
  });

  describe("getGaps", () => {
    test("returns no major gaps if missingSkills is empty", () => {
      const gaps = ExplanationService.getGaps([]);
      assert.deepEqual(gaps, ["No major skill gaps identified."]);
    });
    test("returns specific gaps", () => {
      const gaps = ExplanationService.getGaps(["TypeScript"]);
      assert.deepEqual(gaps, ["TypeScript is listed as a required skill you don't currently have."]);
    });
  });

  describe("getRecommendations", () => {
    test("returns well-prepared if no gaps", () => {
      assert.deepEqual(ExplanationService.getRecommendations([]), ["You are well-prepared to apply."]);
    });
    test("returns specific review if 1 gap", () => {
      assert.deepEqual(ExplanationService.getRecommendations(["TypeScript"]), ["Review TypeScript fundamentals before applying."]);
    });
    test("returns multiple reviews if >1 gap", () => {
      const recs = ExplanationService.getRecommendations(["TypeScript", "Node.js", "AWS"]);
      assert.ok(recs[1].includes("TypeScript and Node.js"));
    });
  });

  describe("getRecommendationReason", () => {
    test("returns combined reason for strong match", () => {
      assert.equal(ExplanationService.getRecommendationReason(mockMatchPerfect), "Strong match for your skills and goals.");
    });
    test("returns combined reason for partial match", () => {
      assert.equal(ExplanationService.getRecommendationReason(mockMatchPartial), "Strong match for your goals and experience.");
    });
  });
});
