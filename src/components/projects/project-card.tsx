"use client";

import Link from "next/link";
import { Bookmark, Heart } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { cardLink } from "@/components/ui/card-styles";
import type { Project } from "@/types/project";
import { CoverArt } from "./cover-art";
import { ProjectCover } from "./project-cover";

type AuthAction = "like" | "save";

const AUTH_TITLES: Record<AuthAction, string> = {
  like: "Masuk untuk menyukai karya",
  save: "Masuk untuk menyimpan karya",
};

// Tampil saat hover atau fokus keyboard. Di layar sentuh (tanpa hover)
// info selalu tampil, karena tidak ada cara lain untuk melihatnya.
const reveal =
  "opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100";

export function ProjectCard({ project }: { project: Project }) {
  const [authAction, setAuthAction] = useState<AuthAction | null>(null);

  return (
    <>
      <article className="group relative overflow-hidden rounded-2xl bg-surface">
        <ProjectCover
         project={project}
      className="transition duration-500 group-hover:scale-[1.03]"
        />

        <div className={`absolute inset-0 flex flex-col justify-between ${reveal}`}>
          <div className="flex justify-end p-3">
            <button
              type="button"
              onClick={() => setAuthAction("save")}
              aria-label="Simpan karya"
              className="relative z-10 grid size-10 place-items-center rounded-full bg-canvas/90 shadow-sm backdrop-blur transition hover:bg-canvas"
            >
              <Bookmark className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-2 bg-linear-to-t from-black/75 via-black/40 to-transparent p-4 pt-14">
            <h3 className="line-clamp-2 font-display text-lg leading-tight text-white">
              <Link href={`/projects/${project.slug}`} className={cardLink}>
                {project.title}
              </Link>
            </h3>

            <div className="flex items-center justify-between gap-3">
              <Link
                href={`/creators/${project.creatorUsername}`}
                className="relative z-10 inline-flex min-w-0 items-center gap-2 text-sm text-white/90 hover:text-white hover:underline"
              >
                <span
                  aria-hidden="true"
                  className="grid size-7 shrink-0 place-items-center rounded-full bg-canvas text-xs font-bold text-ink"
                >
                  {project.creatorName.charAt(0)}
                </span>
                <span className="truncate">{project.creatorName}</span>
              </Link>

              <button
                type="button"
                onClick={() => setAuthAction("like")}
                aria-label={`Sukai karya (${project.likes} suka)`}
                className="relative z-10 inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm text-white hover:bg-white/15"
              >
                <Heart className="size-4" aria-hidden="true" />
                {project.likes}
              </button>
            </div>
          </div>
        </div>
      </article>

      <AuthModal
        open={authAction !== null}
        title={AUTH_TITLES[authAction ?? "like"]}
        onClose={() => setAuthAction(null)}
      />
    </>
  );
}
