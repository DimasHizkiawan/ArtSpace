"use client";

import { Bookmark, Heart } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "@/components/auth/auth-modal";

type AuthAction = "like" | "save";

const AUTH_TITLES: Record<AuthAction, string> = {
  like: "Masuk untuk menyukai karya",
  save: "Masuk untuk menyimpan karya",
};

const actionButton =
  "inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-canvas px-4 text-sm font-semibold hover:border-ink";

export function ProjectActions({ likes }: { likes: number }) {
  const [authAction, setAuthAction] = useState<AuthAction | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setAuthAction("like")} className={actionButton}>
          <Heart className="size-4 text-berry" aria-hidden="true" />
          Sukai
          <span className="font-normal text-muted">{likes}</span>
        </button>
        <button type="button" onClick={() => setAuthAction("save")} className={actionButton}>
          <Bookmark className="size-4" aria-hidden="true" />
          Simpan
        </button>
      </div>

      <AuthModal
        open={authAction !== null}
        title={AUTH_TITLES[authAction ?? "like"]}
        onClose={() => setAuthAction(null)}
      />
    </>
  );
}