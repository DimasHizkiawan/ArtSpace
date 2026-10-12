// src/lib/local/profile.ts
import { renameCommenter } from "./activity";
import {
  getCurrentUser,
  isUsernameTaken,
  updateUser,
  type ProfilePatch,
  type User,
} from "./auth";
import { renameCreator } from "./projects";

export type SaveProfileResult =
  | { ok: true; user: User }
  | { ok: false; field: "name" | "username"; message: string };

export function saveProfile(input: ProfilePatch): SaveProfileResult {
  const me = getCurrentUser();
  if (!me) return { ok: false, field: "name", message: "Masuk dulu untuk mengubah profil." };

  const username = input.username.trim().toLowerCase();
  if (isUsernameTaken(username, me.id)) {
    return { ok: false, field: "username", message: "Username ini sudah dipakai. Coba yang lain." };
  }

  const updated = updateUser(me.id, { ...input, name: input.name.trim(), username });
  if (!updated) {
    return {
      ok: false,
      field: "name",
      message: "Profil gagal disimpan. Penyimpanan browser penuh atau tidak tersedia.",
    };
  }

  // Karya dan komentar lama menyimpan salinan nama, jadi ikut diperbarui.
  renameCreator(updated.id, updated.name, updated.username);
  renameCommenter(updated.id, updated.name, updated.username);
  return { ok: true, user: updated };
}