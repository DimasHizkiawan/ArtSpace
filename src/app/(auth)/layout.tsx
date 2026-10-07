// src/app/(auth)/layout.tsx
import Link from "next/link";
import { CoverArt } from "@/components/projects/cover-art";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-canvas lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 sm:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl">
          <span aria-hidden="true" className="size-3 rounded-full bg-berry" />
          ArtSpace
        </Link>
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          {children}
        </main>
      </div>

      <aside
        aria-hidden="true"
        className="hidden flex-col justify-center gap-8 border-l border-line bg-surface p-12 lg:flex"
      >
        <div className="grid max-w-md grid-cols-2 gap-3">
          <CoverArt tone="iris" shape="circles" className="col-span-2 aspect-[16/9]" />
          <CoverArt tone="berry" shape="arc" />
          <CoverArt tone="cobalt" shape="bars" />
        </div>
    
      </aside>
    </div>
  );
}