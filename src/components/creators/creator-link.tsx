// src/components/creators/creator-link.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";

/** Baris kreator di halaman detail karya. Seluruh baris menuju profil kreator. */
export function CreatorLink({ name, username }: { name: string; username: string }) {
  return (
    <Link
      href={`/creators/${username}`}
      className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-surface"
    >
      <UserAvatar name={name} />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{name}</span>
        <span className="block truncate text-sm text-muted">@{username}</span>
      </span>
      <span className="sr-only">Lihat profil</span>
      <ChevronRight
        className="size-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-ink"
        aria-hidden="true"
      />
    </Link>
  );
}