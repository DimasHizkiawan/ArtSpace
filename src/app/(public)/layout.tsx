// src/app/(public)/layout.tsx
import { TopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/nav-links";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-slate-50 pb-20 lg:pb-0">
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">{children}</main>
      <BottomNav />
    </div>
  );
}