"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownUp, Check, Ellipsis, Eye, ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "published" | "draft";
 type Work = { id: number; title: string; discipline: string; date: string; image: string; status: Status; views: number; likes: number };

const INITIAL_WORKS: Work[] = [
  { id: 1, title: "Brand Identity — Kopi Senja", discipline: "Desain", date: "12 Okt 2026", image: "/images/kopi.jpg", status: "published", views: 1240, likes: 128 },
  { id: 2, title: "Studi warna: pagi di kota", discipline: "Ilustrasi", date: "8 Okt 2026", image: "/images/pagi.jpg", status: "published", views: 864, likes: 76 },
  { id: 3, title: "Pasar Minggu, 06.15", discipline: "Fotografi", date: "2 Okt 2026", image: "/images/market.jpg", status: "published", views: 592, likes: 43 },
  { id: 4, title: "Eksperimen bentuk #04", discipline: "Seni rupa", date: "Terakhir diubah 30 Sep", image: "/images/crystal.jpg", status: "draft", views: 0, likes: 0 },
  { id: 5, title: "Hujan turun perlahan", discipline: "Desain", date: "24 Sep 2026", image: "/images/rain.jpg", status: "published", views: 431, likes: 38 },
  { id: 6, title: "Sudut kota yang tenang", discipline: "Fotografi", date: "Terakhir diubah 19 Sep", image: "/images/city.jpg", status: "draft", views: 0, likes: 0 },
];

const statusLabel: Record<Status, string> = { published: "Dipublikasikan", draft: "Draf" };

