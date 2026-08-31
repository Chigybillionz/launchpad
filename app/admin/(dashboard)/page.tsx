import { requireAdminPage } from "@/lib/services/auth";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Briefcase, FileText, CheckCircle, Target } from "lucide-react";
import { headers } from "next/headers";

async function getAdminStats() {
  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const res = await fetch(`${protocol}://${host}/api/admin/stats`, {
    headers: {
      cookie: (await headers()).get("cookie") || "",
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

async function getOpportunityStats() {
  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const res = await fetch(`${protocol}://${host}/api/admin/opportunities?analytics=true`, {
    headers: {
      cookie: (await headers()).get("cookie") || "",
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function AdminDashboardPage() {
  await requireAdminPage();

  const [stats, oppStats] = await Promise.all([getAdminStats(), getOpportunityStats()]);

  if (!stats) {
    return <div className="p-8 text-neutral-400">Failed to load statistics.</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Overview</h1>
        <p className="text-neutral-400">Platform metrics and analytics at a glance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Total Users</CardTitle>
            <Users className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.users}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Opportunities</CardTitle>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.opportunities}</div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Total Applications</CardTitle>
            <FileText className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.applications}</div>
            <p className="text-xs text-neutral-500 mt-1">+{stats.applicationsThisWeek} this week</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Accepted</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.acceptedApplications}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Opportunity Types */}
        <Card className="bg-neutral-900 border-neutral-800 col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Opportunities by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {oppStats?.opportunitiesByType?.length > 0 ? (
              <div className="space-y-4">
                {oppStats.opportunitiesByType.map((t: { type: string, count: number }) => (
                  <div key={t.type} className="flex items-center justify-between">
                    <span className="text-sm text-neutral-300 capitalize">{t.type.toLowerCase()}</span>
                    <span className="text-sm font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">{t.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-neutral-500">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card className="bg-neutral-900 border-neutral-800 col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-white">Top Requested Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {oppStats?.topSkills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {oppStats.topSkills.map((s: { skill: string, count: number }) => (
                  <div key={s.skill} className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-full">
                    <span className="text-sm text-neutral-300">{s.skill}</span>
                    <span className="text-xs text-neutral-500 bg-neutral-800 px-1.5 rounded-full">{s.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-neutral-500">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
