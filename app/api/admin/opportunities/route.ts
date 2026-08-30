import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/services/auth";
import { OpportunityService } from "@/lib/services/opportunity.service";
import { opportunityQuerySchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    // Allow fetching analytics data if explicitly requested
    if (query.analytics === "true") {
      const [typeCounts, topSkills] = await Promise.all([
        prisma.opportunity.groupBy({
          by: ["type"],
          _count: { type: true },
        }),
        // For top skills, we fetch all requiredSkills and calculate in memory for MVP
        prisma.opportunity.findMany({
          select: { requiredSkills: true },
        }),
      ]);

      const skillFrequencies: Record<string, number> = {};
      topSkills.forEach((opp) => {
        opp.requiredSkills.forEach((skill) => {
          skillFrequencies[skill] = (skillFrequencies[skill] || 0) + 1;
        });
      });

      const sortedSkills = Object.entries(skillFrequencies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count }));

      return NextResponse.json({
        success: true,
        data: {
          opportunitiesByType: typeCounts.map((tc) => ({ type: tc.type, count: tc._count.type })),
          topSkills: sortedSkills,
        },
      });
    }

    if (query.type) {
      query.type = query.type.toUpperCase().replace(/\s+/g, '_');
    }
    if (query.experienceLevel) {
      query.experienceLevel = query.experienceLevel.toUpperCase();
    }

    const parsed = opportunityQuerySchema.safeParse(query);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid query parameters" } }, { status: 400 });
    }

    const result = await OpportunityService.getOpportunities(parsed.data);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Admin authorization required")) {
      return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Forbidden" } }, { status: 403 });
    }
    if (error instanceof Error && error.message === "Authentication required.") {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }
    console.error("GET /api/admin/opportunities error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } }, { status: 500 });
  }
}
