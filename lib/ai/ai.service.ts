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
      const waitSeconds = Math.ceil((RATE_LIMIT_COOLDOWN_MS - (now - lastRequest)) / 1000);
      throw new Error(`Please wait ${waitSeconds} seconds before generating another plan.`);
    }
    rateLimitMap.set(userId, now);

    // --- Validate API key ---
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("AI_UNAVAILABLE");
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
          // Check for specific OpenAI errors
          if (error.message.includes("401") || error.message.includes("Incorrect API key")) {
            throw new Error("AI_UNAVAILABLE");
          }
          if (error.message.includes("429") || error.message.includes("Rate limit")) {
            throw new Error("AI_RATE_LIMITED");
          }
          if (error.message.includes("timeout") || error.message.includes("ETIMEDOUT")) {
            throw new Error("AI_TIMEOUT");
          }
        }

        throw error;
      }
    }

    // Should never reach here, but TypeScript needs it
    throw new Error("AI_UNAVAILABLE");
  },
};
