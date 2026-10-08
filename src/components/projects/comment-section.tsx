// src/components/projects/comment-section.tsx
"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { controlStyles, FieldMessage } from "@/components/ui/field";
import { addComment, deleteComment, useProjectActivity } from "@/lib/local/activity";
import { useAuth } from "@/lib/local/auth";
import { commentSchema } from "@/lib/schemas/project";

const MAX = 500;

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

export function CommentSection({ projectId }: { projectId: string }) {
  const { user, ready } = useAuth();
  const { comments } = useProjectActivity(projectId);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [authOpen, setAuthOpen] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = commentSchema.safeParse({ text });
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    if (!addComment(projectId, result.data.text)) {
      setError("Komentar gagal disimpan. Periksa penyimpanan browser lalu coba lagi.");
      return;
    }
    setText("");
    setError(undefined);
  }

  const newestFirst = [...comments].reverse();

  return (
    <section aria-labelledby="komentar-heading" className="max-w-3xl space-y-5">
      <h2 id="komentar-heading" className="font-display text-3xl">
        Komentar <span className="text-muted">({comments.length})</span>
      </h2>

      {!ready ? null : user ? (
        <form onSubmit={onSubmit} noValidate className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor={`komentar-${projectId}`} className="text-sm font-medium">
              Tulis komentar sebagai {user.name}
            </label>
            <textarea
              id={`komentar-${projectId}`}
              rows={3}
              maxLength={MAX}
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby="komentar-pesan"
              className={controlStyles(Boolean(error), "py-2.5")}
            />
            <FieldMessage
              id="komentar-pesan"
              error={error}
              hint={`${text.length}/${MAX} karakter`}
            />
          </div>
          <Button type="submit">Kirim komentar</Button>
        </form>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">Masuk untuk ikut berkomentar di karya ini.</p>
          <Button type="button" onClick={() => setAuthOpen(true)}>
            Masuk
          </Button>
        </div>
      )}

      {newestFirst.length === 0 ? (
        <p className="text-sm text-muted">Belum ada komentar. Jadilah yang pertama.</p>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {newestFirst.map((c) => (
            <li key={c.id} className="flex gap-3 py-4">
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-canvas"
              >
                {c.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{c.name}</span>{" "}
                  <span className="text-muted">{formatTime(c.createdAt)}</span>
                </p>
                <p className="mt-1 whitespace-pre-line break-words">{c.text}</p>
              </div>
              {user?.id === c.userId ? (
                <button
                  type="button"
                  onClick={() => deleteComment(projectId, c.id)}
                  aria-label="Hapus komentar"
                  className="grid size-11 shrink-0 place-items-center text-muted hover:text-berry"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        title="Masuk untuk berkomentar"
      />
    </section>
  );
}