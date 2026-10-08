// src/app/(public)/layout.tsx
import { TopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/nav-links";
import { SiteFooter } from "@/components/layout/site-footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 pb-20 lg:pb-0">
      <TopNav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-10">{children}</main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}