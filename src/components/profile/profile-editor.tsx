// src/components/profile/profile-editor.tsx
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { LoginGate } from "@/components/auth/login-gate";
import { SuccessBanner } from "@/components/feedback/success-banner";
import { Button } from "@/components/ui/button";
import { controlStyles, Field, FieldMessage } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { UserAvatar } from "@/components/ui/user-avatar";
import { DISCIPLINES } from "@/lib/constants";
import { useAuth, type User } from "@/lib/local/auth";
import { processAvatar } from "@/lib/local/image";
import { saveProfile } from "@/lib/local/profile";
import { profileSchema } from "@/lib/schemas/profile";
import { toFieldErrors } from "@/lib/schemas/auth";
import { MAX_LINKS, SOCIAL_PLATFORMS, validateLinks } from "@/lib/social";
import { newId } from "@/lib/local/utils";

type LinkRow = { id: string; platform: string; url: string };

type Draft = {
  name: string;
  username: string;
  discipline: string;
  location: string;
  bio: string;
  avatar: string | null;
  links: LinkRow[];
};

const BIO_MAX = 240;
const ORDER = ["name", "username", "discipline", "location", "bio"];

function draftFrom(user: User): Draft {
  return {
    name: user.name,
    username: user.username,
    discipline: user.discipline,
    location: user.location,
    bio: user.bio,
    avatar: user.avatar,
    links: user.links.map((l) => ({ id: newId("l-"), ...l })),
  };
}

