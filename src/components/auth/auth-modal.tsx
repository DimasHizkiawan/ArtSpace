// src/components/auth/auth-modal.tsx
"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

type Props = {
  open: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  title?: string;
  onSuccess?: () => void;
};

export function AuthModal({
  open,
  onClose,
  initialMode = "login",
  title = "Lanjutkan di ArtSpace",
  onSuccess,
}: Props) {
  const [mode, setMode] =
    useState<AuthMode>(initialMode);

  const [mounted, setMounted] =
    useState(false);

  const closeButtonRef =
    useRef<HTMLButtonElement>(null);

  /*
   * Portal hanya boleh dibuat setelah
   * komponen berjalan di browser.
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * Lock background ketika modal terbuka.
   */
  useEffect(() => {
    if (!open) return;

    setMode(initialMode);

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    initialMode,
    onClose,
  ]);

  if (!mounted || !open) {
    return null;
  }

  function handleSuccess() {
    onSuccess?.();
    onClose();
  }

  const modal = (
    <div
      className="
        fixed
        inset-0
        z-[99999]
        h-[100dvh]
        w-full
      "
      role="presentation"
    >
      {/* =====================================================
          BACKDROP
          ===================================================== */}

      <div
        className="
          fixed
          inset-0
          z-0
          bg-black/65
          backdrop-blur-[3px]
        "
        aria-hidden="true"
        onMouseDown={onClose}
      />

      {/* =====================================================
          MODAL VIEWPORT
          ===================================================== */}

      <div
        className="
          fixed
          inset-0
          z-10
          flex
          items-start
          justify-center
          overflow-y-auto
          overscroll-contain
          p-4
          sm:items-center
          sm:p-6
        "
        onMouseDown={(event) => {
          if (
            event.target ===
            event.currentTarget
          ) {
            onClose();
          }
        }}
      >
        {/* =================================================
            MODAL CARD
            ================================================= */}

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          className="
            relative
            my-auto
            w-full
            max-w-md
            shrink-0
            rounded-2xl
            border
            border-line
            bg-canvas
            shadow-2xl
          "
          onMouseDown={(event) =>
            event.stopPropagation()
          }
        >
          {/* HEADER */}

          <div className="flex items-start justify-between gap-4 p-5 pb-0 sm:p-7 sm:pb-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-berry">
                ArtSpace
              </p>

              <h2
                id="auth-modal-title"
                className="mt-1 font-display text-2xl"
              >
                {title}
              </h2>

              <p className="mt-1 max-w-sm text-sm leading-6 text-muted">
                {mode === "login"
                  ? "Masuk untuk menyukai dan menyimpan karya."
                  : "Buat akun gratis untuk mulai berinteraksi dengan kreator."}
              </p>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Tutup dialog"
              className="
                inline-flex
                min-h-11
                min-w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                text-muted
                transition
                hover:bg-surface
                hover:text-ink
                focus-visible:outline-2
                focus-visible:outline-offset-2
              "
            >
              <X
                className="size-5"
                aria-hidden="true"
              />
            </button>
          </div>

          {/* CONTENT */}

          <div className="p-5 pt-5 sm:p-7 sm:pt-6">
            {/* TABS */}

            <div
              className="grid grid-cols-2 rounded-lg bg-surface p-1"
              role="tablist"
              aria-label="Autentikasi"
            >
              <button
                type="button"
                role="tab"
                aria-selected={
                  mode === "login"
                }
                onClick={() =>
                  setMode("login")
                }
                className={cn(
                  "min-h-11 rounded-md text-sm font-semibold transition",
                  mode === "login"
                    ? "bg-canvas text-ink shadow-sm"
                    : "text-muted hover:text-ink",
                )}
              >
                Masuk
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={
                  mode === "signup"
                }
                onClick={() =>
                  setMode("signup")
                }
                className={cn(
                  "min-h-11 rounded-md text-sm font-semibold transition",
                  mode === "signup"
                    ? "bg-canvas text-ink shadow-sm"
                    : "text-muted hover:text-ink",
                )}
              >
                Daftar
              </button>
            </div>

            {/* FORM */}

            <div className="mt-6">
              {mode === "login" ? (
                <LoginForm
                  onSuccess={
                    handleSuccess
                  }
                />
              ) : (
                <SignupForm
                  onSuccess={
                    handleSuccess
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /*
   * INI BAGIAN TERPENTING:
   *
   * Modal dipindahkan langsung ke <body>,
   * sehingga tidak berada di dalam <stacking></stacking>
   * context navbar.
   */
  return createPortal(
    modal,
    document.body,
  );
}