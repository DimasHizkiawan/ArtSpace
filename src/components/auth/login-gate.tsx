// src/components/auth/login-gate.tsx
"use client";

import { useState } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";

type Props = { title: string; body: string };

/** Pengganti halaman untuk pengunjung yang belum masuk. */
export function LoginGate({ title, body }: Props) {
  const [mode, setMode] = useState<"login" | "signup" | null>(null);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <h1 className="font-display text-4xl">{title}</h1>
      <p className="text-muted">{body}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={() => setMode("login")}>
          Masuk
        </Button>
        <Button type="button" variant="outline" onClick={() => setMode("signup")}>
          Daftar
        </Button>
      </div>
      <AuthModal
        open={mode !== null}
        initialMode={mode ?? "login"}
        onClose={() => setMode(null)}
      />
    </div>
  );
}