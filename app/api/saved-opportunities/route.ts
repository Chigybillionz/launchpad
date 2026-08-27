import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/services/auth";
import { paginationQuerySchema, savedOpportunitySchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const parsed = paginationQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid pagination parameters", details: parsed.error.format() } },
        { status: 400 }
      );
    }

    const { page, limit } = parsed.data;
    const where = { userId: user.id };
    const [items, total] = await Promise.all([
      prisma.savedOpportunity.findMany({
        where,
        include: { opportunity: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.savedOpportunity.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Authentication") || error.message.includes("Session"))) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }

    console.error("GET /api/saved-opportunities error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = savedOpportunitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid saved opportunity data", details: parsed.error.format() } },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: parsed.data.opportunityId },
      select: { id: true },
    });

    if (!opportunity) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Opportunity not found" } }, { status: 404 });
    }

    try {
      await prisma.savedOpportunity.create({
        data: {
          userId: user.id,
          opportunityId: parsed.data.opportunityId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code !== "P2002") {
        throw error;
      }
    }

    return NextResponse.json({ success: true, data: { saved: true } });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Authentication") || error.message.includes("Session"))) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }

    console.error("POST /api/saved-opportunities error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
  }
}
