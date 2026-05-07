# octgen

Kumpulan prompt generate gambar — SvelteKit SPA + PocketBase, mobile-first.

## Stack

- **Frontend**: SvelteKit 2 (SPA mode via `adapter-static`) + Svelte 5 runes + Tailwind v4 + shadcn-svelte (vega style, zinc base color)
- **Backend**: PocketBase v0.37.5 (single Go binary, SQLite, REST + admin UI)
- **Hybrid backend**:
  - Dev: lokal `backend/pocketbase.exe` di `http://127.0.0.1:8090`
  - Prod: hosted di [PocketHost](https://promptfesor.pockethost.io)

## Struktur

```
octgen/
├─ backend/
│  ├─ pocketbase.exe          # gitignored, download manual
│  ├─ pb_data/                # gitignored, generated
│  └─ pb_migrations/          # schema-as-code (committed)
├─ frontend/                  # SvelteKit SPA
└─ README.md
```

## First-time setup

### 1. Backend

Binary sudah ada di `backend/pocketbase.exe`. Kalau hilang, download lagi:
[pocketbase v0.37.5 windows amd64](https://github.com/pocketbase/pocketbase/releases/download/v0.37.5/pocketbase_0.37.5_windows_amd64.zip).

```powershell
cd backend
.\pocketbase.exe serve --http=127.0.0.1:8090
```

Buka <http://127.0.0.1:8090/_/> di browser, daftar akun admin pertama. Migrations otomatis ke-apply (collections `tags` & `prompts` muncul).

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Buka <http://localhost:5173>.

## Daily run

Dua terminal:

```powershell
# Terminal 1
cd backend
.\pocketbase.exe serve

# Terminal 2
cd frontend
npm run dev
```

## Tambah prompt

1. Buka <http://127.0.0.1:8090/_/> (admin UI)
2. Login → Collections → `tags` → New record (isi `name` + `slug` lowercase pakai dash)
3. Collections → `prompts` → New record:
   - `title`, `slug`, `body` (isi prompt), `description` (caption singkat)
   - `tags` → multi-select dari tag yang sudah dibuat
   - `images` → upload 1-8 gambar (jpg/png/webp/avif, ≤5MB)
   - `featured` → centang untuk tampil di section Featured di home

Refresh frontend, prompt muncul.

## Schema

### `tags`
- `name` (text, unique, max 50)
- `slug` (text, unique, lowercase + dash, max 50)
- `created`, `updated` (auto)
- API rules: list/view = public, create/update/delete = admin only

### `prompts`
- `title` (text, max 200)
- `slug` (text, unique, lowercase + dash)
- `body` (text, max 5000) — isi prompt yang akan di-copy
- `description` (text, max 500, optional)
- `tags` (relation → `tags`, multi, max 10)
- `images` (file, max 8, max 5MB each, jpg/png/webp/avif, thumbs `400x400` & `800x0`)
- `featured` (bool)
- `created`, `updated` (auto)
- API rules: list/view = public, create/update/delete = admin only

Schema didefinisikan di `backend/pb_migrations/`. Edit migration files (atau bikin migration baru) untuk ubah schema, jangan edit lewat admin UI di lokal supaya reproducible.

## Build untuk produksi

```powershell
cd frontend
npm run build       # output ke frontend/build/
```

`build/` adalah static SPA — bisa di-upload ke Cloudflare Pages, Netlify, Vercel static, GitHub Pages, dll.

### Deploy ke Vercel

1. Login [vercel.com](https://vercel.com) → **Add New → Project** → import GitHub repo `rahmanramsi/octgen`.
2. **Project Settings** sebelum deploy pertama:
   - **Root Directory**: `frontend` (penting! karena SvelteKit bukan di repo root)
   - **Framework Preset**: SvelteKit (auto-detected; biar Vercel)
   - **Build Command**, **Output Directory**, **Install Command**: biarkan auto (sudah ditangani `frontend/vercel.json`)
3. **Environment Variables** → tambah:
   - Name: `PUBLIC_PB_URL`
   - Value: `https://promptfesor.pockethost.io` (atau URL PocketBase prod kamu)
   - Environment: Production, Preview, Development (centang semua)
4. **Deploy**. Tunggu ~1 menit. Vercel kasih URL `https://octgen-xxx.vercel.app`.

### CORS di hosted PocketBase

Setelah Vercel domain terbentuk, login admin PocketHost → **Settings → CORS** → tambah origin Vercel:

```
https://octgen-xxx.vercel.app
https://*.vercel.app   # opsional, biar preview deployments juga jalan
```

Tanpa ini, frontend di prod akan kena CORS error saat fetch ke PocketBase.

### Schema di hosted PocketBase (PocketHost — via FTP)

PocketHost expose direktori `pb_migrations/` lewat FTP. Cara paling rapi: upload migration files dari `backend/pb_migrations/` lokal ke remote — PocketHost auto-restart dan apply. Migrations sudah idempotent (skip kalau collection udah ada).

**FTP credentials** dari dashboard PocketHost:
- Server: `ftp.pockethost.io`
- Port: `21`
- User: email akun (mis. `kamu@gmail.com`)
- Password: dari dashboard
- Mode: **passive**, plain FTP (bukan SFTP)

**Pakai WinSCP (paling gampang di Windows):**

1. Download [WinSCP](https://winscp.net/)
2. New Site:
   - File protocol: **FTP**
   - Encryption: **No encryption** (atau "TLS Explicit" kalau didukung)
   - Host: `ftp.pockethost.io`, Port: `21`
   - User: email, Password: dari dashboard
3. Connect → cd ke `/pb_migrations/`
4. Drag-drop dua file dari `backend/pb_migrations/` lokal:
   - `1730000000_init_tags.js`
   - `1730000100_init_prompts.js`
5. PocketHost detect file change → restart instance otomatis (atau via dashboard kalau gak otomatis)
6. Verifikasi di `https://promptfesor.pockethost.io/_/` → Collections → `tags` dan `prompts` muncul

**Pakai curl (one-liner):**

```powershell
$user = "your-email@example.com"
$pass = "<paste-from-pockethost>"
curl.exe -T backend/pb_migrations/1730000000_init_tags.js "ftp://${user}:${pass}@ftp.pockethost.io/pb_migrations/"
curl.exe -T backend/pb_migrations/1730000100_init_prompts.js "ftp://${user}:${pass}@ftp.pockethost.io/pb_migrations/"
```

⚠ Jangan paste password di chat / commit ke git. Set ke variable PowerShell yang akan hilang setelah session.

**Update schema nanti:** kalau perlu ubah field/collection, bikin file migration baru di `backend/pb_migrations/` dengan timestamp lebih baru (`<timestamp>_<nama>.js`), test lokal, lalu upload via FTP. Jangan edit migration lama yang udah applied — bisa bikin checksum mismatch.

### Custom domain (opsional)

Vercel Project → **Settings → Domains** → tambah domain kamu, ikuti DNS instruction. Setelah verified, jangan lupa update CORS PocketBase pakai domain final.

## Migrasi schema lokal → hosted PocketHost

1. Lokal: <http://127.0.0.1:8090/_/> → Settings → Export collections → download JSON
2. Hosted: <https://promptfesor.pockethost.io/_/> → Settings → Import collections → upload JSON → confirm

Data record (prompts/tags) di-bikin manual di hosted admin UI — schema export gak include data.

CORS hosted: kalau frontend prod kena CORS error, login admin → Settings → CORS, allow domain frontend.

## Security notes

- **Admin token jangan masuk ke frontend bundle.** Frontend SPA = HTML+JS yang bisa di-download visitor. Kalau admin token di-embed, semua orang bisa CRUD. Frontend ini hanya pakai PocketBase anonymous client (read public), tidak butuh token.
- Untuk seed/automation script, simpan kredensial di env var (`PB_EMAIL`, `PB_PASSWORD`) — jangan hardcode di kode atau commit ke git.

## Tech notes

- **Svelte 5 runes** — pakai `$props`, `$state`, `$derived`, snippet `child` props.
- **Mobile-first**:
  - Tap target ≥44px (Button default size pakai `h-9` ditingkatin ke `h-11` di mobile pada SearchBar/TagFilter)
  - Sticky search/filter bar di list view
  - `Sheet` dari kanan untuk filter di mobile
  - Lightbox `Dialog` fullscreen dengan keyboard nav
  - Image lazy load + thumbs (400x400 untuk grid, 800x0 untuk lightbox)
- **shadcn-svelte v1.2** style `vega` (Lucide / Inter) — komponen ada di `frontend/src/lib/components/ui/`. Composite custom di `frontend/src/lib/components/`.
- **PocketBase JS SDK** singleton di `frontend/src/lib/pocketbase.ts`.
