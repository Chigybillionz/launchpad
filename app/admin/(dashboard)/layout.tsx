import { requireAdminPage } from "@/lib/services/auth";
import Link from "next/link";
import { LayoutDashboard, Users, Briefcase, FileText, ArrowLeft } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminPage();

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900 flex flex-col">
        <div className="p-6 border-b border-neutral-800">
          <Link href="/" className="text-sm text-neutral-400 hover:text-white flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to App
          </Link>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Admin Panel
          </h2>
          <p className="text-xs text-neutral-500 mt-1">Logged in as {user.name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-800 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-neutral-400" />
            <span>Overview</span>
          </Link>
          <Link href="/admin/opportunities" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-800 transition-colors">
            <Briefcase className="w-5 h-5 text-neutral-400" />
            <span>Opportunities</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-800 transition-colors">
            <Users className="w-5 h-5 text-neutral-400" />
            <span>Users</span>
          </Link>
          <Link href="/admin/applications" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-800 transition-colors">
            <FileText className="w-5 h-5 text-neutral-400" />
            <span>Applications</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-neutral-950">
        {children}
      </main>
    </div>
  );
}
