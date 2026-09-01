import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/services/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          experienceLevel: true,
          location: true,
          profileCompleted: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Admin authorization required")) {
      return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Forbidden" } }, { status: 403 });
    }
    if (error instanceof Error && error.message === "Authentication required.") {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { name, email, role, password, experienceLevel, location } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Name, email, and password are required" } },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: { code: "CONFLICT", message: "User with this email already exists" } },
        { status: 409 }
      );
    }

    // Hash the password
    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || "USER",
        experienceLevel: experienceLevel || "BEGINNER",
        location: location || "Remote",
        profileCompleted: false, // The user will complete their profile later
        skills: [],
        interests: [],
        goals: [],
        workPreferences: [],
      },
    });

    // Return the user without the password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({ success: true, data: userWithoutPassword }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Admin authorization required")) {
      return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Forbidden" } }, { status: 403 });
    }
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } }, { status: 500 });
  }
}
