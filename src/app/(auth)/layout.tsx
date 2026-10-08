// src/app/(auth)/layout.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-surface px-4 py-6 sm:px-6">
      {/* Bola warna halus, sama seperti hero di home */}
      <div
        className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-iris/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-28 -left-16 size-64 rounded-full bg-berry/10 blur-3xl"
        aria-hidden="true"
      />

      <header className="relative mx-auto flex w-full max-w-md items-center justify-between gap-4">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 font-display text-2xl">
          <span aria-hidden="true" className="size-3 rounded-full bg-berry" />
          ArtSpace
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke galeri
        </Link>
      </header>

      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8 sm:py-10">
        <div className="rounded-2xl border border-line bg-canvas p-5 shadow-sm sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}