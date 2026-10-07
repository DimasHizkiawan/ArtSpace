// src/app/(public)/explore/page.tsx
import Link from "next/link";
import { cardGrid } from "@/components/ui/card-styles";
import { ArrowRight } from "lucide-react";
import { CreatorCard } from "@/components/creators/creator-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { DisciplineFilter } from "@/components/projects/discipline-filter";
import { ProjectGrid } from "@/components/projects/project-grid";
import { SearchBar } from "@/components/search/search-bar";
import { isDiscipline } from "@/lib/constants";
import { searchCreators, searchProjects } from "@/lib/data/repository";
import { cleanQuery, firstParam } from "@/lib/search";

type Props = {
  searchParams: Promise<{
    q?: string | string[] | undefined;
    disiplin?: string | string[] | undefined;
  }>;
};

export default async function ExplorePage({ searchParams }: Props) {
  const params = await searchParams;
  const q = cleanQuery(firstParam(params.q));
  const raw = firstParam(params.disiplin);
  const discipline = isDiscipline(raw) ? raw : undefined;

  const [projects, creators] = await Promise.all([
    searchProjects({ q, discipline }),
    searchCreators({ q, discipline }),
  ]);
  const empty = projects.length === 0 && creators.length === 0;

  return (
    <div className="space-y-10 pb-10">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-berry">Explore</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">Cari inspirasi, temukan kreator.</h1>
        <p className="mt-4 text-base leading-7 text-muted">
          Jelajahi karya tanpa perlu membuat akun. Saat menemukan sesuatu yang ingin kamu simpan
          atau apresiasi, ArtSpace akan memintamu masuk.
        </p>
      </section>

      <section aria-label="Pencarian" className="space-y-5">
        <SearchBar
          basePath="/explore"
          q={q}
          disiplin={discipline}
          label="Cari karya atau kreator"
          placeholder="Contoh: poster, Alya, ilustrasi"
        />
        <DisciplineFilter active={discipline} basePath="/explore" />
        <p role="status" className="text-sm text-muted">
          {q
            ? `${projects.length} karya dan ${creators.length} kreator untuk “${q}”`
            : `${projects.length} karya dan ${creators.length} kreator`}
        </p>
      </section>

      {empty ? (
        <EmptyState
          title="Tidak ada hasil"
          description={
            q
              ? `Tidak ada karya atau kreator yang cocok dengan “${q}”. Coba kata yang lebih pendek atau pilih semua disiplin.`
              : "Belum ada karya pada disiplin ini. Coba disiplin lain."
          }
          actionHref="/explore"
          actionLabel="Hapus pencarian"
        />
      ) : (
        <>
          {projects.length > 0 ? (
            <section aria-labelledby="hasil-karya" className="space-y-4">
              <h2 id="hasil-karya" className="font-display text-3xl">
                Karya
              </h2>
              <ProjectGrid projects={projects} />
            </section>
          ) : null}

          {creators.length > 0 ? (
            <section aria-labelledby="hasil-kreator" className="space-y-4">
              <h2 id="hasil-kreator" className="font-display text-3xl">
                Kreator
              </h2>
              <ul className={cardGrid}>
                {creators.map((c) => (
                  <li key={c.username}>
                    <CreatorCard creator={c} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}

      <div className="flex justify-center">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-iris"
        >
          Kembali ke galeri <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
