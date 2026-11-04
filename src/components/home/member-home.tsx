"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownUp, BadgeCheck, Check, FilePenLine, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { LoginGate } from "@/components/auth/login-gate";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectCover } from "@/components/projects/project-cover";
import { cardGrid } from "@/components/ui/card-styles";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { DISCIPLINES, disciplineName, type Discipline } from "@/lib/constants";
import { useUserActivity } from "@/lib/local/activity";
import { useAuth } from "@/lib/local/auth";
import { deleteLocalProject, isPublished, toProject, updateLocalProject, useAllProjects, useLocalProjects, type LocalProject } from "@/lib/local/projects";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

type Tab = "semua" | "tersimpan" | "saya";
type WorkFilter = "all" | "published" | "draft";
const TABS: { value: Tab; label: string }[] = [
  { value: "semua", label: "Beranda" },
  { value: "tersimpan", label: "Tersimpan" },
  { value: "saya", label: "Karya saya" },
];
const FILTERS: { value: WorkFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "published", label: "Dipublikasikan" },
  { value: "draft", label: "Draf" },
];
const EMPTY_TEXT: Record<Exclude<Tab, "saya">, { title: string; body: string }> = {
  semua: { title: "Belum ada karya", body: "Karya akan muncul di sini." },
  tersimpan: { title: "Belum ada karya tersimpan", body: "Tekan ikon penanda di kartu karya untuk menyimpannya ke sini." },
};
const subtleLink = "font-semibold text-iris underline-offset-4 hover:underline";

