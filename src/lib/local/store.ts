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
/**
 * 
 * Garis kode const noopSubscribe = () => () => {}; adalah sebuah fungsi pendek di JavaScript yang jika diterjemahkan artinya: 
 * "Fungsi yang tidak melakukan apa-apa, dan menghasilkan fungsi lain yang juga tidak melakukan apa-apa." [1]
Nama noop sendiri adalah singkatan dari "No Operation" (tidak ada operasi/aksi).
Untuk memahaminya dengan mudah, mari kita bongkar strukturnya dan cari tahu mengapa kode ini harus ditulis seperti itu.

1. Pembongkaran Struktur Kode

Jika kode ringkas (panah berganda) tersebut ditulis dalam bentuk fungsi biasa (panjang), bentuknya adalah seperti ini:
typescript
const noopSubscribe = function() {
  // Fungsi luar: saat dipanggil, tidak melakukan apa-apa...
  
  return function() {
    // Fungsi dalam (kembalian): saat dipanggil, juga tidak melakukan apa-apa...
  };
};
Gunakan kode dengan hati-hati.

2. Mengapa Kode Ini Dibutuhkan pada useHydrated?

Pada baris terakhir di file Anda, fungsi tersebut digunakan di dalam useSyncExternalStore:
typescript
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
Gunakan kode dengan hati-hati.
Fungsi useSyncExternalStore milik React wajib menerima parameter pertama berupa fungsi subscribe. Tugas asli fungsi subscribe adalah mendengarkan perubahan data (seperti mendengarkan klik, ketikan, atau perubahan database).
Namun, pada fungsi useHydrated, nilainya bersifat permanen dan tidak akan pernah berubah lagi setelah halaman web aktif di browser (nilainya langsung berubah dari false di server menjadi true di browser, lalu menetap selamanya).
Karena nilainya tidak akan pernah berubah lagi, kita tidak butuh sistem pendengar/pemantau data apa pun. Tapi, karena React mewajibkan parameter tersebut ada (jika dikosongkan akan error), maka dibuatlah noopSubscribe sebagai "tumbal" atau formalitas saja untuk menyenangkan React.
 */
/** false di server dan render pertama, true setelah halaman hidup di browser. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}