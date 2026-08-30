import { requireAdmin } from "@/lib/services/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Card, CardContent } from "@/components/ui/card";

async function getApplications() {
  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const res = await fetch(`${protocol}://${host}/api/admin/applications`, {
    headers: {
      cookie: (await headers()).get("cookie") || "",
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function AdminApplicationsPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/");
  }

  const data = await getApplications();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Applications</h1>
        <p className="text-neutral-400">Review application tracking and status.</p>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-400 uppercase bg-neutral-950/50 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Applicant</th>
                  <th className="px-6 py-4 font-medium">Opportunity</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {data?.applications?.length > 0 ? (
                  data.applications.map((app: { id: string, user: { name: string, email: string }, opportunity: { title: string, organization: string }, status: string, appliedAt: string }) => (
                    <tr key={app.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{app.user.name}</div>
                        <div className="text-xs text-neutral-500">{app.user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-neutral-300">{app.opportunity.title}</div>
                        <div className="text-xs text-neutral-500">{app.opportunity.organization}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-neutral-800 text-neutral-300 px-2 py-1 rounded text-xs border border-neutral-700">
                          {app.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-400">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
