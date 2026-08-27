import { NextResponse } from "next/server";
import { clearSession } from "@/lib/services/auth";

export async function POST() {
  try {
    await clearSession();

    return NextResponse.json({
      success: true,
      data: {
        message: "Logged out successfully",
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred.",
        },
      },
      { status: 500 }
    );
  }
}
