"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Bookmark,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const MOBILE_NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Opportunities", href: "/dashboard/opportunities", icon: Compass },
  { label: "Saved", href: "/dashboard/saved", icon: Bookmark },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 surface-glass md:hidden">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-around px-2">
        {MOBILE_NAV_ITEMS.map((item) => {
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
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "size-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1.5 h-0.5 w-4 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors text-muted-foreground hover:text-foreground"
        >
          <LogOut className="size-5 transition-colors text-muted-foreground" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
