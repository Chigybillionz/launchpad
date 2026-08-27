import type { User } from "@/types";

export const ProfileService = {
  async getProfile(): Promise<User> {
    const res = await fetch("/api/profile");
    const json = await res.json();
    
    if (!res.ok) {
      throw new Error(json.error?.message || "User profile not found");
    }

    return json.data.profile;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    
    if (!res.ok) {
      throw new Error(json.error?.message || "Failed to update profile");
    }

    return json.data.profile;
  },

  async completeProfile(data: Partial<User>): Promise<User> {
    const res = await fetch("/api/profile/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    
    if (!res.ok) {
      throw new Error(json.error?.message || "Failed to complete profile");
    }

    return json.data.profile;
  },

  async getProfileStatus(): Promise<{ profileCompleted: boolean }> {
    const res = await fetch("/api/profile/status");
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error?.message || "Failed to get profile status");
    }

    return json.data;
  }
};
