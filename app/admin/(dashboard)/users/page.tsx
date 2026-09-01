import { requireAdminPage } from "@/lib/services/auth";
import { headers } from "next/headers";
import { UsersTable } from "@/components/admin/users-table";

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

      <UsersTable initialUsers={data?.users || []} />
    </div>
  );
}
