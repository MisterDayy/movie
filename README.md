# Watchly

Website discovery & streaming movie/TV berbahasa Indonesia, ditenagai [DayyAPI](https://dayyapi.vercel.app) (proxy TMDB). Dibangun dengan React + Vite + TypeScript + Tailwind CSS v4 + React Router + Motion.

## Jalankan Lokal

**Prasyarat:** Node.js 18+

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Build Production

```bash
npm run build
npm run preview   # opsional, untuk preview hasil build
```

## Deploy ke Vercel

Tidak perlu environment variable apa pun — base URL API sudah di-hardcode ke `https://dayyapi.vercel.app`.

**Via Vercel Dashboard:**
1. Push project ini ke repo GitHub/GitLab/Bitbucket.
2. Import repo di [vercel.com/new](https://vercel.com/new).
3. Vercel otomatis mendeteksi framework Vite (konfigurasi juga sudah eksplisit di `vercel.json`). Klik Deploy.

**Via Vercel CLI:**
```bash
npm i -g vercel
vercel
```

## Struktur Project

```
src/
  api/dayyapi.ts       -> fetch functions + TypeScript interfaces untuk semua endpoint DayyAPI
  components/          -> BannerCarousel, MovieCard, LandscapeCard, CastList, ServerSelector, Skeleton, Header, GenreProvider
  pages/                -> Home, Browse, Search, Detail, Watch
  App.tsx               -> routing (HashRouter) + layout global
  index.css             -> design tokens (warna, radius) via Tailwind v4 @theme
```

Routing menggunakan `HashRouter` sehingga tidak butuh konfigurasi rewrite server khusus untuk client-side routing (walau `vercel.json` tetap menyertakan rewrite sebagai safety net).
