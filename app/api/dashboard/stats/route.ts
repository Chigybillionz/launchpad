import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/services/auth";

export async function GET() {
  try {
    const user = await requireAuth();

    const [saved, applications, interviews, accepted, recentApplications] = await Promise.all([
      prisma.savedOpportunity.count({ where: { userId: user.id } }),
      prisma.application.count({ where: { userId: user.id } }),
      prisma.application.count({ where: { userId: user.id, status: "INTERVIEW" } }),
      prisma.application.count({ where: { userId: user.id, status: "ACCEPTED" } }),
      prisma.application.findMany({
        where: { userId: user.id },
        include: { opportunity: true },
        orderBy: { appliedAt: "desc" },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        saved,
        applications,
        interviews,
        accepted,
        recentApplications,
      },
    });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Authentication") || error.message.includes("Session"))) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }

    console.error("GET /api/dashboard/stats error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
  }
}
