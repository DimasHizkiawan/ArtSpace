// src/components/projects/use-interactions.ts
"use client";

import { useCallback, useState } from "react";
import { toggleLike, toggleSave, useProjectActivity } from "@/lib/local/activity";
import { getCurrentUser } from "@/lib/local/auth";

export type InteractionKind = "like" | "save";

const AUTH_TITLES: Record<InteractionKind, string> = {
  like: "Masuk untuk menyukai karya",
  save: "Masuk untuk menyimpan karya",
};

function run(kind: InteractionKind, projectId: string) {
  return kind === "like" ? toggleLike(projectId) : toggleSave(projectId);
}

/**
 * Suka dan simpan untuk satu karya. Jika belum masuk, `request` membuka dialog
 * masuk, dan aksinya dijalankan otomatis setelah berhasil masuk.
 */
export function useInteractions(projectId: string, baseLikes: number) {
  const activity = useProjectActivity(projectId, baseLikes);
  const [waiting, setWaiting] = useState<InteractionKind | null>(null);

  const request = useCallback(
    (kind: InteractionKind) => {
      if (!getCurrentUser()) {
        setWaiting(kind);
        return;
      }
      run(kind, projectId);
    },
    [projectId],
  );

  const modal = {
    open: waiting !== null,
    title: AUTH_TITLES[waiting ?? "like"],
    onClose: () => setWaiting(null),
    onSuccess: () => {
      if (waiting) run(waiting, projectId);
    },
  };

  return { ...activity, request, modal };
}