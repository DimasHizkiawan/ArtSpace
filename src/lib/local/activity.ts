// src/lib/local/activity.ts
// Suka, simpan, dan komentar: disimpan per karya di localStorage.
import { useMemo } from "react";
import { getCurrentUser, useAuth } from "./auth";
import { createLocalStore, useLocalStore } from "./store";
import { newId } from "./utils";

export type Comment = {
  id: string;
  userId: string;
  name: string;
  username: string;
  text: string;
  createdAt: string;
};

type Activity = {
  likes: Record<string, string[]>; // projectId -> id pengguna
  saves: Record<string, string[]>;
  comments: Record<string, Comment[]>;
};

const EMPTY: Activity = { likes: {}, saves: {}, comments: {} };
const EMPTY_IDS: string[] = [];
const EMPTY_COMMENTS: Comment[] = [];

const activityStore = createLocalStore<Activity>("artspace:activity", EMPTY);

function toggleIn(map: Record<string, string[]>, projectId: string, userId: string) {
  const current = map[projectId] ?? EMPTY_IDS;
  const next = current.includes(userId)
    ? current.filter((id) => id !== userId)
    : [...current, userId];
  return { ...map, [projectId]: next };
}

/** false jika belum masuk atau gagal menyimpan. */
export function toggleLike(projectId: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  const a = activityStore.getSnapshot();
  return activityStore.set({ ...a, likes: toggleIn(a.likes, projectId, user.id) });
}

export function toggleSave(projectId: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  const a = activityStore.getSnapshot();
  return activityStore.set({ ...a, saves: toggleIn(a.saves, projectId, user.id) });
}

export function addComment(projectId: string, text: string): boolean {
  const user = getCurrentUser();
  const clean = text.trim();
  if (!user || !clean) return false;
  const a = activityStore.getSnapshot();
  const comment: Comment = {
    id: newId("c-"),
    userId: user.id,
    name: user.name,
    username: user.username,
    text: clean,
    createdAt: new Date().toISOString(),
  };
  const list = a.comments[projectId] ?? EMPTY_COMMENTS;
  return activityStore.set({ ...a, comments: { ...a.comments, [projectId]: [...list, comment] } });
}

/** Hanya komentar milik sendiri yang bisa dihapus. */
export function deleteComment(projectId: string, commentId: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  const a = activityStore.getSnapshot();
  const list = a.comments[projectId] ?? EMPTY_COMMENTS;
  const next = list.filter((c) => !(c.id === commentId && c.userId === user.id));
  if (next.length === list.length) return false;
  return activityStore.set({ ...a, comments: { ...a.comments, [projectId]: next } });
}

export function useProjectActivity(projectId: string, baseLikes = 0) {
  const activity = useLocalStore(activityStore);
  const { user } = useAuth();
  const likedBy = activity.likes[projectId] ?? EMPTY_IDS;
  const savedBy = activity.saves[projectId] ?? EMPTY_IDS;
  return {
    liked: user ? likedBy.includes(user.id) : false,
    saved: user ? savedBy.includes(user.id) : false,
    likeCount: baseLikes + likedBy.length,
    comments: activity.comments[projectId] ?? EMPTY_COMMENTS,
  };
}

/** Id karya yang disukai dan disimpan pengguna yang sedang masuk. */
export function useUserActivity() {
  const activity = useLocalStore(activityStore);
  const { user } = useAuth();
  return useMemo(() => {
    const idsFor = (map: Record<string, string[]>) =>
      new Set(user ? Object.keys(map).filter((id) => map[id]?.includes(user.id)) : []);
    return { likedIds: idsFor(activity.likes), savedIds: idsFor(activity.saves) };
  }, [activity, user]);
}