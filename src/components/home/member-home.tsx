// src/components/home/member-home.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { AuthModal } from "@/components/auth/auth-modal";
import { ProjectCard } from "@/components/projects/project-card";
import { cardGrid } from "@/components/ui/card-styles";
import { Button } from "@/components/ui/button";
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

export function MemberHome({ serverProjects }: { serverProjects: Project[] }) {
  const { user, ready } = useAuth();
  const all = useAllProjects(serverProjects);
  const local = useLocalProjects();
  const { likedIds, savedIds } = useUserActivity();
  const [tab, setTab] = useState<Tab>("semua");
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  if (!ready) {
    return <div aria-busy="true" aria-label="Memuat beranda" className="h-64 animate-pulse rounded-3xl bg-surface" />;
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <h1 className="font-display text-4xl">Masuk untuk membuka beranda</h1>
        <p className="text-muted">
          Setelah masuk, kamu bisa menyukai, menyimpan, mengomentari, dan mengunggah karya.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={() => setAuthMode("login")}>
            Masuk
          </Button>
          <Button type="button" variant="outline" onClick={() => setAuthMode("signup")}>
            Daftar
          </Button>
        </div>
        <AuthModal
          open={authMode !== null}
          initialMode={authMode ?? "login"}
          onClose={() => setAuthMode(null)}
        />
      </div>
    );
  }

  const mine = local.filter((p) => p.creatorId === user.id);
  const savedList = all.filter((p) => savedIds.has(p.id));
  const likedCount = all.filter((p) => likedIds.has(p.id)).length;

  const stats = [
    { label: "Karya saya", value: mine.length },
    { label: "Tersimpan", value: savedList.length },
    { label: "Disukai", value: likedCount },
  ];

  function handleDelete(id: string, title: string) {
    if (window.confirm(`Hapus karya “${title}”? Tindakan ini tidak bisa dibatalkan.`)) {
      deleteLocalProject(id);
    }
  }

  const list: Project[] =
    tab === "semua" ? all : tab === "tersimpan" ? savedList : mine.map(toProject);
  const empty = EMPTY_TEXT[tab];

  return (
    <div className="space-y-10 pb-8">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            Halo, {user.name.split(" ")[0]}.
          </h1>
          <p className="mt-2 text-muted">Lihat karya terbaru, atau tambahkan karyamu sendiri.</p>
        </div>
        <Link
          href="/studio/projects/new"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink px-5 font-semibold text-canvas hover:opacity-90"
        >
          <Plus className="size-4" aria-hidden="true" />
          Unggah karya
        </Link>
      </header>

      <dl className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-canvas">
        {stats.map((s) => (
          <div key={s.label} className="px-4 py-4 sm:px-6">
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className="font-display text-3xl">{s.value}</dd>
          </div>
        ))}
      </dl>

      <section aria-label="Daftar karya" className="space-y-5">
        <div role="group" aria-label="Pilih tampilan" className="flex gap-2 border-b border-line">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={tab === t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                "-mb-px inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-medium",
                tab === t.value
                  ? "border-iris text-ink"
                  : "border-transparent text-muted hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
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