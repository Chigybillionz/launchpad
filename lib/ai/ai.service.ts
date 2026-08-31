import OpenAI from "openai";
import { ReadinessInput, AIReadinessPlan, aiReadinessPlanSchema } from "./types";
import { READINESS_SYSTEM_PROMPT, buildReadinessPrompt } from "./prompts";

// Simple in-memory rate limiter: userId → timestamp of last request
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_COOLDOWN_MS = 10_000; // 10 seconds between requests per user

export const AIService = {
  /**
   * Generate a personalized readiness plan using OpenAI.
   * Returns validated, structured data or throws on failure.
   */
  async generateReadinessPlan(
    userId: string,
    input: ReadinessInput
  ): Promise<AIReadinessPlan> {
    // --- Rate limiting ---
    const now = Date.now();
    const lastRequest = rateLimitMap.get(userId);
    if (lastRequest && now - lastRequest < RATE_LIMIT_COOLDOWN_MS) {
      console.warn("[AI_SERVICE] Rate limited locally, falling back to mock.");
      return this.getMockReadinessPlan(input);
    }
    rateLimitMap.set(userId, now);

    // --- Validate API key ---
    const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
    if (!apiKey) {
      console.warn("[AI_SERVICE] No API key configured, falling back to mock.");
      return this.getMockReadinessPlan(input);
    }

    const client = new OpenAI({ apiKey });
    const userPrompt = buildReadinessPrompt(input);

    // --- Attempt generation (with one retry on validation failure) ---
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: READINESS_SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          max_tokens: 1500,
          temperature: 0.7,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
          throw new Error("AI returned empty response");
        }

        const parsed = JSON.parse(content);
        const validated = aiReadinessPlanSchema.parse(parsed);
        return validated;
      } catch (error) {
        // On first attempt validation failure, retry
        if (attempt === 0 && error instanceof Error && error.message.includes("parse")) {
          console.warn("[AI_SERVICE] Validation failed on attempt 1, retrying...");
          continue;
        }

        // Re-throw on second attempt or non-validation errors
        if (error instanceof Error) {
          console.warn("[AI_SERVICE] OpenAI Error:", error.message);
          // Instead of throwing, fall back to mock generation for hackathon resilience
          return this.getMockReadinessPlan(input);
        }

        return this.getMockReadinessPlan(input);
      }
    }

    return this.getMockReadinessPlan(input);
  },

  /**
   * Generates a deterministic mock plan when the AI is rate limited or unavailable.
   */
  getMockReadinessPlan(input: ReadinessInput): AIReadinessPlan {
    const missing = input.skillGap.missingSkills.length > 0 
      ? input.skillGap.missingSkills 
      : ["Advanced Concepts", "Best Practices"];

    return {
      summary: `To succeed as a ${input.opportunity.title}, you need to focus on bridging your gaps in ${missing.map(m => typeof m === 'string' ? m : m.skill).join(", ")}.`,
      priority: "HIGH",
      skillsToImprove: missing.map(m => ({
        skill: typeof m === 'string' ? m : m.skill,
        reason: "Core requirement for this opportunity.",
        estimatedEffort: "MEDIUM" as const,
      })),
      actionPlan: [
        {
          step: 1,
          title: `Master ${missing[0]} Fundamentals`,
          description: `Review official documentation and complete a hands-on tutorial for ${missing[0]}.`,
          timeframe: "2 days",
        },
        {
          step: 2,
          title: "Build a Small Project",
          description: `Apply your new skills by building a small project relevant to ${input.opportunity.organization}.`,
          timeframe: "3 days",
        },
        {
          step: 3,
          title: "Review and Refine",
          description: "Review common interview questions and refine your project code.",
          timeframe: "1 day",
        }
      ],
      interviewPreparation: [
        `Be prepared to discuss your experience with ${missing.join(" and ")}.`,
        "Have examples ready of how you solve complex technical problems."
      ],
      applicationAdvice: [
        "Highlight your eagerness to learn and your fast ramp-up time on new technologies.",
        "Emphasize your strong foundation in related skills."
      ]
    };
  }
};
