import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AppError } from "../utils/errors";
import { ApiResponse } from "../../types/api";

type RouteHandler = (req: NextRequest, ...args: unknown[]) => Promise<unknown>;

export function apiHandler(handler: RouteHandler) {
  return async (req: NextRequest, ...args: unknown[]): Promise<NextResponse<ApiResponse<unknown>>> => {
    try {
      const data = await handler(req, ...args);
      return NextResponse.json({
        success: true,
        data,
      });
    } catch (error: unknown) {
      console.error("[API Error]", error);

      if (error instanceof AppError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: error.message,
              code: error.code,
            },
          },
          { status: error.statusCode }
        );
      }

      // Handle Zod errors (validation)
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "Validation failed",
              code: "VALIDATION_ERROR",
              details: error.issues,
            },
          },
          { status: 400 }
        );
      }

      // Default error response
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Internal Server Error",
            code: "INTERNAL_SERVER_ERROR",
          },
        },
        { status: 500 }
      );
    }
  };
}
