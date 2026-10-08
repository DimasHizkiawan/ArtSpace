// src/components/projects/local-project-view.tsx
// Halaman detail untuk karya yang diunggah pengguna (datanya hanya ada di browser).
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { DISCIPLINES } from "@/lib/constants";
import { toProject, useLocalProjects } from "@/lib/local/projects";
import { useHydrated } from "@/lib/local/store";
import { CommentSection } from "./comment-section";
import { ProjectActions } from "./project-actions";
import { ProjectCover } from "./project-cover";

export function LocalProjectView({ slug }: { slug: string }) {
  const hydrated = useHydrated();
  const found = useLocalProjects().find((p) => p.slug === slug);

  if (!hydrated) {
    return <div aria-busy="true" aria-label="Memuat karya" className="h-96 animate-pulse rounded-3xl bg-surface" />;
  }

  if (!found) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <h1 className="font-display text-4xl">Karya tidak ditemukan</h1>
        <p className="text-muted">
          Karya ini tidak ada, atau diunggah dari browser lain. Karya unggahan hanya tersimpan di
          browser tempat ia dibuat.
        </p>
        <ButtonLink href="/">Kembali ke galeri</ButtonLink>
      </div>
    );
  }

  const project = toProject(found);
  const label = DISCIPLINES.find((d) => d.value === found.discipline)?.label ?? "";

  return (
    <div className="space-y-12 pb-10">
      <Link
        href="/beranda"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Kembali ke beranda
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="overflow-hidden rounded-3xl border border-line">
          <ProjectCover project={project} natural priority sizes="(min-width: 1024px) 60vw, 100vw" />
        </div>

        <aside className="space-y-6 rounded-2xl border border-line bg-canvas p-5 lg:sticky lg:top-24">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              {label} · {found.year}
            </p>
            <h1 className="font-display text-3xl leading-tight">{found.title}</h1>
            <p className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-bold text-canvas"
              >
                {found.creatorName.charAt(0)}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{found.creatorName}</span>
                <span className="block text-sm text-muted">@{found.creatorUsername}</span>
              </span>
            </p>
          </div>
          <ProjectActions projectId={found.id} likes={0} />
        </aside>
      </div>

      <section aria-labelledby="tentang-karya" className="max-w-3xl space-y-4">
        <h2 id="tentang-karya" className="font-display text-3xl">
          Tentang karya
        </h2>
        <p className="whitespace-pre-line text-base leading-7">{found.description}</p>
      </section>

      <CommentSection projectId={found.id} />
    </div>
  );
}