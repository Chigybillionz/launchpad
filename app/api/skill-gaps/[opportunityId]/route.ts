import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth";
import { prisma } from "@/lib/prisma";
import { SkillGapService } from "@/lib/matching/skill-gap.service";

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
        { success: false, error: { code: "BAD_REQUEST", message: "Missing opportunityId parameter" } },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Opportunity not found" } },
        { status: 404 }
      );
    }

    const analysis = SkillGapService.getSkillGapForOpportunity(user, opportunity);

    return NextResponse.json({
      success: true,
      data: {
        analysis
      },
    });
  } catch (error: unknown) {
    console.error("[SKILL_GAP_GET]", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    if (errorMessage === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
