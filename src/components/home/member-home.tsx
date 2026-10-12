// src/components/home/member-home.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { LoginGate } from "@/components/auth/login-gate";
import { ProjectCard } from "@/components/projects/project-card";
import { cardGrid } from "@/components/ui/card-styles";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useUserActivity } from "@/lib/local/activity";
import { useAuth } from "@/lib/local/auth";
import {
  deleteLocalProject,
  toProject,
  useAllProjects,
  useLocalProjects,
} from "@/lib/local/projects";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

type Tab = "semua" | "tersimpan" | "saya";

const TABS: { value: Tab; label: string }[] = [
  { value: "semua", label: "Beranda" },
  { value: "tersimpan", label: "Tersimpan" },
  { value: "saya", label: "Karya saya" },
];

const EMPTY_TEXT: Record<Tab, { title: string; body: string }> = {
  semua: { title: "Belum ada karya", body: "Karya akan muncul di sini." },
  tersimpan: {
    title: "Belum ada karya tersimpan",
    body: "Tekan ikon penanda di kartu karya untuk menyimpannya ke sini.",
  },
  saya: {
    title: "Kamu belum mengunggah karya",
    body: "Unggah karya pertamamu agar tampil di beranda dan bisa dikomentari.",
  },
};

const subtleLink = "font-semibold text-iris underline-offset-4 hover:underline";

export function MemberHome({ serverProjects }: { serverProjects: Project[] }) {
  const { user, ready } = useAuth();
  const all = useAllProjects(serverProjects);
  const local = useLocalProjects();
  const { likedIds, savedIds } = useUserActivity();
  const [tab, setTab] = useState<Tab>("semua");

  if (!ready) {
    return <div aria-busy="true" aria-label="Memuat beranda" className="h-40 animate-pulse rounded-2xl bg-surface" />;
  }

  if (!user) {
    return (
      <LoginGate
        title="Masuk untuk membuka beranda"
        body="Setelah masuk, kamu bisa menyukai, menyimpan, mengomentari, dan mengunggah karya."
      />
    );
  }

  const mine = local.filter((p) => p.creatorId === user.id);
  const savedList = all.filter((p) => savedIds.has(p.id));
  const likedCount = all.filter((p) => likedIds.has(p.id)).length;

  // Angka kecil di samping nama tab, bukan kotak statistik besar.
  const counts: Record<Tab, number | null> = {
    semua: null,
    tersimpan: savedList.length,
    saya: mine.length,
  };

  function handleDelete(id: string, title: string) {
    if (window.confirm(`Hapus karya “${title}”? Tindakan ini tidak bisa dibatalkan.`)) {
      deleteLocalProject(id);
    }
  }

  const list: Project[] =
    tab === "semua" ? all : tab === "tersimpan" ? savedList : mine.map(toProject);
  const empty = EMPTY_TEXT[tab];

  return (
    <div className="space-y-8 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar name={user.name} src={user.avatar} size="md" />
          <div className="min-w-0">
            <h1 className="font-display text-3xl leading-tight">Halo, {user.name.split(" ")[0]}.</h1>
            <p className="text-sm text-muted">
              @{user.username} · {likedCount} karya kamu sukai ·{" "}
              <Link href="/profil" className={subtleLink}>
                Edit profil
              </Link>
              {" · "}
              <Link href={`/creators/${user.username}`} className={subtleLink}>
                Lihat profil
              </Link>
            </p>
          </div>
        </div>
        <Link
          href="/studio/projects/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-canvas hover:opacity-90"
        >
          <Plus className="size-4" aria-hidden="true" />
          Unggah karya
        </Link>
      </header>

      <section aria-label="Daftar karya" className="space-y-5">
        <div role="group" aria-label="Pilih tampilan" className="flex gap-2 border-b border-line">
          {TABS.map((t) => {
            const count = counts[t.value];
            return (
              <button
                key={t.value}
                type="button"
                aria-pressed={tab === t.value}
                onClick={() => setTab(t.value)}
                className={cn(
                  "-mb-px inline-flex min-h-11 items-center gap-1.5 border-b-2 px-3 text-sm font-medium",
                  tab === t.value
                    ? "border-iris text-ink"
                    : "border-transparent text-muted hover:text-ink",
                )}
              >
                {t.label}
                {count !== null ? (
                  <span aria-label={`${count} karya`} className="text-xs text-muted">
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <p role="status" className="text-sm text-muted">
          {list.length} karya
        </p>

        {list.length === 0 ? (
          <div className="flex flex-col items-center gap-3 border border-dashed border-line bg-surface px-6 py-16 text-center">
            <h2 className="font-display text-3xl">{empty.title}</h2>
            <p className="max-w-sm text-muted">{empty.body}</p>
            {tab === "saya" ? (
              <Link
                href="/studio/projects/new"
                className="mt-2 inline-flex min-h-11 items-center rounded-xl border border-ink px-5 text-sm font-semibold hover:bg-ink hover:text-canvas"
              >
                Unggah karya
              </Link>
            ) : null}
          </div>
        ) : (
          <ul className={cardGrid}>
            {list.map((p) => (
              <li key={p.slug} className="space-y-2">
                <ProjectCard project={p} />
                {tab === "saya" ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id, p.title)}
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-berry"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Hapus karya
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}