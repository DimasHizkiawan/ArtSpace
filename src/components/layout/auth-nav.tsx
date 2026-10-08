// src/components/layout/auth-nav.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut } from "lucide-react";
import { logOut, useAuth } from "@/lib/local/auth";

export function AuthNav() {
  const router = useRouter();
  const { user, ready } = useAuth();

  // Tempat kosong seukuran tombol, supaya header tidak bergeser saat data terbaca.
  if (!ready) return <span aria-hidden="true" className="inline-block h-10 w-24" />;

  if (!user) {
    return (
      <Link
        href="/masuk"
        className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-canvas hover:opacity-90"
      >
        <LogIn className="size-4" aria-hidden="true" />
        <span>Masuk</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/beranda"
        aria-label={`Beranda ${user.name}`}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm font-semibold hover:border-ink"
      >
        <span
          aria-hidden="true"
          className="grid size-6 place-items-center rounded-full bg-ink text-xs font-bold text-canvas"
        >
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:inline">Beranda</span>
      </Link>
      <button
        type="button"
        onClick={() => {
          logOut();
          router.push("/");
        }}
        aria-label="Keluar"
        className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted hover:text-ink"
      >
        <LogOut className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Keluar</span>
      </button>
    </div>
  );
}