// src/lib/local/projects.ts
// Karya yang diunggah pengguna. Tersimpan di browser ini saja.
import { useMemo } from "react";
import type { Discipline } from "@/lib/constants";
import type { Project } from "@/types/project";
import { getCurrentUser } from "./auth";
import { createLocalStore, useLocalStore } from "./store";
import { newId, slugify } from "./utils";

export type LocalProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  discipline: Discipline;
  year: number;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  image: string; // data URL
  width: number;
  height: number;
  createdAt: string;
};

const EMPTY: LocalProject[] = [];
const localProjectsStore = createLocalStore<LocalProject[]>("artspace:projects", EMPTY);

export function isLocalId(id: string): boolean {
  return id.startsWith("u-");
}

export function toProject(p: LocalProject): Project {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    creatorName: p.creatorName,
    creatorUsername: p.creatorUsername,
    discipline: p.discipline,
    year: p.year,
    likes: 0,
    tone: "iris",
    shape: "circles",
    cover: { src: p.image, alt: p.title, width: p.width, height: p.height },
  };
}

type AddResult = { ok: true; project: LocalProject } | { ok: false; message: string };

export function addLocalProject(input: {
  title: string;
  description: string;
  discipline: Discipline;
  image: string;
  width: number;
  height: number;
}): AddResult {
  const user = getCurrentUser();
  if (!user) return { ok: false, message: "Masuk dulu untuk mengunggah karya." };

  const id = newId("u-");
  const project: LocalProject = {
    id,
    slug: `${slugify(input.title) || "karya"}-${id.slice(2)}`,
    title: input.title.trim(),
    description: input.description.trim(),
    discipline: input.discipline,
    year: new Date().getFullYear(),
    creatorId: user.id,
    creatorName: user.name,
    creatorUsername: user.username,
    image: input.image,
    width: input.width,
    height: input.height,
    createdAt: new Date().toISOString(),
  };

  const saved = localProjectsStore.set([project, ...localProjectsStore.getSnapshot()]);
  return saved
    ? { ok: true, project }
    : {
        ok: false,
        message:
          "Penyimpanan browser penuh. Hapus karya lama di tab Karya saya, atau pakai gambar yang lebih kecil.",
      };
}

/** Hanya karya milik sendiri yang bisa dihapus. */
export function deleteLocalProject(id: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  const all = localProjectsStore.getSnapshot();
  const next = all.filter((p) => !(p.id === id && p.creatorId === user.id));
  if (next.length === all.length) return false;
  return localProjectsStore.set(next);
}

export function useLocalProjects(): LocalProject[] {
  return useLocalStore(localProjectsStore);
}

/** Karya unggahan (terbaru dulu) digabung dengan karya dari server. */
export function useAllProjects(serverProjects: Project[]): Project[] {
  const local = useLocalProjects();
  return useMemo(() => [...local.map(toProject), ...serverProjects], [local, serverProjects]);
}