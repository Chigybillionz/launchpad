import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SkillGapService } from "@/lib/matching/skill-gap.service";
import { completeProfileSchema } from "@/lib/validators";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const opportunityId = resolvedParams.id;

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

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
    const analysis = SkillGapService.getSkillGapForOpportunity(profile, opportunity);

    return NextResponse.json({
      success: true,
      data: {
        analysis
      },
    });
  } catch (error) {
    console.error("POST /api/discover/[id]/skill-gaps error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
