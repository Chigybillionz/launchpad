import { ApplicationStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/services/auth";
import { applicationQuerySchema, createApplicationSchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const parsed = applicationQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid application query", details: parsed.error.format() } },
        { status: 400 }
      );
    }

    const { page, limit, status } = parsed.data;
    const where: Prisma.ApplicationWhereInput = {
      userId: user.id,
      ...(status ? { status: status as ApplicationStatus } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: { opportunity: true },
        orderBy: { appliedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.application.count({ where }),
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

    console.error("GET /api/applications error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = createApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid application data", details: parsed.error.format() } },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: parsed.data.opportunityId },
      select: { id: true, applicationUrl: true },
    });

    if (!opportunity) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Opportunity not found" } }, { status: 404 });
    }

    try {
      const application = await prisma.application.create({
        data: {
          userId: user.id,
          opportunityId: parsed.data.opportunityId,
          status: "APPLIED",
          appliedAt: new Date(),
          externalApplicationUrl: opportunity.applicationUrl,
        },
        include: { opportunity: true },
      });

      return NextResponse.json({ success: true, data: { application } }, { status: 201 });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "ALREADY_APPLIED",
              message: "You have already applied to this opportunity.",
            },
          },
          { status: 409 }
        );
      }

      throw error;
    }
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Authentication") || error.message.includes("Session"))) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }

    console.error("POST /api/applications error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
  }
}
