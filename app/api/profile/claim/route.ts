import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth";
import { ProfileService } from "@/lib/services/profile.service";
import { completeProfileSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    
    // Check if user already has a completed profile to avoid silently overwriting
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { profileCompleted: true }
    });

    if (dbUser?.profileCompleted) {
      return NextResponse.json({
        success: true,
        data: { 
          claimed: false,
          message: "User already has a completed profile, skipping claim."
        },
      });
    }

    const body = await request.json();
    const parsed = completeProfileSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid guest profile data", details: parsed.error.format() } },
        { status: 400 }
      );
    }

    const updatedProfile = await ProfileService.completeProfile(user.id, parsed.data);

    return NextResponse.json({
      success: true,
      data: { 
        claimed: true,
        profile: updatedProfile 
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }
    console.error("POST /api/profile/claim error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
