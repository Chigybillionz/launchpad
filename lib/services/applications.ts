import { Application, ApplicationStatus, Pagination } from "@/types/saved";

export interface ApplicationListResponse {
  items: Application[];
  pagination: Pagination;
}

export interface DashboardStatsResponse {
  saved: number;
  applications: number;
  interviews: number;
  accepted: number;
  recentApplications: Application[];
}

export const ApplicationsService = {
  async getApplications(params: { page?: number; limit?: number; status?: ApplicationStatus | "all" } = {}): Promise<ApplicationListResponse> {
    const searchParams = new URLSearchParams();
    searchParams.set("page", String(params.page || 1));
    searchParams.set("limit", String(params.limit || 10));
    if (params.status && params.status !== "all") searchParams.set("status", params.status);

    const res = await fetch(`/api/applications?${searchParams.toString()}`);
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || "Failed to load applications");
    }

    return json.data;
  },

  async getApplication(id: string): Promise<Application> {
    const res = await fetch(`/api/applications/${id}`);
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || "Failed to load application");
    }

    return json.data.application;
  },

  async createApplication(opportunityId: string): Promise<Application> {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId }),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      const error = new Error(json.error?.message || "Failed to record application");
      error.name = json.error?.code || "APPLICATION_ERROR";
      throw error;
    }

    return json.data.application;
  },

  async updateStatus(id: string, status: ApplicationStatus): Promise<Application> {
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || "Unable to update application status.");
    }

    return json.data.application;
  },

  async getDashboardStats(): Promise<DashboardStatsResponse> {
    const res = await fetch("/api/dashboard/stats");
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || "Failed to load dashboard stats");
    }

    return json.data;
  },
};
