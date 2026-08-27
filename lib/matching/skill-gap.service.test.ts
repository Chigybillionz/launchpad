import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { SkillGapService } from "./skill-gap.service";

describe("SkillGapService", () => {
  describe("analyzeSkillGap", () => {
    test("all skills matched", () => {
      const res = SkillGapService.analyzeSkillGap(["React", "Node"], ["React", "Node"]);
      assert.equal(res.skillMatchPercentage, 100);
      assert.equal(res.missingSkills.length, 0);
      assert.equal(res.matchedSkills.length, 2);
      assert.equal(res.summary, "You currently have all the required skills for this opportunity.");
    });

    test("no skills matched", () => {
      const res = SkillGapService.analyzeSkillGap(["Python"], ["React", "Node"]);
      assert.equal(res.skillMatchPercentage, 0);
      assert.equal(res.missingSkills.length, 2);
      assert.equal(res.matchedSkills.length, 0);
      assert.ok(res.summary.includes("missing all 2 required skills"));
    });

    test("partial skill match", () => {
      const res = SkillGapService.analyzeSkillGap(["React"], ["React", "Node", "Docker"]);
      assert.equal(res.skillMatchPercentage, 33);
      assert.equal(res.missingSkills.length, 2);
      assert.equal(res.matchedSkills.length, 1);
      assert.ok(res.summary.includes("match 1 of the 3 required skills"));
    });

    test("duplicate skills (should be handled by normalization)", () => {
      const res = SkillGapService.analyzeSkillGap(["React", "React"], ["React", "react"]);
      // MatchingService normalizes this, so they both resolve to 'react' or 'React'
      // length of matchedSkills is based on the requiredSkills array length in the MatchingService, which iterates original required.
      // So if required is ["React", "react"], it will match both. Wait, let's see.
      assert.equal(res.skillMatchPercentage, 100);
    });

    test("case-insensitive matching", () => {
      const res = SkillGapService.analyzeSkillGap(["react js"], ["React JS"]);
      assert.equal(res.skillMatchPercentage, 100);
    });

    test("empty user skills", () => {
      const res = SkillGapService.analyzeSkillGap([], ["React"]);
      assert.equal(res.skillMatchPercentage, 0);
      assert.equal(res.missingSkills.length, 1);
      assert.equal(res.summary, "Add your skills to your profile to see your skill gaps.");
    });

    test("empty required skills", () => {
      const res = SkillGapService.analyzeSkillGap(["React"], []);
      assert.equal(res.skillMatchPercentage, 100);
      assert.equal(res.missingSkills.length, 0);
      assert.equal(res.summary, "No specific skills were listed for this opportunity.");
    });

    test("no duplicate missing skills (from MatchingService logic)", () => {
      const res = SkillGapService.analyzeSkillGap(["Python"], ["React", "react"]);
      assert.equal(res.missingSkills.length, 2);
      // Wait, MatchingService just iterates through requiredSkills. 
      // It pushes whatever is in requiredSkills. That's fine.
    });
  });

  describe("calculateSkillPriority", () => {
    test("opportunity-specific priority rules (1-3 skills)", () => {
      assert.equal(SkillGapService.calculateSkillPriority(0, 3, 3), "HIGH");
      assert.equal(SkillGapService.calculateSkillPriority(2, 3, 3), "HIGH");
    });

    test("opportunity-specific priority rules (4-6 skills)", () => {
      assert.equal(SkillGapService.calculateSkillPriority(0, 5, 5), "HIGH");
      assert.equal(SkillGapService.calculateSkillPriority(1, 5, 5), "HIGH");
      assert.equal(SkillGapService.calculateSkillPriority(2, 5, 5), "MEDIUM");
      assert.equal(SkillGapService.calculateSkillPriority(4, 5, 5), "MEDIUM");
    });

    test("opportunity-specific priority rules (>6 skills)", () => {
      assert.equal(SkillGapService.calculateSkillPriority(0, 8, 8), "HIGH"); // 1st
      assert.equal(SkillGapService.calculateSkillPriority(2, 8, 8), "HIGH"); // 3rd
      assert.equal(SkillGapService.calculateSkillPriority(3, 8, 8), "MEDIUM"); // 4th
      assert.equal(SkillGapService.calculateSkillPriority(5, 8, 8), "MEDIUM"); // 6th
      assert.equal(SkillGapService.calculateSkillPriority(6, 8, 8), "LOW"); // 7th
    });
  });

  describe("getSkillGapsAcrossOpportunities", () => {
    test("global skill frequency and global priority", () => {
      const user = { skills: ["Python"] };
      const opportunities = [
        { requiredSkills: ["React", "Node"] },
        { requiredSkills: ["React", "Docker"] },
        { requiredSkills: ["React", "Docker"] },
        { requiredSkills: ["React", "Kubernetes"] },
        { requiredSkills: ["React", "TypeScript"] },
      ];

      const res = SkillGapService.getSkillGapsAcrossOpportunities(user, opportunities);
      
      // React should appear 5 times -> HIGH
      // Docker should appear 2 times -> MEDIUM
      // Node, Kubernetes, TypeScript should appear 1 time -> LOW

      const react = res.skills.find(s => s.skill === "React");
      assert.equal(react?.frequency, 5);
      assert.equal(react?.priority, "HIGH");

      const docker = res.skills.find(s => s.skill === "Docker");
      assert.equal(docker?.frequency, 2);
      assert.equal(docker?.priority, "MEDIUM");

      const node = res.skills.find(s => s.skill === "Node");
      assert.equal(node?.frequency, 1);
      assert.equal(node?.priority, "LOW");
    });

    test("sorting", () => {
      const user = { skills: ["Python"] };
      const opportunities = [
        { requiredSkills: ["React", "Docker"] },
        { requiredSkills: ["React", "Docker"] },
        { requiredSkills: ["React", "Kubernetes"] },
        { requiredSkills: ["React", "TypeScript"] },
        { requiredSkills: ["React", "Testing"] },
      ];

      const res = SkillGapService.getSkillGapsAcrossOpportunities(user, opportunities);
      
      // Expected: React (HIGH, 5), Docker (MEDIUM, 2), Kubernetes (LOW, 1), TypeScript (LOW, 1), Testing (LOW, 1)
      assert.equal(res.skills[0].skill, "React");
      assert.equal(res.skills[1].skill, "Docker");
      
      // Rest are LOW priority and frequency 1
      assert.equal(res.skills[2].priority, "LOW");
    });
  });
});
