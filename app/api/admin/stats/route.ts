import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/services/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();

    const [
      users,
      opportunities,
      savedOpportunities,
      applications,
      acceptedApplications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.opportunity.count(),
      prisma.savedOpportunity.count(),
      prisma.application.count(),
      prisma.application.count({
        where: { status: "ACCEPTED" },
      }),
    ]);

    // Calculate applications this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const applicationsThisWeek = await prisma.application.count({
      where: {
        appliedAt: { gte: oneWeekAgo },
      },
    });

    // Calculate average match score (approximate from stored match scores if available, or static for MVP)
    const matchScores = await prisma.opportunity.aggregate({
      _avg: {
        matchScore: true,
      },
      where: {
        matchScore: { not: null },
      },
    });

    const averageMatchScore = matchScores._avg.matchScore
      ? Math.round(matchScores._avg.matchScore)
      : 85; // Fallback demo value if no scores exist yet

    return NextResponse.json({
      success: true,
      data: {
        users,
        opportunities,
        savedOpportunities,
        applications,
        applicationsThisWeek,
        acceptedApplications,
        averageMatchScore,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Admin authorization required")) {
      return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Forbidden" } }, { status: 403 });
    }
    if (error instanceof Error && error.message === "Authentication required.") {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } }, { status: 500 });
  }
}
