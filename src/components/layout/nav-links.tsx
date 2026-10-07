"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  PlusCircle,
  User,
} from "lucide-react";
import { useState } from "react";

import { AuthModal } from "@/components/auth/auth-modal";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS = {
  home: Home,
  search: Search,
  plus: PlusCircle,
  user: User,
} as const;

function isActive(
  pathname: string,
  href: string,
) {
  return href === "/"
    ? pathname === "/"
    : pathname.startsWith(href);
}

export function TopNavLinks() {
  const pathname = usePathname();

  const [authOpen, setAuthOpen] =
    useState(false);

  const [authMode, setAuthMode] =
    useState<"login" | "signup">("login");

  function openAuth(
    mode: "login" | "signup",
  ) {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  return (
    <>
      <ul className="hidden items-center gap-2 lg:flex">
        {NAV_ITEMS.slice(0, 3).map(
          (item) => {
            const active = isActive(
              pathname,
              item.href,
            );

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={
                    active ? "page" : undefined
                  }
                  className={cn(
                    "inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-medium",
                    active
                      ? "border-iris text-ink"
                      : "border-transparent text-muted hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          },
        )}


        {/* <li>
          <button
            type="button"
            onClick={() =>
              openAuth("signup")
            }
            className="inline-flex min-h-11 items-center rounded-md bg-iris px-4 text-sm font-semibold text-on-accent hover:brightness-90"
          >
            Daftar
          </button>
        </li> */}
      </ul>

      <AuthModal
        open={authOpen}
        onClose={() =>
          setAuthOpen(false)
        }
        initialMode={authMode}
      />
    </>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  const [authOpen, setAuthOpen] =
    useState(false);

  return (
    <>
      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-canvas lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {NAV_ITEMS.map((item) => {
            const Icon =
              ICONS[item.icon];

            const active = isActive(
              pathname,
              item.href,
            );

            const isProfile =
              item.icon === "user";

            return (
              <li key={item.href}>
                {isProfile ? (
                  <button
                    type="button"
                    onClick={() =>
                      setAuthOpen(true)
                    }
                    className={cn(
                      "-mt-px flex min-h-14 w-full flex-col items-center justify-center gap-0.5 border-t-2 text-xs font-medium",
                      authOpen
                        ? "border-iris text-iris"
                        : "border-transparent text-muted",
                    )}
                  >
                    <Icon
                      className="size-5"
                      aria-hidden="true"
                    />

                    Profil
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={
                      active
                        ? "page"
                        : undefined
                    }
                    className={cn(
                      "-mt-px flex min-h-14 flex-col items-center justify-center gap-0.5 border-t-2 text-xs font-medium",
                      active
                        ? "border-iris text-iris"
                        : "border-transparent text-muted",
                    )}
                  >
                    <Icon
                      className="size-5"
                      aria-hidden="true"
                    />

                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <AuthModal
        open={authOpen}
        onClose={() =>
          setAuthOpen(false)
        }
        initialMode="login"
      />
    </>
  );
}