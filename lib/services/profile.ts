import type { User } from "@/types";

const STORAGE_KEY = "launchpad_user";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ProfileService = {
  async getProfile(_userId?: string): Promise<User> {
    void _userId;
    await delay(600); // Simulate network latency

    if (typeof window === "undefined") {
      throw new Error("Cannot fetch profile on server without DB connection");
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      throw new Error("User profile not found");
    }

    return JSON.parse(raw) as User;
  },

  async updateProfile(_userId: string | undefined, data: Partial<User>): Promise<User> {
    void _userId;
    await delay(800); // Simulate network latency

    if (typeof window === "undefined") {
      throw new Error("Cannot update profile on server without DB connection");
    }

    const user = await this.getProfile(_userId);
    const updatedUser = { ...user, ...data };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  }
};
