// src/app/error.tsx
"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-4xl">Terjadi kesalahan</h1>
      <p className="text-muted">Halaman gagal dimuat. Periksa koneksi lalu coba lagi.</p>
      <Button type="button" onClick={reset}>
        Coba lagi
      </Button>
    </main>
  );
}