function ProfileForm({ user }: { user: User }) {
  const [draft, setDraft] = useState<Draft>(() => draftFrom(user));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [linkErrors, setLinkErrors] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function patch(next: Partial<Draft>) {
    setSaved(false);
    setDraft((d) => ({ ...d, ...next }));
  }

  function patchLink(id: string, next: Partial<LinkRow>) {
    patch({ links: draft.links.map((l) => (l.id === id ? { ...l, ...next } : l)) });
  }

  async function onPickAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setAvatarBusy(true);
    try {
      patch({ avatar: await processAvatar(file) });
      setErrors((prev) => {
        const next = { ...prev };
        delete next.avatar;
        return next;
      });
    } catch (e) {
      setErrors((prev) => ({
        ...prev,
        avatar: e instanceof Error ? e.message : "Foto tidak bisa diproses.",
      }));
    } finally {
      setAvatarBusy(false);
    }
  }

  function focusId(id: string) {
    document.getElementById(id)?.focus();
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(false);

    const parsed = profileSchema.safeParse(draft);
    const fieldErrors = parsed.success ? {} : toFieldErrors(parsed.error);
    const { links, errors: badLinks } = validateLinks(draft.links);

    if (!parsed.success || Object.keys(badLinks).length > 0) {
      setErrors(fieldErrors);
      setLinkErrors(badLinks);
      const first = ORDER.find((k) => k in fieldErrors);
      if (first) focusId(`profile-${first}`);
      else {
        const index = Number(Object.keys(badLinks)[0]);
        const row = draft.links[index];
        if (row) focusId(`link-url-${row.id}`);
      }
      return;
    }

    setErrors({});
    setLinkErrors({});
    setSaving(true);
    const result = saveProfile({
      name: parsed.data.name,
      username: parsed.data.username,
      discipline: parsed.data.discipline,
      location: parsed.data.location,
      bio: parsed.data.bio,
      avatar: draft.avatar,
      links,
    });
    setSaving(false);

    if (!result.ok) {
      setErrors({ [result.field]: result.message });
      focusId(`profile-${result.field}`);
      return;
    }

    setDraft(draftFrom(result.user));
    setSaved(true);
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-10">
      <section aria-labelledby="foto-heading" className="space-y-3">
        <h2 id="foto-heading" className="font-display text-2xl">
          Foto profil
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <UserAvatar name={draft.name || "?"} src={draft.avatar} size="lg" />
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <input
                id="profile-avatar"
                type="file"
                accept="image/*"
                onChange={onPickAvatar}
                className="peer sr-only"
              />
              <label
                htmlFor="profile-avatar"
                className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-ink px-4 text-sm font-semibold hover:bg-ink hover:text-canvas peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt"
              >
                {avatarBusy ? "Memproses…" : draft.avatar ? "Ganti foto" : "Pilih foto"}
              </label>
              {draft.avatar ? (
                <button
                  type="button"
                  onClick={() => patch({ avatar: null })}
                  className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-muted hover:text-berry"
                >
                  Hapus foto
                </button>
              ) : null}
            </div>
            <FieldMessage
              id="avatar-pesan"
              error={errors.avatar}
            //   hint="Dipotong persegi dari tengah dan diperkecil otomatis."
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="info-heading" className="space-y-5">
        <h2 id="info-heading" className="font-display text-2xl">
          Tentang kamu
        </h2>
        <Field
          id="profile-name"
          label="Nama tampilan"
          name="name"
          maxLength={40}
          value={draft.name}
          onChange={(e) => patch({ name: e.target.value })}
          error={errors.name}
        />
        <Field
          id="profile-username"
          label="Username"
          name="username"
          maxLength={20}
          autoCapitalize="none"
          spellCheck={false}
          value={draft.username}
          onChange={(e) => patch({ username: e.target.value })}
          hint="Alamat profilmu: /creators/username"
          error={errors.username}
        />
        <SelectField
          id="profile-discipline"
          label="Disiplin utama"
          name="discipline"
          options={DISCIPLINES}
          placeholder="Pilih disiplin"
          value={draft.discipline}
          onChange={(e) => patch({ discipline: e.target.value })}
          error={errors.discipline}
        />
        <Field
          id="profile-location"
          label="Lokasi (opsional)"
          name="location"
          maxLength={40}
          placeholder="Contoh: Semarang"
          value={draft.location}
          onChange={(e) => patch({ location: e.target.value })}
          error={errors.location}
        />
        <div className="space-y-1.5">
          <label htmlFor="profile-bio" className="text-sm font-medium">
            Bio (opsional)
          </label>
          <textarea
            id="profile-bio"
            name="bio"
            rows={4}
            maxLength={BIO_MAX}
            value={draft.bio}
            onChange={(e) => patch({ bio: e.target.value })}
            aria-invalid={errors.bio ? true : undefined}
            aria-describedby="profile-bio-pesan"
            className={controlStyles(Boolean(errors.bio), "py-2.5")}
          />
          <FieldMessage
            id="profile-bio-pesan"
            error={errors.bio}
            hint={`${draft.bio.length}/${BIO_MAX} karakter`}
          />
        </div>
      </section>

      <section aria-labelledby="tautan-heading" className="space-y-4">
        <div>
          <h2 id="tautan-heading" className="font-display text-2xl">
            Tautan
          </h2>
          <p className="mt-1 text-sm text-muted">
            Tambahkan akun media sosial atau situs portofoliomu. Maksimal {MAX_LINKS} tautan.
          </p>
        </div>

        {draft.links.length === 0 ? (
          <p className="text-sm text-muted">Belum ada tautan.</p>
        ) : (
          <ul className="space-y-4">
            {draft.links.map((row, i) => (
              <li key={row.id} className="space-y-1.5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                  <div className="sm:w-44">
                    <label htmlFor={`link-platform-${row.id}`} className="sr-only">
                      Platform tautan {i + 1}
                    </label>
                    <select
                      id={`link-platform-${row.id}`}
                      value={row.platform}
                      onChange={(e) => patchLink(row.id, { platform: e.target.value })}
                      className={controlStyles(false)}
                    >
                      {SOCIAL_PLATFORMS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label htmlFor={`link-url-${row.id}`} className="sr-only">
                      Alamat tautan {i + 1}
                    </label>
                    <input
                      id={`link-url-${row.id}`}
                      value={row.url}
                      onChange={(e) => patchLink(row.id, { url: e.target.value })}
                      placeholder="instagram.com/namamu"
                      inputMode="url"
                      autoCapitalize="none"
                      spellCheck={false}
                      aria-invalid={linkErrors[i] ? true : undefined}
                      aria-describedby={linkErrors[i] ? `link-error-${row.id}` : undefined}
                      className={controlStyles(Boolean(linkErrors[i]))}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => patch({ links: draft.links.filter((l) => l.id !== row.id) })}
                    aria-label={`Hapus tautan ${i + 1}`}
                    className="grid size-11 shrink-0 place-items-center text-muted hover:text-berry"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
                {linkErrors[i] ? (
                  <p id={`link-error-${row.id}`} className="text-sm text-berry">
                    {linkErrors[i]}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        <Button
          type="button"
          variant="outline"
          disabled={draft.links.length >= MAX_LINKS}
          onClick={() =>
            patch({
              links: [...draft.links, { id: newId("l-"), platform: "instagram", url: "" }],
            })
          }
        >
          <Plus className="size-4" aria-hidden="true" />
          Tambah tautan
        </Button>
      </section>

      {saved ? (
        <SuccessBanner title="Profil tersimpan">
          <Link href={`/creators/${draft.username}`} className="font-semibold text-iris underline underline-offset-4">
            Lihat profil publik
          </Link>
        </SuccessBanner>
      ) : null}

      <Button type="submit" disabled={saving || avatarBusy} className="w-full sm:w-auto">
        {saving ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Menyimpan…
          </>
        ) : (
          "Simpan profil"
        )}
      </Button>
    </form>
  );
}

export function ProfileScreen() {
  const { user, ready } = useAuth();

  if (!ready) {
    return <div aria-busy="true" aria-label="Memuat profil" className="h-64 animate-pulse rounded-2xl bg-surface" />;
  }
  if (!user) {
    return (
      <LoginGate
        title="Masuk untuk mengatur profil"
        body="Setelah masuk, kamu bisa mengubah foto, bio, dan menambahkan tautan sosial."
      />
    );
  }
  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-10">
      <header className="space-y-2">
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">Profil</h1>
        <p className="text-muted">Atur bagaimana kamu tampil di ArtSpace.</p>
      </header>
      {/* key: form dibuat ulang jika berganti akun */}
      <ProfileForm key={user.id} user={user} />
    </div>
  );
}