export default function PlaygroundClient() {
  const [works, setWorks] = useState(INITIAL_WORKS);
  const [tab, setTab] = useState<"all" | Status>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Work | null>(null);
  const [dialog, setDialog] = useState<"edit" | "delete" | null>(null);
  const [notice, setNotice] = useState("");
  const [sortNewest, setSortNewest] = useState(true);

  const filtered = useMemo(() => works
    .filter((work) => tab === "all" || work.status === tab)
    .filter((work) => `${work.title} ${work.discipline}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sortNewest ? b.id - a.id : a.id - b.id), [works, tab, query, sortNewest]);

  function openDialog(work: Work, type: "edit" | "delete") { setSelected(work); setDialog(type); }
  function removeWork() {
    if (!selected) return;
    setWorks((items) => items.filter((work) => work.id !== selected.id));
    setDialog(null); setNotice(`“${selected.title}” dihapus dari contoh.`);
    window.setTimeout(() => setNotice(""), 3500);
  }
  function saveWork(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    setWorks((items) => items.map((work) => work.id === selected.id ? { ...work, title: String(form.get("title")) } : work));
    setDialog(null); setNotice("Perubahan contoh berhasil disimpan.");
    window.setTimeout(() => setNotice(""), 3500);
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-iris/20 bg-iris/5 px-3 py-1.5 text-xs font-semibold text-iris">
          <span className="size-1.5 rounded-full bg-iris" /> Pratinjau fitur · data contoh
        </div>
        <Link href="/studio/projects/new" className="text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline">Coba alur unggah ↗</Link>
      </div>

      <header className="flex flex-col justify-between gap-5 border-b border-line pb-7 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-iris">STUDIO KREATOR</p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">Karya saya</h1>
          <p className="max-w-xl text-muted">Kelola portofolio dan lihat bagaimana karya-karyamu tampil di ArtSpace.</p>
        </div>
        <Link href="/studio/projects/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-iris px-5 text-sm font-semibold text-on-accent transition hover:brightness-90">
          <Plus className="size-4" aria-hidden="true" /> Unggah karya
        </Link>
      </header>

      <section aria-label="Ringkasan portofolio" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Total karya", String(works.length), "di portofoliomu"],
          ["Dipublikasikan", String(works.filter((w) => w.status === "published").length), "terlihat publik"],
          ["Draf", String(works.filter((w) => w.status === "draft").length), "belum diterbitkan"],
          ["Total dilihat", works.reduce((sum, w) => sum + w.views, 0).toLocaleString("id-ID"), "dari karya publik"],
        ].map(([label, value, helper]) => (
          <div key={label} className="rounded-2xl border border-line bg-canvas p-4 sm:p-5">
            <p className="text-sm text-muted">{label}</p><p className="mt-2 font-display text-3xl">{value}</p><p className="mt-1 text-xs text-muted">{helper}</p>
          </div>
        ))}
      </section>

      <section className="space-y-5" aria-labelledby="work-list-heading">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5 border-b border-line" role="tablist" aria-label="Filter status karya">
            {([ ["all", "Semua", works.length], ["published", "Dipublikasikan", works.filter((w) => w.status === "published").length], ["draft", "Draf", works.filter((w) => w.status === "draft").length] ] as const).map(([key, label, count]) => (
              <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`-mb-px inline-flex min-h-11 items-center gap-2 border-b-2 px-1 text-sm ${tab === key ? "border-iris font-semibold text-ink" : "border-transparent text-muted hover:text-ink"}`}>
                {label}<span className="rounded-full bg-surface px-2 py-0.5 text-xs">{count}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <span className="sr-only">Cari karya</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari karya..." className="min-h-11 w-full rounded-md border border-line bg-canvas pl-9 pr-3 text-sm outline-none focus:border-ink" />
            </label>
            <button type="button" onClick={() => setSortNewest((value) => !value)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line px-3 text-sm font-medium hover:border-ink">
              <ArrowDownUp className="size-4" aria-hidden="true" /> {sortNewest ? "Terbaru" : "Terlama"}
            </button>
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-3">
          <h2 id="work-list-heading" className="font-display text-xl">Portofolio</h2>
          <p className="text-sm text-muted">{filtered.length} karya</p>
        </div>

        {filtered.length ? (
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((work) => (
              <li key={work.id} className="overflow-hidden rounded-2xl border border-line bg-canvas transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  <Image src={work.image} alt={work.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
                  <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${work.status === "published" ? "bg-canvas/95 text-ink" : "bg-amber-100 text-amber-900"}`}>
                    <span className={`mr-1.5 inline-block size-1.5 rounded-full align-middle ${work.status === "published" ? "bg-emerald-600" : "bg-amber-600"}`} />{statusLabel[work.status]}
                  </span>
                  <button type="button" aria-label={`Menu ${work.title}`} onClick={() => { setSelected(work); setDialog("edit"); }} className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-canvas/95 shadow-sm hover:bg-canvas"><Ellipsis className="size-5" aria-hidden="true" /></button>
                </div>
                <div className="space-y-4 p-4">
                  <div className="space-y-1"><p className="text-xs font-medium text-muted">{work.discipline} <span aria-hidden="true">·</span> {work.date}</p><h3 className="line-clamp-1 font-display text-xl">{work.title}</h3></div>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    {work.status === "published" ? <><span className="inline-flex items-center gap-1.5"><Eye className="size-3.5" aria-hidden="true" />{work.views.toLocaleString("id-ID")} dilihat</span><span className="inline-flex items-center gap-1.5">♡ {work.likes} suka</span></> : <span>Draf hanya terlihat olehmu</span>}
                  </div>
                  <div className="flex gap-2 border-t border-line pt-3">
                    {work.status === "published" ? <Link href={`/projects/${work.id === 1 ? "brand-identity-kopi-senja" : work.id === 2 ? "pagi-hari" : work.id === 3 ? "ilustrasi-pasar-pagi" : "editorial-poster-musim-hujan"}`} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md border border-line text-sm font-semibold hover:border-ink"><Eye className="size-4" aria-hidden="true" />Lihat</Link> : <button type="button" onClick={() => { setSelected(work); setDialog("edit"); }} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md border border-line text-sm font-semibold hover:border-ink"><Pencil className="size-4" aria-hidden="true" />Lanjutkan</button>}
                    <button type="button" onClick={() => openDialog(work, "edit")} aria-label={`Edit ${work.title}`} className="grid min-h-10 min-w-11 place-items-center rounded-md border border-line hover:border-ink"><Pencil className="size-4" aria-hidden="true" /></button>
                    <button type="button" onClick={() => openDialog(work, "delete")} aria-label={`Hapus ${work.title}`} className="grid min-h-10 min-w-11 place-items-center rounded-md border border-line text-muted hover:border-berry hover:text-berry"><Trash2 className="size-4" aria-hidden="true" /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-surface"><ImagePlus className="size-5 text-muted" aria-hidden="true" /></div>
            <h3 className="mt-4 font-display text-xl">Belum ada karya yang cocok</h3>
            <p className="mt-1 text-sm text-muted">Coba kata kunci lain atau ubah filter yang dipilih.</p>
            <button type="button" onClick={() => { setQuery(""); setTab("all"); }} className="mt-4 text-sm font-semibold text-iris underline underline-offset-4">Atur ulang filter</button>
          </div>
        )}
      </section>

      {notice ? <div role="status" className="fixed bottom-5 right-5 z-30 flex max-w-sm items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm text-canvas shadow-xl"><Check className="size-4 text-emerald-400" aria-hidden="true" />{notice}<button type="button" aria-label="Tutup" onClick={() => setNotice("")}><X className="size-4" /></button></div> : null}

      {dialog && selected ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="dialog-title" className="w-full max-w-md rounded-2xl bg-canvas p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-muted">{dialog === "edit" ? "Edit karya" : "Hapus karya"}</p><h2 id="dialog-title" className="mt-1 font-display text-2xl">{dialog === "edit" ? "Perbarui detail" : "Yakin ingin menghapus?"}</h2></div><button type="button" aria-label="Tutup dialog" onClick={() => setDialog(null)} className="grid size-10 place-items-center rounded-full hover:bg-surface"><X className="size-5" /></button></div>
            {dialog === "edit" ? <form onSubmit={saveWork} className="mt-5 space-y-4"><label className="block space-y-1.5 text-sm font-medium">Judul karya<input name="title" defaultValue={selected.title} required maxLength={80} className="min-h-11 w-full rounded-md border border-line bg-canvas px-3 font-normal" /></label><p className="text-sm text-muted">Dalam fitur sebenarnya, formulir ini juga dapat mengubah disiplin, deskripsi, dan sampul.</p><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setDialog(null)}>Batal</Button><Button type="submit">Simpan perubahan</Button></div></form> : <div className="mt-4 space-y-5"><p className="text-sm text-muted">Karya <strong className="text-ink">“{selected.title}”</strong> akan dihapus dari contoh portofolio ini.</p><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setDialog(null)}>Batal</Button><Button type="button" onClick={removeWork} className="bg-berry hover:brightness-90">Hapus karya</Button></div></div>}
          </section>
        </div>
      ) : null}
    </main>
  );
}
