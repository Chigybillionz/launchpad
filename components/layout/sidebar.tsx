"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Bookmark,
  Briefcase,
  User,
  Rocket,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Opportunities", href: "/dashboard/opportunities", icon: Compass },
  { label: "Saved", href: "/dashboard/saved", icon: Bookmark },
  { label: "Applications", href: "/dashboard/applications", icon: Briefcase },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

import { useAuth } from "@/lib/auth-context";

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border/60 bg-sidebar md:flex md:flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-5">
        <Rocket className="size-5 text-primary" />
        <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
          Launchpad
        </span>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/60 px-5 py-4 flex flex-col gap-3">
        <button
          onClick={logout}
          className="flex items-center gap-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground"
        >
          <LogOut className="size-4" />
          Log out
        </button>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Launchpad
        </p>
      </div>
    </aside>
  );
}
