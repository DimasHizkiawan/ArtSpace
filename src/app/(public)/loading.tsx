// src/app/(public)/loading.tsx
import { cardGrid } from "@/components/ui/card-styles";

export default function Loading() {
  return (
    <div role="status" aria-busy="true" aria-label="Memuat galeri" className={cardGrid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-surface" />
      ))}
    </div>
  );
}