export function MemberHome({ serverProjects }: { serverProjects: Project[] }) {
  const { user, ready } = useAuth();
  const all = useAllProjects(serverProjects);
  const local = useLocalProjects();
  const { likedIds, savedIds } = useUserActivity();
  const [tab, setTab] = useState<Tab>("semua");
  const [filter, setFilter] = useState<WorkFilter>("all");
  const [query, setQuery] = useState("");
  const [newestFirst, setNewestFirst] = useState(true);
  const [editing, setEditing] = useState<LocalProject | null>(null);
  const [deleting, setDeleting] = useState<LocalProject | null>(null);
  const [notice, setNotice] = useState("");

  const mine = useMemo(() => local.filter((project) => project.creatorId === user?.id), [local, user?.id]);
  const savedList = useMemo(() => all.filter((project) => savedIds.has(project.id)), [all, savedIds]);
  const ownedWorks = useMemo(() => mine
    .filter((project) => filter === "all" || (filter === "published" ? isPublished(project) : !isPublished(project)))
    .filter((project) => `${project.title} ${disciplineName(project.discipline)}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => newestFirst ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt)),
  [mine, filter, query, newestFirst]);

  if (!ready) return <div aria-busy="true" aria-label="Memuat beranda" className="h-40 animate-pulse rounded-2xl bg-surface" />;
  if (!user) return <LoginGate title="Masuk untuk membuka beranda" body="Setelah masuk, kamu bisa menyukai, menyimpan, mengomentari, dan mengunggah karya." />;

  const likedCount = all.filter((project) => likedIds.has(project.id)).length;
  const counts = { tersimpan: savedList.length, saya: mine.length };
  const list: Project[] = tab === "semua" ? all : tab === "tersimpan" ? savedList : [];

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  function removeWork() {
    if (!deleting) return;
    const title = deleting.title;
    const removed = deleteLocalProject(deleting.id);
    setDeleting(null);
    showNotice(removed ? `“${title}” dihapus.` : "Karya tidak dapat dihapus dari browser ini.");
  }

  function saveWork(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const discipline = String(form.get("discipline") ?? "");
    const status = String(form.get("status")) === "draft" ? "draft" : "published";
    if (title.length < 3 || !DISCIPLINES.some((item) => item.value === discipline)) return;
    const updated = updateLocalProject(editing.id, { title, description, discipline: discipline as Discipline, status });
    setEditing(null);
    showNotice(updated ? "Perubahan karya berhasil disimpan." : "Perubahan tidak dapat disimpan di browser ini.");
  }

  return (
    <div className="space-y-8 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar name={user.name} src={user.avatar} size="md" />
          <div className="min-w-0">
            <h1 className="font-display text-3xl leading-tight">Halo, {user.name.split(" ")[0]}.</h1>
            <p className="text-sm text-muted">@{user.username} · {likedCount} karya kamu sukai · <Link href="/profil" className={subtleLink}>Edit profil</Link> · <Link href={`/creators/${user.username}`} className={subtleLink}>Lihat profil</Link></p>
          </div>
        </div>
        <Link href="/studio/projects/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-canvas hover:opacity-90"><Plus className="size-4" aria-hidden="true" />Unggah karya</Link>
      </header>

      <section aria-label="Daftar karya" className="space-y-5">
        <div role="group" aria-label="Pilih tampilan" className="flex gap-2 border-b border-line">
          {TABS.map((item) => {
            const count = item.value === "tersimpan" ? counts.tersimpan : item.value === "saya" ? counts.saya : null;
            return <button key={item.value} type="button" aria-pressed={tab === item.value} onClick={() => setTab(item.value)} className={cn("-mb-px inline-flex min-h-11 items-center gap-1.5 border-b-2 px-3 text-sm font-medium", tab === item.value ? "border-iris text-ink" : "border-transparent text-muted hover:text-ink")}>{item.label}{count !== null ? <span aria-label={`${count} karya`} className="text-xs text-muted">{count}</span> : null}</button>;
          })}
        </div>

        {tab === "saya" ? (
          <section aria-labelledby="my-works-heading" className="space-y-6">
            <header className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
              <div className="space-y-2"><p className="text-sm font-semibold text-iris">STUDIO KREATOR</p><h2 id="my-works-heading" className="font-display text-4xl leading-tight sm:text-5xl">Karya saya</h2><p className="max-w-xl text-muted">Kelola portofolio dan lihat bagaimana karya-karyamu tampil di ArtSpace.</p></div>
            </header>

            <section aria-label="Ringkasan portofolio" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[["Total karya", String(mine.length), "di portofoliomu"], ["Dipublikasikan", String(mine.filter(isPublished).length), "terlihat publik"], ["Draf", String(mine.filter((work) => !isPublished(work)).length), "hanya terlihat olehmu"]].map(([label, value, helper]) => <div key={label} className="rounded-2xl border border-line bg-canvas p-4 sm:p-5"><p className="text-sm text-muted">{label}</p><p className="mt-2 font-display text-3xl">{value}</p><p className="mt-1 text-xs text-muted">{helper}</p></div>)}
            </section>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <label className="flex min-h-11 items-center gap-2 text-sm font-medium">Status karya
                <select value={filter} onChange={(event) => setFilter(event.target.value as WorkFilter)} aria-label="Filter status karya" className="min-h-11 rounded-md border border-line bg-canvas px-3">
                  {FILTERS.map((item) => {
                    const count = item.value === "all" ? mine.length : mine.filter((work) => item.value === "published" ? isPublished(work) : !isPublished(work)).length;
                    return <option key={item.value} value={item.value}>{item.label} ({count})</option>;
                  })}
                </select>
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="relative flex-1 sm:w-64"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" /><span className="sr-only">Cari karya</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari karya..." className="min-h-11 w-full rounded-md border border-line bg-canvas pl-9 pr-3 text-sm outline-none focus:border-ink" /></label>
                <button type="button" onClick={() => setNewestFirst((value) => !value)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line px-3 text-sm font-medium hover:border-ink"><ArrowDownUp className="size-4" aria-hidden="true" />{newestFirst ? "Terbaru" : "Terlama"}</button>
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-3"><h3 className="font-display text-xl">Portofolio</h3><p className="text-sm text-muted">{ownedWorks.length} karya</p></div>
            {ownedWorks.length ? <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{ownedWorks.map((work) => <li key={work.id} className="group relative overflow-hidden rounded-2xl border border-line bg-canvas transition hover:-translate-y-0.5 hover:shadow-lg">
              <Link href={`/projects/${work.slug}`} aria-label={`Lihat detail ${work.title}`} className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris" />
              <div className="relative aspect-[4/3] overflow-hidden bg-surface"><ProjectCover project={toProject(work)} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" /><div className="absolute right-3 top-3 z-20 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100"><button type="button" onClick={() => setEditing(work)} aria-label={`Edit ${work.title}`} className="grid size-10 place-items-center rounded-lg border border-line bg-canvas/95 text-ink shadow-sm transition hover:border-yellow-500 hover:bg-transparent hover:text-yellow-600"><Pencil className="size-4" aria-hidden="true" /></button><button type="button" onClick={() => setDeleting(work)} aria-label={`Hapus ${work.title}`} className="grid size-10 place-items-center rounded-lg border border-line bg-canvas/95 text-muted shadow-sm transition hover:border-berry hover:bg-berry/10 hover:text-berry"><Trash2 className="size-4" aria-hidden="true" /></button></div></div>
              <div className="relative space-y-4 p-4"><div className="space-y-1"><p className="text-xs font-medium text-muted">{disciplineName(work.discipline)} · {new Date(work.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p><h4 className="line-clamp-1 font-display text-xl">{work.title}</h4></div><div className="flex items-center gap-4 text-xs text-muted">{isPublished(work) ? <span className="inline-flex items-center gap-1.5"><BadgeCheck className="size-3.5 text-emerald-600" aria-hidden="true" />Terlihat publik</span> : <span className="inline-flex items-center gap-1.5"><FilePenLine className="size-3.5 text-amber-700" aria-hidden="true" />Draf hanya terlihat olehmu</span>}</div></div>
            </li>)}</ul> : <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center"><h3 className="font-display text-xl">{mine.length === 0 ? "Kamu belum mengunggah karya" : "Belum ada karya yang cocok"}</h3><p className="mt-1 text-sm text-muted">{mine.length === 0 ? "Karya yang kamu unggah akan muncul di sini." : "Coba kata kunci lain atau ubah filter yang dipilih."}</p>{mine.length > 0 ? <button type="button" onClick={() => { setQuery(""); setFilter("all"); }} className="mt-4 text-sm font-semibold text-iris underline underline-offset-4">Atur ulang filter</button> : null}</div>}
          </section>
        ) : <>
          <p role="status" className="text-sm text-muted">{list.length} karya</p>
          {list.length === 0 ? <div className="flex flex-col items-center gap-3 border border-dashed border-line bg-surface px-6 py-16 text-center"><h2 className="font-display text-3xl">{EMPTY_TEXT[tab].title}</h2><p className="max-w-sm text-muted">{EMPTY_TEXT[tab].body}</p></div> : <ul className={cardGrid}>{list.map((project) => <li key={project.slug} className="space-y-2"><ProjectCard project={project} /></li>)}</ul>}
        </>}
      </section>

      {notice ? <div role="status" className="fixed bottom-5 right-5 z-30 flex max-w-sm items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm text-canvas shadow-xl"><Check className="size-4 text-emerald-400" aria-hidden="true" />{notice}<button type="button" aria-label="Tutup" onClick={() => setNotice("")}><X className="size-4" /></button></div> : null}
      {editing ? <div className="fixed inset-0 z-40 grid place-items-center bg-ink/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}><section role="dialog" aria-modal="true" aria-labelledby="edit-work-title" className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-canvas p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-muted">Edit karya</p><h2 id="edit-work-title" className="mt-1 font-display text-2xl">Perbarui detail</h2></div><button type="button" aria-label="Tutup dialog" onClick={() => setEditing(null)} className="grid size-10 place-items-center rounded-full hover:bg-surface"><X className="size-5" /></button></div><form onSubmit={saveWork} className="mt-5 space-y-4"><label className="block space-y-1.5 text-sm font-medium">Judul karya<input name="title" defaultValue={editing.title} required minLength={3} maxLength={80} className="min-h-11 w-full rounded-md border border-line bg-canvas px-3 font-normal" /></label><label className="block space-y-1.5 text-sm font-medium">Disiplin<select name="discipline" defaultValue={editing.discipline} className="min-h-11 w-full rounded-md border border-line bg-canvas px-3 font-normal">{DISCIPLINES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="block space-y-1.5 text-sm font-medium">Cerita di balik karya<textarea name="description" defaultValue={editing.description} required minLength={10} maxLength={1000} rows={5} className="w-full rounded-md border border-line bg-canvas px-3 py-2 font-normal" /></label><label className="block space-y-1.5 text-sm font-medium">Status<select name="status" defaultValue={isPublished(editing) ? "published" : "draft"} className="min-h-11 w-full rounded-md border border-line bg-canvas px-3 font-normal"><option value="published">Dipublikasikan</option><option value="draft">Simpan sebagai draf</option></select></label><p className="text-sm text-muted">Draf hanya terlihat olehmu. Memublikasikan karya akan menampilkannya di galeri dan profilmu.</p><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setEditing(null)}>Batal</Button><Button type="submit">Simpan perubahan</Button></div></form></section></div> : null}
      {deleting ? <div className="fixed inset-0 z-40 grid place-items-center bg-ink/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleting(null); }}><section role="alertdialog" aria-modal="true" aria-labelledby="delete-work-title" className="w-full max-w-md rounded-2xl bg-canvas p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-muted">Hapus karya</p><h2 id="delete-work-title" className="mt-1 font-display text-2xl">Yakin ingin menghapus?</h2></div><button type="button" aria-label="Tutup dialog" onClick={() => setDeleting(null)} className="grid size-10 place-items-center rounded-full hover:bg-surface"><X className="size-5" /></button></div><p className="mt-4 text-sm text-muted">Karya <strong className="text-ink">“{deleting.title}”</strong> akan dihapus dari portofolio ini.</p><div className="mt-5 flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setDeleting(null)}>Batal</Button><Button type="button" onClick={removeWork} className="bg-berry hover:brightness-90">Hapus karya</Button></div></section></div> : null}
    </div>
  );
}
