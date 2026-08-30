import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/services/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        experienceLevel: true,
        location: true,
        skills: true,
        interests: true,
        goals: true,
        profileCompleted: true,
        createdAt: true,
        _count: {
          select: {
            savedOpportunities: true,
            applications: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "User not found" } }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Admin authorization required")) {
      return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Forbidden" } }, { status: 403 });
    }
    if (error instanceof Error && error.message === "Authentication required.") {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }
    console.error("GET /api/admin/users/[id] error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } }, { status: 500 });
  }
}
