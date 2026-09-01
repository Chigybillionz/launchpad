import { requireAdminPage } from "@/lib/services/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, User, Briefcase, MapPin, Target, CheckCircle2, Bookmark, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationStatusBadge } from "@/components/applications/application-status-badge";

async function getUser(id: string) {
  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const res = await fetch(`${protocol}://${host}/api/admin/users/${id}`, {
    headers: {
      cookie: (await headers()).get("cookie") || "",
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <Link href="/admin/users" className="flex items-center text-sm text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
        </Link>
        <Card className="bg-neutral-900 border-neutral-800 p-8 text-center">
          <p className="text-neutral-400">User not found.</p>
        </Card>
      </div>
    );
  }

  const applicationsCount = user.applications?.length || 0;
  const savedCount = user.savedOpportunities?.length || 0;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <Link href="/admin/users" className="flex items-center text-sm text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{user.name}</h1>
            <p className="text-neutral-400">{user.email}</p>
          </div>
          <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"}>
            {user.role}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Basic Info & Profile Details */}
        <div className="space-y-6">
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Profile Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-neutral-300">
                <Briefcase className="w-4 h-4 mr-3 text-neutral-500" />
                <span className="capitalize">{user.experienceLevel?.toLowerCase()} Level</span>
              </div>
              <div className="flex items-center text-sm text-neutral-300">
                <MapPin className="w-4 h-4 mr-3 text-neutral-500" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center text-sm text-neutral-300">
                <CheckCircle2 className="w-4 h-4 mr-3 text-neutral-500" />
                <span>Profile {user.profileCompleted ? "Completed" : "Incomplete"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Goals</CardTitle>
            </CardHeader>
            <CardContent>
              {user.goals?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.goals.map((g: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">{g}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No goals set.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              {user.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((s: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">{s}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No skills listed.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Activity */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-neutral-400">Applications</p>
                    <p className="text-3xl font-bold text-white mt-1">{applicationsCount}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <Activity className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-neutral-400">Saved Roles</p>
                    <p className="text-3xl font-bold text-white mt-1">{savedCount}</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Bookmark className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Recent Applications</CardTitle>
              <CardDescription>A summary of what this user has applied to.</CardDescription>
            </CardHeader>
            <CardContent>
              {user.applications?.length > 0 ? (
                <div className="space-y-4">
                  {user.applications.slice(0, 5).map((app: { id: string, status: string, appliedAt: string | Date, opportunity?: { title: string, organization: string } }) => (
                    <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-neutral-950 border border-neutral-800 gap-4">
                      <div>
                        <h4 className="font-medium text-white">{app.opportunity?.title}</h4>
                        <p className="text-sm text-neutral-400">{app.opportunity?.organization}</p>
                        <p className="text-xs text-neutral-500 mt-1">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                      <ApplicationStatusBadge status={app.status} />
                    </div>
                  ))}
                  {user.applications.length > 5 && (
                    <p className="text-sm text-center text-neutral-500 pt-2">
                      + {user.applications.length - 5} older applications
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 border border-dashed border-neutral-800 rounded-lg">
                  <p className="text-neutral-500 text-sm">No applications found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
