import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export const ProfileService = {
  async getProfile(userId: string): Promise<Omit<User, "passwordHash">> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Profile not found");
    }

    const { passwordHash, ...profile } = user;
    void passwordHash; // Explicitly ignore
    return profile;
  },

  async updateProfile(userId: string, data: Partial<Omit<User, "id" | "email" | "passwordHash" | "createdAt">>): Promise<Omit<User, "passwordHash">> {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    const { passwordHash, ...profile } = updatedUser;
    void passwordHash; // Explicitly ignore
    return profile;
  },

  async completeProfile(userId: string, data: Partial<Omit<User, "id" | "email" | "passwordHash" | "createdAt">>): Promise<Omit<User, "passwordHash">> {
    return this.updateProfile(userId, {
      ...data,
      profileCompleted: true,
    });
  },

  async getProfileStatus(userId: string): Promise<{ profileCompleted: boolean }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profileCompleted: true },
    });

    if (!user) {
      throw new Error("Profile not found");
    }

    return { profileCompleted: user.profileCompleted };
  },
};
