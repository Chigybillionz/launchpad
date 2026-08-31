import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Image src="/images/logo.jpg" alt="Launchpad Logo" width={20} height={20} className="rounded-full grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
          <span>Launchpad</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link
            href="/"
            className="transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Launchpad. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
