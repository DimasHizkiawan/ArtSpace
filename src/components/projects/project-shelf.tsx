// src/components/projects/project-shelf.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types/project";
import { ProjectCard } from "./project-card";

type Props = {
  id: string;
  title: string;
  description: string;
  href: string;
  projects: Project[];
};

/** Satu rak karya: baris yang bisa digeser ke samping, dengan tautan ke Eksplorasi. */
export function ProjectShelf({ id, title, description, href, projects }: Props) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 id={id} className="font-display text-2xl sm:text-3xl">
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
        <Link
          href={href}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-iris hover:underline"
        >
          Lihat semua
          <span className="sr-only"> karya {title}</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <ul
        tabIndex={0}
        aria-label={`Karya ${title}`}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0"
      >
        {projects.map((p) => (
          <li key={p.slug} className="w-[78%] shrink-0 snap-start sm:w-72 lg:w-80">
            <ProjectCard project={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}