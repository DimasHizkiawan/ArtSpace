# ArtSpace — Portofolio Kreatif

Prototipe frontend responsif ArtSpace berbasis Next.js + TypeScript + Tailwind CSS.

## UX utama

ArtSpace memakai pola **browse first, authenticate when needed**:

- Beranda, galeri, detail proyek, eksplorasi, dan profil kreator dapat dilihat tanpa login.
- Like, simpan, komentar, dan follow memunculkan **auth modal** ketika pengguna belum masuk.
- Halaman `/masuk` dan `/daftar` tetap tersedia untuk akses autentikasi langsung.
- Data masih dummy lokal dan repository dipisahkan agar mudah diganti API.

## Breakpoint target

- Mobile: 360px+
- Tablet: 768px+
- Desktop: 1280px+

## Jalankan

```bash
npm install
npm run dev
```

## Validasi

TypeScript diperiksa dengan:

```bash
npx tsc --noEmit
```

Build production membutuhkan paket SWC platform yang dapat diunduh oleh Next.js pada environment lokal.
