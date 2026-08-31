import { NextResponse } from "next/server";
import { OpportunityService } from "@/lib/services/opportunity.service";
import { MatchingService } from "@/lib/matching/matching.service";
import { completeProfileSchema } from "@/lib/validators";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const opportunity = await OpportunityService.getOpportunityById(resolvedParams.id);

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Opportunity not found" } },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsedBody = completeProfileSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid guest profile", details: parsedBody.error.format() } },
        { status: 400 }
      );
    }

    const profile = parsedBody.data;
    const match = MatchingService.calculateMatchScore(profile, opportunity);

    return NextResponse.json({
      success: true,
      data: {
        opportunity,
        match,
      }
    });
  } catch (error) {
    console.error("POST /api/discover/[id] error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
