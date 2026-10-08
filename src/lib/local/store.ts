// src/lib/local/store.ts
// Penyimpanan lokal (localStorage) yang aman dipakai React: server dan render
// pertama di browser memakai nilai awal, lalu otomatis diperbarui dari localStorage.
import { useSyncExternalStore } from "react";

export type LocalStore<T> = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  /** false jika gagal menyimpan (penyimpanan penuh atau dinonaktifkan). */
  set: (next: T) => boolean;
};

export function createLocalStore<T>(key: string, fallback: T): LocalStore<T> {
  const listeners = new Set<() => void>();
  let cachedRaw: string | null | undefined;
  let cachedValue: T = fallback;

  function getSnapshot(): T {
    let raw: string | null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      return cachedValue;
    }
    // Nilai yang sama harus mengembalikan objek yang sama, kalau tidak React akan looping.
    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    try {
      cachedValue = raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      cachedValue = fallback;
    }
    return cachedValue;
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    // Perubahan dari tab lain.
    const onStorage = (event: StorageEvent) => {
      if (event.key === key || event.key === null) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function set(next: T): boolean {
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      return false;
    }
    listeners.forEach((listener) => listener());
    return true;
  }

  return { subscribe, getSnapshot, getServerSnapshot: () => fallback, set };
}

export function useLocalStore<T>(store: LocalStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

const noopSubscribe = () => () => {};

/** false di server dan render pertama, true setelah halaman hidup di browser. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}