import { ApplicationStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/services/auth";
import { idParamSchema, updateApplicationSchema } from "@/lib/validators";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const parsed = idParamSchema.safeParse(resolvedParams);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid application ID", details: parsed.error.format() } },
        { status: 400 }
      );
    }

    const application = await prisma.application.findFirst({
      where: {
        id: parsed.data.id,
        userId: user.id,
      },
      include: { opportunity: true },
    });

    if (!application) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Application not found" } }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        application,
        opportunity: application.opportunity,
      },
    });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Authentication") || error.message.includes("Session"))) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }

    console.error("GET /api/applications/[id] error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const parsedParams = idParamSchema.safeParse(resolvedParams);

    if (!parsedParams.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid application ID", details: parsedParams.error.format() } },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsedBody = updateApplicationSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid application status", details: parsedBody.error.format() } },
        { status: 400 }
      );
    }

    const existing = await prisma.application.findFirst({
      where: {
        id: parsedParams.data.id,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Application not found" } }, { status: 404 });
    }

    const application = await prisma.application.update({
      where: { id: existing.id },
      data: { status: parsedBody.data.status as ApplicationStatus },
      include: { opportunity: true },
    });

    return NextResponse.json({ success: true, data: { application } });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Authentication") || error.message.includes("Session"))) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }

    console.error("PATCH /api/applications/[id] error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
  }
}
