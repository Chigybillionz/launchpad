import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/services/auth";
import { prisma } from "@/lib/prisma";

// GET a specific user with their detailed information
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            opportunity: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        savedOpportunities: {
          include: {
            opportunity: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "User not found" } },
        { status: 404 }
      );
    }

    // Don't leak password hash
    const { passwordHash: _, ...safeUser } = user;

    return NextResponse.json({ success: true, data: safeUser });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Admin authorization required")) {
      return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Forbidden" } }, { status: 403 });
    }
    console.error(`GET /api/admin/users/[id] error:`, error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } }, { status: 500 });
  }
}

// PUT to update a user
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    
    // Only allow updating specific fields
    const { name, email, role, experienceLevel, location } = body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        email: email !== undefined ? email : undefined,
        role: role !== undefined ? role : undefined,
        experienceLevel: experienceLevel !== undefined ? experienceLevel : undefined,
        location: location !== undefined ? location : undefined,
      },
    });

    const { passwordHash: _, ...safeUser } = updatedUser;

    return NextResponse.json({ success: true, data: safeUser });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Admin authorization required")) {
      return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Forbidden" } }, { status: 403 });
    }
    console.error(`PUT /api/admin/users/[id] error:`, error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } }, { status: 500 });
  }
}

// DELETE a user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    // The database has onDelete: Cascade for user relations (applications, savedOpportunities, sessions),
    // so this will also delete those related records automatically.
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Admin authorization required")) {
      return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Forbidden" } }, { status: 403 });
    }
    console.error(`DELETE /api/admin/users/[id] error:`, error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } }, { status: 500 });
  }
}
