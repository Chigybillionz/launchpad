import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/services/auth";
import { opportunityIdParamSchema } from "@/lib/validators";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ opportunityId: string }> }
) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const parsed = opportunityIdParamSchema.safeParse(resolvedParams);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid opportunity ID", details: parsed.error.format() } },
        { status: 400 }
      );
    }

    const saved = await prisma.savedOpportunity.findUnique({
      where: {
        userId_opportunityId: {
          userId: user.id,
          opportunityId: parsed.data.opportunityId,
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ success: true, data: { saved: Boolean(saved) } });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Authentication") || error.message.includes("Session"))) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }

    console.error("GET /api/saved-opportunities/[opportunityId] error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ opportunityId: string }> }
) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const parsed = opportunityIdParamSchema.safeParse(resolvedParams);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid opportunity ID", details: parsed.error.format() } },
        { status: 400 }
      );
    }

    await prisma.savedOpportunity.deleteMany({
      where: {
        userId: user.id,
        opportunityId: parsed.data.opportunityId,
      },
    });

    return NextResponse.json({ success: true, data: { saved: false } });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Authentication") || error.message.includes("Session"))) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }

    console.error("DELETE /api/saved-opportunities/[opportunityId] error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
  }
}
