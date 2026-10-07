"use client";

import Link from "next/link";
import { Bookmark, Heart } from "lucide-react";
import { useState } from "react";
import { DISCIPLINES } from "@/lib/constants";
import type { Project } from "@/types/project";
import { CoverArt } from "./cover-art";
import { AuthModal, type AuthAction } from "@/components/auth/auth-modal";

export function ProjectCard({ project }: { project: Project }) {
  const label = DISCIPLINES.find((d) => d.value === project.discipline)?.label;
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [authAction, setAuthAction] = useState<AuthAction | null>(null);

  function requireAuth(action: AuthAction) {
    setAuthAction(action);
  }

  return (
    <>
      <article className="group relative overflow-hidden rounded-2xl border border-line bg-canvas transition duration-200 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative">
          <CoverArt tone={project.tone} shape={project.shape} className="transition duration-300 group-hover:scale-[1.02]" />
          <div className="absolute right-3 top-3 flex gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={() => requireAuth("save")}
              aria-label={saved ? "Karya tersimpan" : "Simpan karya"}
              aria-pressed={saved}
              className="grid size-10 place-items-center rounded-full border border-white/50 bg-canvas/90 shadow-sm backdrop-blur hover:bg-white"
            >
              <Bookmark className={saved ? "size-4 fill-ink" : "size-4"} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">{label} · {project.year}</p>
          <h3 className="font-display text-2xl leading-tight">
            <Link href={`/projects/${project.slug}`} className="hover:text-iris focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt">
              {project.title}
            </Link>
          </h3>
          <div className="flex items-center justify-between border-t border-line pt-3 text-sm">
            <Link href={`/creators/${project.creatorUsername}`} className="text-muted hover:text-ink">
              {project.creatorName}
            </Link>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => requireAuth("like")}
                aria-label={liked ? "Karya disukai" : "Sukai karya"}
                aria-pressed={liked}
                className="grid size-10 place-items-center rounded-full hover:bg-surface"
              >
                <Heart className={liked ? "size-4 fill-berry text-berry" : "size-4 text-berry"} aria-hidden="true" />
              </button>
              <span>{project.likes + (liked ? 1 : 0)}</span>
            </div>
          </div>
        </div>
      </article>
      <AuthModal open={authAction !== null} action={authAction ?? "like"} onClose={() => setAuthAction(null)} />
    </>
  );
}
