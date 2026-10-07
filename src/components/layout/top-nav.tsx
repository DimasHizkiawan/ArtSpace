// src/components/layout/top-nav.tsx

import Link from "next/link";
import { LogIn } from "lucide-react";
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
          <Link href="/masuk" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-canvas hover:opacity-90">
            <LogIn className="size-4" aria-hidden="true" />
            <span>Masuk</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
