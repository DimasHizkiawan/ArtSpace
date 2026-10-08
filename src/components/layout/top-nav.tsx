// src/components/layout/top-nav.tsx
import Link from "next/link";
import { AuthNav } from "./auth-nav";
import { TopNavLinks } from "./nav-links";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl">
          <span aria-hidden="true" className="size-3 rounded-full bg-berry" /> ArtSpace
        </Link>
        <nav aria-label="Navigasi atas" className="flex items-center gap-2">
          <TopNavLinks />
          <AuthNav />
        </nav>
      </div>
    </header>
  );
}