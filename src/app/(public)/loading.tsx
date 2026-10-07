// src/app/(public)/loading.tsx
import { gridClass } from "@/components/projects/project-grid";

export default function Loading() {
  return (
    <div className={gridClass} aria-busy="true" aria-label="Memuat galeri">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border border-line bg-canvas">
          <div className="aspect-[4/3] animate-pulse bg-surface" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-1/3 animate-pulse bg-line" />
            <div className="h-6 w-3/4 animate-pulse bg-line" />
          </div>
        </div>
      ))}
    </div>
  );
}