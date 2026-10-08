// src/lib/local/auth.ts
// Akun lokal untuk prototipe: data hanya ada di browser ini (localStorage).
// Bukan keamanan sungguhan. Ganti dengan backend saat sudah tersedia.
import { useMemo } from "react";
import { MOCK_CREATORS } from "@/lib/data/mock-creators";
import { createLocalStore, useHydrated, useLocalStore } from "./store";
import { newId, slugify } from "./utils";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  discipline: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  discipline: string;
  createdAt: string;
};

export type AuthResult =
  | { ok: true; user: User }
  | { ok: false; field: "email" | "password"; message: string };

const usersStore = createLocalStore<StoredUser[]>("artspace:users", []);
const sessionStore = createLocalStore<string | null>("artspace:session", null);

function toUser(u: StoredUser): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    username: u.username,
    discipline: u.discipline,
    createdAt: u.createdAt,
  };
}

async function hash(salt: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const subtle = globalThis.crypto?.subtle;
  if (subtle) {
    const digest = await subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Cadangan untuk halaman tanpa HTTPS (misalnya lewat IP jaringan lokal).
  let h = 5381;
  for (const byte of data) h = ((h * 33) ^ byte) >>> 0;
  return `x${h.toString(16)}`;
}

function uniqueUsername(name: string, users: StoredUser[]): string {
  const base = slugify(name, "").slice(0, 20) || "kreator";
  const taken = new Set([...users.map((u) => u.username), ...MOCK_CREATORS.map((c) => c.username)]);
  let candidate = base;
  let n = 2;
  while (taken.has(candidate)) candidate = `${base}${n++}`;
  return candidate;
}

export async function signUp(input: {
  name: string;
  email: string;
  discipline: string;
  password: string;
}): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  const salt = newId("s");
  const passwordHash = await hash(salt, input.password);

  const users = usersStore.getSnapshot();
  if (users.some((u) => u.email === email)) {
    return { ok: false, field: "email", message: "Email ini sudah terdaftar. Silakan masuk." };
  }

  const stored: StoredUser = {
    id: newId("usr-"),
    name: input.name.trim(),
    email,
    username: uniqueUsername(input.name, users),
    discipline: input.discipline,
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  if (!usersStore.set([...users, stored])) {
    return {
      ok: false,
      field: "email",
      message: "Penyimpanan browser tidak tersedia. Aktifkan penyimpanan lokal lalu coba lagi.",
    };
  }
  sessionStore.set(stored.id);
  return { ok: true, user: toUser(stored) };
}

export async function logIn(emailInput: string, password: string): Promise<AuthResult> {
  const email = emailInput.trim().toLowerCase();
  const wrong: AuthResult = {
    ok: false,
    field: "password",
    message: "Email atau kata sandi salah. Belum punya akun? Daftar dulu.",
  };
  const user = usersStore.getSnapshot().find((u) => u.email === email);
  if (!user) return wrong;
  if ((await hash(user.salt, password)) !== user.passwordHash) return wrong;
  sessionStore.set(user.id);
  return { ok: true, user: toUser(user) };
}

export function logOut(): void {
  sessionStore.set(null);
}

/** Untuk dipakai di event handler (bukan saat render). */
export function getCurrentUser(): User | null {
  const id = sessionStore.getSnapshot();
  const user = id ? usersStore.getSnapshot().find((u) => u.id === id) : undefined;
  return user ? toUser(user) : null;
}

export function useAuth(): { user: User | null; ready: boolean } {
  const users = useLocalStore(usersStore);
  const sessionId = useLocalStore(sessionStore);
  const ready = useHydrated();
  const user = useMemo(() => {
    const found = sessionId ? users.find((u) => u.id === sessionId) : undefined;
    return found ? toUser(found) : null;
  }, [users, sessionId]);
  return { user, ready };
}