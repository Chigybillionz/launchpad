import { NextResponse } from "next/server";
import { OpportunityService } from "@/lib/services/opportunity.service";
import { opportunityQuerySchema, createOpportunitySchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/services/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    // Normalize type parameter casing to match Zod ENUM if present
    if (query.type) {
      query.type = query.type.toUpperCase().replace(/\s+/g, '_');
    }
    if (query.experienceLevel) {
      query.experienceLevel = query.experienceLevel.toUpperCase();
    }

    const parsed = opportunityQuerySchema.safeParse(query);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid query parameters", details: parsed.error.format() } },
        { status: 400 }
      );
    }

    const result = await OpportunityService.getOpportunities(parsed.data);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("GET /api/opportunities error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const parsed = createOpportunitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid opportunity data", details: parsed.error.format() } },
        { status: 400 }
      );
    }

    const opportunity = await OpportunityService.createOpportunity(parsed.data);
    return NextResponse.json({ success: true, data: { opportunity } }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Admin authorization required")) {
      return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Forbidden" } }, { status: 403 });
    }
    if (error instanceof Error && error.message.includes("Authentication required")) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }
    console.error("POST /api/opportunities error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
  }
}
