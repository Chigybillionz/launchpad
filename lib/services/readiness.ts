import { ReadinessPlan } from "@/types/readiness";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ReadinessService = {
  async generatePlan(opportunityId: string, missingSkills: string[]): Promise<ReadinessPlan> {
    await delay(2500); // Simulate AI generation time

    if (Math.random() > 0.95) {
      throw new Error("AI generation failed");
    }

    const mainMissingSkill = missingSkills.length > 0 ? missingSkills[0] : "Fundamentals";
    const secondaryMissingSkill = missingSkills.length > 1 ? missingSkills[1] : "Advanced Topics";

    const mockPlan: ReadinessPlan = {
      opportunityId,
      generatedAt: new Date().toISOString(),
      days: [
        {
          dayNumber: 1,
          tasks: [
            {
              id: "t1",
              title: `${mainMissingSkill} Fundamentals`,
              description: `Review the core concepts and syntax of ${mainMissingSkill}. Set up your local environment.`,
              estimatedEffort: "2 hours",
              completed: false,
            }
          ]
        },
        {
          dayNumber: 2,
          tasks: [
            {
              id: "t2",
              title: `Apply ${mainMissingSkill} in a basic project`,
              description: `Build a small toy application using ${mainMissingSkill} to cement your understanding.`,
              estimatedEffort: "3 hours",
              completed: false,
            }
          ]
        },
        {
          dayNumber: 3,
          tasks: [
            {
              id: "t3",
              title: `${secondaryMissingSkill} Fundamentals`,
              description: `Dive into ${secondaryMissingSkill} and understand how it integrates with your existing stack.`,
              estimatedEffort: "2 hours",
              completed: false,
            }
          ]
        },
        {
          dayNumber: 4,
          tasks: [
            {
              id: "t4",
              title: `Integrate ${mainMissingSkill} and ${secondaryMissingSkill}`,
              description: `Create a small feature that uses both technologies together. Focus on best practices.`,
              estimatedEffort: "3 hours",
              completed: false,
            }
          ]
        },
        {
          dayNumber: 5,
          tasks: [
            {
              id: "t5",
              title: "Improve GitHub Portfolio",
              description: "Push your mini-projects to GitHub. Write a clear README explaining your approach.",
              estimatedEffort: "1 hour",
              completed: false,
            }
          ]
        },
        {
          dayNumber: 6,
          tasks: [
            {
              id: "t6",
              title: "Review Application Requirements",
              description: "Go through the opportunity requirements line by line and tailor your resume.",
              estimatedEffort: "1.5 hours",
              completed: false,
            }
          ]
        },
        {
          dayNumber: 7,
          tasks: [
            {
              id: "t7",
              title: "Prepare Application",
              description: "Write your cover letter highlighting your rapid upskilling and submit your application.",
              estimatedEffort: "1 hour",
              completed: false,
            }
          ]
        }
      ]
    };

    return mockPlan;
  }
};
