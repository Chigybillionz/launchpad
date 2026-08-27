import { NextResponse } from "next/server";
import { OpportunityService } from "@/lib/services/opportunity.service";
// import { updateOpportunitySchema } from "@/lib/validators";
import { requireAuth } from "@/lib/services/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const opportunity = await OpportunityService.getOpportunityById(id);

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Opportunity not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { opportunity },
    });
  } catch (error) {
    console.error("GET /api/opportunities/[id] error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

export async function PUT(_request: Request, { params: _params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();

    // Placeholder Admin check
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Admin authorization required to update opportunities." } },
      { status: 403 }
    );

    /* Future implementation
    const body = await request.json();
    const parsed = updateOpportunitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid data", details: parsed.error.format() } }, { status: 400 });
    }
    const updated = await OpportunityService.updateOpportunity(params.id, parsed.data);
    return NextResponse.json({ success: true, data: { opportunity: updated } });
    */
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }
    console.error("PUT /api/opportunities/[id] error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params: _params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();

    // Placeholder Admin check
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Admin authorization required to delete opportunities." } },
      { status: 403 }
    );

    /* Future implementation
    await OpportunityService.deleteOpportunity(params.id);
    return NextResponse.json({ success: true, data: { deleted: true } });
    */
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }
    console.error("DELETE /api/opportunities/[id] error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
  }
}
