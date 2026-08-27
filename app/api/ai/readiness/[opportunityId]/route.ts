import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth";
import { prisma } from "@/lib/prisma";
import { MatchingService } from "@/lib/matching/matching.service";
import { SkillGapService } from "@/lib/matching/skill-gap.service";
import { AIService } from "@/lib/ai/ai.service";
import { ReadinessInput } from "@/lib/ai/types";
import { ReadinessApiResponse, ReadinessPlan } from "@/types/readiness";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ opportunityId: string }> }
) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const opportunityId = resolvedParams.opportunityId;

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Missing opportunityId parameter" } },
        { status: 400 }
      );
    }

    // Fetch opportunity
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Opportunity not found" } },
        { status: 404 }
      );
    }

    // Calculate deterministic match and skill gap
    const match = MatchingService.calculateMatchScore(user, opportunity);
    const skillGap = SkillGapService.getSkillGapForOpportunity(user, opportunity);

    // Build AI input — only send safe, relevant data
    const aiInput: ReadinessInput = {
      user: {
        name: user.name,
        role: user.role,
        experienceLevel: user.experienceLevel,
        location: user.location,
        skills: user.skills,
        interests: user.interests,
        goals: user.goals,
      },
      opportunity: {
        title: opportunity.title,
        organization: opportunity.organization,
        type: opportunity.type,
        location: opportunity.location,
        remote: opportunity.remote,
        requiredSkills: opportunity.requiredSkills,
        experienceLevel: opportunity.experienceLevel,
        description: opportunity.description,
      },
      match: {
        score: match.score,
        label: match.label,
        breakdown: match.breakdown,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
      },
      skillGap: {
        missingSkills: skillGap.missingSkills,
        skillMatchPercentage: skillGap.skillMatchPercentage,
      },
    };

    // Attempt AI generation
    try {
      const aiPlan = await AIService.generateReadinessPlan(user.id, aiInput);

      // Convert AI action plan steps into the ReadinessPlan days format for the existing UI
      const days = aiPlan.actionPlan.map((step, index) => ({
        dayNumber: index + 1,
        tasks: [
          {
            id: `ai-step-${step.step}`,
            title: step.title,
            description: step.description,
            estimatedEffort: step.timeframe,
            completed: false,
          },
        ],
      }));

      const readinessPlan: ReadinessPlan = {
        opportunityId,
        summary: aiPlan.summary,
        priority: aiPlan.priority,
        skillsToImprove: aiPlan.skillsToImprove,
        days,
        interviewPreparation: aiPlan.interviewPreparation,
        applicationAdvice: aiPlan.applicationAdvice,
        generatedAt: new Date().toISOString(),
      };

      const response: ReadinessApiResponse = {
        matchScore: match.score,
        matchLabel: match.label,
        aiAvailable: true,
        readinessPlan,
      };

      return NextResponse.json({ success: true, data: response });
    } catch (aiError) {
      // AI failed — return fallback with deterministic data
      console.error("[AI_READINESS] AI generation failed:", aiError);

      let fallbackMessage = "AI readiness guidance is temporarily unavailable.";
      if (aiError instanceof Error) {
        if (aiError.message === "AI_UNAVAILABLE") {
          fallbackMessage = "AI readiness guidance is not configured. Please add an API key.";
        } else if (aiError.message === "AI_RATE_LIMITED") {
          fallbackMessage = "AI service is currently busy. Please try again in a moment.";
        } else if (aiError.message === "AI_TIMEOUT") {
          fallbackMessage = "AI service took too long to respond. Please try again.";
        } else if (aiError.message.startsWith("Please wait")) {
          fallbackMessage = aiError.message;
        }
      }

      const response: ReadinessApiResponse = {
        matchScore: match.score,
        matchLabel: match.label,
        aiAvailable: false,
        readinessPlan: null,
        fallback: {
          message: fallbackMessage,
          missingSkills: match.missingSkills,
        },
      };

      return NextResponse.json({ success: true, data: response });
    }
  } catch (error: unknown) {
    console.error("[AI_READINESS_GET]", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("Authentication") || errorMessage.includes("Session") || errorMessage.includes("Unauthorized")) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
