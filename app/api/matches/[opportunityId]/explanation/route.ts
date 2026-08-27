import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth";
import { OpportunityService } from "@/lib/services/opportunity.service";
import { MatchingService } from "@/lib/matching/matching.service";
import { ExplanationService } from "@/lib/matching/explanation.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ opportunityId: string }> }
) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const opportunityId = resolvedParams.opportunityId;

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Opportunity ID is required" } },
        { status: 400 }
      );
    }

    const opportunity = await OpportunityService.getOpportunityById(opportunityId);

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Opportunity not found" } },
        { status: 404 }
      );
    }

    const match = MatchingService.calculateMatchScore(user, opportunity);
    const explanation = ExplanationService.generateExplanation(match, opportunity);

    return NextResponse.json({
      success: true,
      data: {
        match,
        explanation,
      }
    });

  } catch (error) {
    if (error instanceof Error && error.message.includes("Session")) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }
    console.error("GET /api/matches/[id]/explanation error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
