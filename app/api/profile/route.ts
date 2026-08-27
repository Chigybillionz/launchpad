import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth";
import { ProfileService } from "@/lib/services/profile.service";
import { updateProfileSchema } from "@/lib/validators";

export async function GET() {
  try {
    const user = await requireAuth();
    const profile = await ProfileService.getProfile(user.id);

    return NextResponse.json({
      success: true,
      data: { profile },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid profile data", details: parsed.error.format() } },
        { status: 400 }
      );
    }

    const updatedProfile = await ProfileService.updateProfile(user.id, parsed.data);

    return NextResponse.json({
      success: true,
      data: { profile: updatedProfile },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }
    console.error("PUT /api/profile error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
