import { requireAdmin } from "@/lib/services/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

async function getOpportunities() {
  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const res = await fetch(`${protocol}://${host}/api/admin/opportunities`, {
    headers: {
      cookie: (await headers()).get("cookie") || "",
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function AdminOpportunitiesPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/");
  }

  const data = await getOpportunities();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Opportunities</h1>
          <p className="text-neutral-400">Manage jobs, internships, hackathons, and more.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Opportunity
        </Button>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-400 uppercase bg-neutral-950/50 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Organization</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Deadline</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {data?.opportunities?.length > 0 ? (
                  data.opportunities.map((opp: { id: string, title: string, organization: string, type: string, deadline: string }) => (
                    <tr key={opp.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{opp.title}</td>
                      <td className="px-6 py-4 text-neutral-300">{opp.organization}</td>
                      <td className="px-6 py-4">
                        <span className="bg-neutral-800 text-neutral-300 px-2 py-1 rounded text-xs">
                          {opp.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-400">
                        {new Date(opp.deadline).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/opportunities/${opp.id}`} target="_blank">
                            <Button variant="outline" size="sm" className="h-8 border-neutral-700 text-neutral-300 hover:bg-neutral-800">
                              View
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" className="h-8 border-neutral-700 text-neutral-300 hover:bg-neutral-800">
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                      No opportunities found.
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
