import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProjects } from "@/lib/data/repository";
import { ProjectGrid } from "@/components/projects/project-grid";

export default async function ExplorePage() {
  const projects = await getProjects();
  return (
    <div className="space-y-10 pb-10">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-berry">Explore</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">Cari inspirasi, temukan kreator.</h1>
        <p className="mt-4 text-base leading-7 text-muted">Jelajahi karya tanpa perlu membuat akun. Saat menemukan sesuatu yang ingin kamu simpan atau apresiasi, ArtSpace akan memintamu masuk.</p>
      </section>
      <ProjectGrid projects={projects} />
      <div className="flex justify-center"><Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-iris">Kembali ke galeri <ArrowRight className="size-4" /></Link></div>
    </div>
  );
}
