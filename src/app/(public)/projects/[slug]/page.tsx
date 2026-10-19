import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectActions } from "@/components/projects/project-actions";
import { ProjectGrid } from "@/components/projects/project-grid";
import { DISCIPLINES } from "@/lib/constants";
import { getProjectDetail } from "@/lib/data/project-detail";
import { getProjectBySlug, getProjectsByCreator } from "@/lib/data/repository";
import { ProjectCover } from "@/components/projects/project-cover";
import { CommentSection } from "@/components/projects/comment-section";
import { LocalProjectView } from "@/components/projects/local-project-view";
import { CreatorLink } from "@/components/creators/creator-link";
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  // Karya unggahan pengguna hanya ada di browser,  judulnya tidak bisa dibaca di server.
  if (!project) return { title: "Karya | ArtSpace" };
  return { title: `${project.title} oleh ${project.creatorName}` };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return <LocalProjectView slug={slug} />;

  const label = DISCIPLINES.find((d) => d.value === project.discipline)?.label ?? "";
  const detail = getProjectDetail(project, label);
  const more = (await getProjectsByCreator(project.creatorUsername)).filter(
    (p) => p.slug !== project.slug,
  );

  return (
    <div className="space-y-12 pb-10">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Kembali ke galeri
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="overflow-hidden rounded-3xl border border-line lg:col-start-1 lg:row-start-1">
          <ProjectCover project={project} natural priority sizes="(min-width: 1024px) 60vw, 100vw" />
        </div>

        <aside className="space-y-6 rounded-2xl border border-line bg-canvas p-5 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              {label} · {project.year}
            </p>
            <h1 className="font-display text-3xl leading-tight">{project.title}</h1>
            <CreatorLink name={project.creatorName} username={project.creatorUsername} />
           
          </div>

          <ProjectActions projectId={project.id} likes={project.likes} />

          <dl className="space-y-3 border-t border-line pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Peran</dt>
              <dd className="text-right font-medium">{detail.role}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Durasi</dt>
              <dd className="text-right font-medium">{detail.duration}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Alat</dt>
              <dd className="text-right font-medium">{detail.tools.join(", ")}</dd>
            </div>
          </dl>
        </aside>

        <section aria-labelledby="tentang-karya" className="space-y-4 lg:col-start-1 lg:row-start-2">
          <h2 id="tentang-karya" className="font-display text-3xl">
            Tentang karya
          </h2>
          {detail.story.map((paragraph) => (
            <p key={paragraph} className="max-w-prose text-base leading-7">
              {paragraph}
            </p>
          ))}
        </section>
      </div>

      <CommentSection projectId={project.id} />

      {more.length > 0 ? (
        <section aria-labelledby="karya-lain" className="space-y-4">
          <h2 id="karya-lain" className="font-display text-3xl">
            Karya lain dari {project.creatorName}
          </h2>
          <ProjectGrid projects={more} />
        </section>
      ) : null}
    </div>
  );
}