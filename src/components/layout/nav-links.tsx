"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, User } from "lucide-react";
import { useState } from "react";

import { AuthModal } from "@/components/auth/auth-modal";
import { NAV_ITEMS } from "@/lib/constants";
import { useAuth } from "@/lib/local/auth";
import { cn } from "@/lib/utils";

const ICONS = {
  home: Home,
  search: Search,
  plus: PlusCircle,
  user: User,
} as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

const itemClass =
  "-mt-px flex min-h-14 w-full flex-col items-center justify-center gap-0.5 border-t-2 text-xs font-medium";

export function TopNavLinks() {
  const pathname = usePathname();

  return (
    <ul className="hidden items-center gap-2 lg:flex">
      {NAV_ITEMS.slice(0, 3).map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-medium",
                active ? "border-iris text-ink" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-canvas lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.icon];


            if (item.icon === "user") {
              if (user) {
                const active = pathname.startsWith("/beranda");
                return (
                  <li key={item.href}>
                    <Link
                      href="/beranda"
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        itemClass,
                        active ? "border-iris text-iris" : "border-transparent text-muted",
                      )}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                      Saya
                    </Link>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => setAuthOpen(true)}
                    className={cn(
                      itemClass,
                      authOpen ? "border-iris text-iris" : "border-transparent text-muted",
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                    Masuk
                  </button>
                </li>
              );
            }

            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    itemClass,
                    active ? "border-iris text-iris" : "border-transparent text-muted",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode="login" />
    </>
  );
}