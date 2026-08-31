import { requireAdminPage } from "@/lib/services/auth";
import { headers } from "next/headers";
import { Card, CardContent } from "@/components/ui/card";

async function getUsers() {
  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const res = await fetch(`${protocol}://${host}/api/admin/users`, {
    headers: {
      cookie: (await headers()).get("cookie") || "",
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function AdminUsersPage() {
  await requireAdminPage();

  const data = await getUsers();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Users</h1>
        <p className="text-neutral-400">Manage platform users.</p>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-400 uppercase bg-neutral-950/50 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {data?.users?.length > 0 ? (
                  data.users.map((u: { id: string, name: string, email: string, role: string, createdAt: string }) => (
                    <tr key={u.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{u.name}</td>
                      <td className="px-6 py-4 text-neutral-300">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${u.role === "ADMIN" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-neutral-800 text-neutral-300"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                      No users found.
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
