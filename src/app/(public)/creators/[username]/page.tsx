import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { getCreatorByUsername, getProjectsByCreator } from "@/lib/data/repository";
import { ProjectGrid } from "@/components/projects/project-grid";

export default async function CreatorPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const creator = await getCreatorByUsername(username);
  if (!creator) notFound();
  const projects = await getProjectsByCreator(username);

  return (
    <div className="space-y-10 pb-10">
      <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-ink"><ArrowLeft className="size-4" /> Kembali</Link>
      <section className="rounded-[2rem] border border-line bg-surface p-6 sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid size-20 shrink-0 place-items-center rounded-full bg-ink text-2xl font-bold text-canvas">{creator.name.charAt(0)}</div>
            <div>
              <p className="text-sm text-muted">@{creator.username}</p>
              <h1 className="font-display text-4xl">{creator.name}</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">{creator.bio}</p>
            </div>
          </div>
          <Link href="/masuk" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-canvas"><UserPlus className="size-4" /> Ikuti kreator</Link>
        </div>
      </section>
      <section className="space-y-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-berry">Portfolio</p><h2 className="mt-1 font-display text-3xl">Karya {creator.name}</h2></div>
        <ProjectGrid projects={projects} />
      </section>
    </div>
  );
}
