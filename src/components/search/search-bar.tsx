// src/components/search/search-bar.tsx
"use client";

import { useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  /** Halaman tujuan hasil pencarian, misalnya "/" atau "/explore". */
  basePath: string;
  /** Kata kunci yang sedang aktif di URL. */
  q: string;
  /** Filter disiplin aktif; dipertahankan saat mencari. */
  disiplin?: string | undefined;
  label: string;
  placeholder: string;
};

export function SearchBar({ basePath, q, disiplin, label, placeholder }: Props) {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(q);
  const [seenQ, setSeenQ] = useState(q);

  // Selaraskan kolom dengan URL saat q berubah dari luar
  // (tombol Kembali, atau tautan "Hapus pencarian").
  if (q !== seenQ) {
    setSeenQ(q);
    setValue(q);
  }

  function go(term: string) {
    const params = new URLSearchParams();
    const trimmed = term.trim();
    if (trimmed) params.set("q", trimmed);
    if (disiplin) params.set("disiplin", disiplin);
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${basePath}?${query}` : basePath, { scroll: false });
    });
  }

  return (
    // action + method membuat pencarian tetap jalan sebelum JavaScript siap.
    <form
      role="search"
      action={basePath}
      method="get"
      aria-busy={pending}
      onSubmit={(e) => {
        e.preventDefault();
        go(value);
      }}
      className="flex gap-2"
    >
      {disiplin ? <input type="hidden" name="disiplin" value={disiplin} /> : null}
      <div className="relative flex-1">
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id={inputId}
          name="q"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          maxLength={80}
          className="block min-h-11 w-full rounded-md border border-line bg-canvas pl-10 pr-11 text-base text-ink placeholder:text-muted/70 hover:border-ink [&::-webkit-search-cancel-button]:hidden"
        />
        {value ? (
          <button
            type="button"
            aria-label="Hapus kata kunci"
            onClick={() => {
              setValue("");
              inputRef.current?.focus();
              if (q) go("");
            }}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-ink"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Mencari…
          </>
        ) : (
          "Cari"
        )}
      </Button>
    </form>
  );
}
