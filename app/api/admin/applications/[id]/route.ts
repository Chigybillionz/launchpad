import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/services/auth";
import { prisma } from "@/lib/prisma";
import { applicationStatusSchema } from "@/lib/validators";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            skills: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            title: true,
            organization: true,
            type: true,
            location: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Application not found" } }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { application },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Admin authorization required")) {
      return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Forbidden" } }, { status: 403 });
    }
    if (error instanceof Error && error.message === "Authentication required.") {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }
    console.error("GET /api/admin/applications/[id] error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const parsed = applicationStatusSchema.safeParse(body.status);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid status" } }, { status: 400 });
    }

    const application = await prisma.application.update({
      where: { id },
      data: {
        status: parsed.data,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        opportunity: { select: { id: true, title: true, organization: true } },
      }
    });

    return NextResponse.json({
      success: true,
      data: { application },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Admin authorization required")) {
      return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Forbidden" } }, { status: 403 });
    }
    if (error instanceof Error && error.message === "Authentication required.") {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }
    console.error("PATCH /api/admin/applications/[id] error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } }, { status: 500 });
  }
}
