import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth";
import { OpportunityService } from "@/lib/services/opportunity.service";
import { MatchingService } from "@/lib/matching/matching.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ opportunityId: string }> }
) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;

    const opportunity = await OpportunityService.getOpportunityById(resolvedParams.opportunityId);

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Opportunity not found" } },
        { status: 404 }
      );
    }

    const match = MatchingService.calculateMatchScore(user, opportunity);

    return NextResponse.json({
      success: true,
      data: {
        opportunity,
        match,
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Session")) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }
    console.error("GET /api/matches/[opportunityId] error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
