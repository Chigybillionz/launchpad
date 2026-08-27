import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth";
import { prisma } from "@/lib/prisma";
import { SkillGapService } from "@/lib/matching/skill-gap.service";

export async function GET() {
  try {
    const user = await requireAuth();

    // To perform cross-opportunity analysis, we fetch a set of opportunities.
    // For MVP, we can fetch recent opportunities or opportunities matching the user's goals.
    // Let's fetch top 50 recent opportunities for a reasonable baseline.
    const opportunities = await prisma.opportunity.findMany({
      take: 50,
      orderBy: {
        createdAt: "desc"
      }
    });

    const analysis = SkillGapService.getSkillGapsAcrossOpportunities(user, opportunities);

    return NextResponse.json({
      success: true,
      data: analysis
    });
  } catch (error: unknown) {
    console.error("[SKILL_GAPS_GET]", error);
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
