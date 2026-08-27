import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth";
import { ProfileService } from "@/lib/services/profile.service";

export async function GET() {
  try {
    const user = await requireAuth();
    const status = await ProfileService.getProfileStatus(user.id);

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }
    console.error("GET /api/profile/status error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
