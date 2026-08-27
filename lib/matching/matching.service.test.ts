import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { MatchingService } from "./matching.service";
import { User, Opportunity } from "@prisma/client";

describe("MatchingService", () => {
  describe("calculateSkillMatch", () => {
    test("returns 100 if opportunity has no required skills", () => {
      const res = MatchingService.calculateSkillMatch(["React"], []);
      assert.equal(res.score, 100);
      assert.equal(res.matchedSkills.length, 0);
      assert.equal(res.missingSkills.length, 0);
    });

    test("returns 0 and all missing if user has no skills", () => {
      const res = MatchingService.calculateSkillMatch([], ["React", "Git"]);
      assert.equal(res.score, 0);
      assert.equal(res.matchedSkills.length, 0);
      assert.deepEqual(res.missingSkills, ["React", "Git"]);
    });

    test("returns 100 for perfect skill match case-insensitive", () => {
      const res = MatchingService.calculateSkillMatch(["react", " javascript ", "Git"], ["React", "JavaScript", "Git"]);
      assert.equal(res.score, 100);
      assert.equal(res.matchedSkills.length, 3);
    });

    test("returns partial score for partial skill match", () => {
      const res = MatchingService.calculateSkillMatch(["React", "Git"], ["React", "JavaScript", "Git", "Testing"]);
      assert.equal(res.score, 50); // 2 out of 4
      assert.deepEqual(res.matchedSkills, ["React", "Git"]);
      assert.deepEqual(res.missingSkills, ["JavaScript", "Testing"]);
    });
  });

  describe("calculateExperienceMatch", () => {
    test("returns 100 for exact match", () => {
      assert.equal(MatchingService.calculateExperienceMatch("BEGINNER", "BEGINNER"), 100);
      assert.equal(MatchingService.calculateExperienceMatch("ADVANCED", "ADVANCED"), 100);
    });

    test("returns 75 for adjacent experience match", () => {
      assert.equal(MatchingService.calculateExperienceMatch("BEGINNER", "INTERMEDIATE"), 75);
      assert.equal(MatchingService.calculateExperienceMatch("ADVANCED", "INTERMEDIATE"), 75);
    });

    test("returns 40 for major experience mismatch", () => {
      assert.equal(MatchingService.calculateExperienceMatch("BEGINNER", "ADVANCED"), 40);
      assert.equal(MatchingService.calculateExperienceMatch("ADVANCED", "BEGINNER"), 40);
    });

    test("returns 100 if opportunity has no experience metadata", () => {
      assert.equal(MatchingService.calculateExperienceMatch("BEGINNER", undefined), 100);
    });
  });

  describe("calculateGoalMatch", () => {
    test("returns 100 for matching goal", () => {
      assert.equal(MatchingService.calculateGoalMatch(["Internship", "Hackathon"], "INTERNSHIP"), 100);
    });

    test("returns 0 for no goal match", () => {
      assert.equal(MatchingService.calculateGoalMatch(["Internship", "Hackathon"], "GRANT"), 0);
    });

    test("returns 50 for missing opportunity metadata", () => {
      assert.equal(MatchingService.calculateGoalMatch(["Internship"], undefined), 50);
    });

    test("returns 50 for missing user goals", () => {
      assert.equal(MatchingService.calculateGoalMatch([], "INTERNSHIP"), 50);
    });
  });

  describe("calculateLocationMatch", () => {
    test("returns 100 for remote opportunity regardless of user location", () => {
      assert.equal(MatchingService.calculateLocationMatch("Nigeria", "Ghana", true), 100);
    });

    test("returns 100 for exact location match", () => {
      assert.equal(MatchingService.calculateLocationMatch("Nigeria", "Nigeria", false), 100);
    });

    test("returns 0 for location mismatch", () => {
      assert.equal(MatchingService.calculateLocationMatch("Nigeria", "Ghana", false), 0);
    });

    test("returns 50 if opportunity location is missing and not remote", () => {
      assert.equal(MatchingService.calculateLocationMatch("Nigeria", undefined, false), 50);
    });
  });

  describe("calculateInterestMatch", () => {
    test("returns partial score based on overlap", () => {
      assert.equal(MatchingService.calculateInterestMatch(["AI", "Web"], ["AI", "ML", "Web", "Cloud"]), 50); // 2 of 4
    });

    test("returns 50 if opportunity has no tags", () => {
      assert.equal(MatchingService.calculateInterestMatch(["AI"], []), 50);
    });

    test("returns 50 if user has no interests (neutral)", () => {
      assert.equal(MatchingService.calculateInterestMatch([], ["AI"]), 50);
    });
  });

  describe("calculateMatchScore (Final Score)", () => {
    test("calculates a correct final score and ensures it is between 0 and 100", () => {
      const user: Partial<User> = {
        skills: ["React", "Node", "Git"],
        experienceLevel: "INTERMEDIATE",
        goals: ["Job"],
        location: "USA",
        interests: ["Web Dev", "Cloud"]
      };

      const opp: Partial<Opportunity> = {
        requiredSkills: ["React", "Node", "AWS"],
        experienceLevel: "BEGINNER", // adjacent -> 75
        type: "JOB", // match -> 100
        location: "USA", // match -> 100
        remote: false,
        tags: ["Web Dev", "React"] // match 1 of 2 -> 50
      };

      const result = MatchingService.calculateMatchScore(user, opp);
      assert.equal(result.score, 76);
      assert.equal(result.label, "Strong Match");
      assert.equal(result.breakdown.skills, 67);
      assert.equal(result.breakdown.experience, 75);
      assert.equal(result.breakdown.goals, 100);
      assert.equal(result.breakdown.location, 100);
      assert.equal(result.breakdown.interests, 50);
      assert.deepEqual(result.matchedSkills, ["React", "Node"]);
      assert.deepEqual(result.missingSkills, ["AWS"]);
    });

    test("bounds score properly for empty objects", () => {
      const result = MatchingService.calculateMatchScore({}, {});
      assert.ok(result.score >= 0);
      assert.ok(result.score <= 100);
    });
  });
});

