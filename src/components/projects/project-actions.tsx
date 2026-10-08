"use client";

import { Bookmark, Heart } from "lucide-react";
import { AuthModal } from "@/components/auth/auth-modal";
import { cn } from "@/lib/utils";
import { useInteractions } from "./use-interactions";

const actionButton =
  "inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-canvas px-4 text-sm font-semibold hover:border-ink";

export function ProjectActions({ projectId, likes }: { projectId: string; likes: number }) {
  const { liked, saved, likeCount, request, modal } = useInteractions(projectId, likes);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => request("like")}
          aria-pressed={liked}
          className={actionButton}
        >
          <Heart className={cn("size-4 text-berry", liked && "fill-berry")} aria-hidden="true" />
          {liked ? "Disukai" : "Sukai"}
          <span className="font-normal text-muted">{likeCount}</span>
        </button>
        <button
          type="button"
          onClick={() => request("save")}
          aria-pressed={saved}
          className={actionButton}
        >
          <Bookmark className={cn("size-4", saved && "fill-iris text-iris")} aria-hidden="true" />
          {saved ? "Tersimpan" : "Simpan"}
        </button>
      </div>

      <AuthModal {...modal} />
    </>
  );
}