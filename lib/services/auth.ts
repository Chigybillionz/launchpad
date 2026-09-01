import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { UnauthorizedError, ForbiddenError } from "@/lib/utils/errors";

const SESSION_COOKIE_NAME = "launchpad_session";
const SESSION_EXPIRATION_DAYS = 30;

export async function createSession(userId: string) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRATION_DAYS);

  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return session;
}

export async function clearSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    try {
      await prisma.session.delete({
        where: { id: sessionId },
      });
    } catch {
      // Ignore if session already doesn't exist
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    throw new UnauthorizedError("Authentication required.");
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          experienceLevel: true,
          location: true,
          skills: true,
          interests: true,
          goals: true,
          workPreferences: true,
          avatarUrl: true,
          profileCompleted: true,
          createdAt: true,
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    throw new UnauthorizedError("Session expired or invalid.");
  }

  return session.user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new ForbiddenError("Admin authorization required.");
  }
  return user;
}

import { redirect } from "next/navigation";

export async function requireAdminPage() {
  try {
    return await requireAdmin();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect("/admin/login");
    } else if (error instanceof ForbiddenError) {
      redirect("/dashboard");
    }
    redirect("/admin/login");
  }
}

export async function getCurrentUser() {
  try {
    return await requireAuth();
  } catch {
    return null;
  }
}
