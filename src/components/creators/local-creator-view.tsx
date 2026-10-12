// src/components/creators/local-creator-view.tsx
// Profil publik untuk akun yang dibuat di browser ini (datanya ada di localStorage).
"use client";

import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { EmptyState } from "@/components/feedback/empty-state";
import { ProjectGrid } from "@/components/projects/project-grid";
import { SocialLinks } from "@/components/profile/social-links";
import { ButtonLink } from "@/components/ui/button-link";
import { UserAvatar } from "@/components/ui/user-avatar";
import { disciplineName } from "@/lib/constants";
import { useAuth, useUserByUsername } from "@/lib/local/auth";
import { toProject, useLocalProjects } from "@/lib/local/projects";
import { useHydrated } from "@/lib/local/store";

export function LocalCreatorView({ username }: { username: string }) {
  const hydrated = useHydrated();
  const creator = useUserByUsername(username);
  const { user: me } = useAuth();
  const projects = useLocalProjects()
    .filter((p) => p.creatorId === creator?.id)
    .map(toProject);

  if (!hydrated) {
    return <div aria-busy="true" aria-label="Memuat profil" className="h-64 animate-pulse rounded-3xl bg-surface" />;
  }

  if (!creator) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <h1 className="font-display text-4xl">Kreator tidak ditemukan</h1>
        <p className="text-muted">
          Profil ini tidak ada, atau dibuat dari browser lain. Akun hanya tersimpan di browser
          tempat ia dibuat.
        </p>
        <ButtonLink href="/explore">Buka Eksplorasi</ButtonLink>
      </div>
    );
  }

  const meta = [disciplineName(creator.discipline), creator.location].filter(Boolean).join(" di ");

  return (
    <div className="space-y-10 pb-10">
      <Link
        href="/explore"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Kembali
      </Link>

      <section className="rounded-[2rem] border border-line bg-surface p-6 sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <UserAvatar name={creator.name} src={creator.avatar} size="lg" />
          <div className="min-w-0 space-y-3">
            <div>
              <p className="text-sm text-muted">@{creator.username}</p>
              <h1 className="font-display text-4xl">{creator.name}</h1>
              {meta ? <p className="mt-1 text-sm text-muted">{meta}</p> : null}
            </div>
            {creator.bio ? (
              <p className="max-w-xl whitespace-pre-line text-sm leading-6">{creator.bio}</p>
            ) : null}
            <SocialLinks links={creator.links} />
            {me?.id === creator.id ? (
              <Link
                href="/profil"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-iris hover:underline"
              >
                <Pencil className="size-4" aria-hidden="true" /> Edit profil
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section aria-labelledby="karya-kreator" className="space-y-4">
        <h2 id="karya-kreator" className="font-display text-3xl">
          Karya {creator.name}
        </h2>
        {projects.length === 0 ? (
          <EmptyState
            title="Belum ada karya"
            description={`${creator.name} belum mengunggah karya.`}
            actionHref="/explore"
            actionLabel="Buka Eksplorasi"
          />
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </section>
    </div>
  );
}