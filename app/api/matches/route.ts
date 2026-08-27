import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/auth";
import { OpportunityService } from "@/lib/services/opportunity.service";
import { MatchingService } from "@/lib/matching/matching.service";
import { ExplanationService } from "@/lib/matching/explanation.service";
import { opportunityQuerySchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

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

    const { page, limit } = parsed.data;

    // MVP: Load a max limit to calculate and rank in memory
    const maxCandidateLimit = 100;
    
    // Create a modified query for fetching candidates
    const candidateQuery = {
      ...parsed.data,
      page: 1,
      limit: maxCandidateLimit,
    };

    const result = await OpportunityService.getOpportunities(candidateQuery);

    const matches = result.opportunities.map((opportunity) => {
      const match = MatchingService.calculateMatchScore(user, opportunity);
      const recommendationReason = ExplanationService.getRecommendationReason(match);
      return { opportunity, match, recommendationReason };
    });

    // Sort descending by score
    matches.sort((a, b) => b.match.score - a.match.score);

    // Apply pagination in memory
    const startIndex = (page - 1) * limit;
    const paginatedMatches = matches.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: {
        matches: paginatedMatches,
        pagination: {
          page,
          limit,
          total: matches.length,
          totalPages: Math.ceil(matches.length / limit),
        }
      }
    });

  } catch (error) {
    if (error instanceof Error && error.message.includes("Session")) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
    }
    console.error("GET /api/matches error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
