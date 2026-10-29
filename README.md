# Kwaaba Foundation Website

A React website for **Kwaaba Foundation**, built with **Vite + React Router + Framer Motion**.

## Project Structure

```
kwaaba-foundation/
├── client/                 ← Frontend (React + Vite) — fully independent
│   ├── src/
│   │   ├── pages/          ← Home, About, Gallery, Programs, etc.
│   │   ├── components/     ← Layout, HeroSlider, sections, ui
│   │   ├── admin/          ← Admin CMS interface + schema
│   │   ├── cms/            ← ContentContext + auth
│   │   └── content/        ← Seed data fallback
│   ├── public/             ← Static images
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json        ← Client dependencies
│   ├── .env                ← VITE_SERVER_URL
│   └── dist/               ← Build output
├── server/                 ← Backend (Express + SQLite + Cloudinary) — fully independent
│   ├── index.js            ← Express server entry
│   ├── db.js               ← SQLite database + queries
│   ├── cloudinary.js       ← Cloudinary configuration
│   ├── middleware/
│   │   └── auth.js         ← JWT authentication
│   ├── routes/
│   │   ├── content.js      ← Content CRUD endpoints
│   │   ├── upload.js       ← Cloudinary image upload
│   │   └── admin.js        ← Auth endpoints
│   ├── package.json        ← Server dependencies
│   ├── .env                ← Cloudinary, JWT, PORT, ADMIN_PASSWORD
│   └── node_modules/
├── .gitignore
├── .env.example            ← Template (copy to client/.env and server/.env)
└── README.md
```

## Architecture

```
Frontend (Vite/React)     Backend (Express/SQLite)    Cloudinary
┌──────────────────┐      ┌────────────────────┐      ┌───────────────┐
│  client/         │─────▶│ /api/content       │      │  Image storage│
│  Public site     │─────▶│ /api/collection/*  │─────▶│  (CDN delivery)│
│  Admin CMS       │─────▶│ /api/upload        │      └───────────────┘
└──────────────────┘      └─────────┬──────────┘
                                    │
                            ┌───────▼────────┐
                            │  kwaaba.db     │
                            │  (SQLite)      │
                            └────────────────┘
```

## Run it locally

Each folder is fully independent. Start them in separate terminals:

### 1. Start the backend

```bash
cd server
npm install
npm run dev
```
Backend runs on `http://localhost:3000`

### 2. Start the frontend

```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## Setup (first time)

### Client setup

1. Copy `.env.example` to `client/.env`
2. Set `VITE_SERVER_URL=http://localhost:3000` in `client/.env`
3. `cd client && npm install`

### Server setup

1. Copy `.env.example` to `server/.env`
2. Sign up at [cloudinary.com](https://cloudinary.com) → fill in Cloudinary credentials
3. Change `ADMIN_PASSWORD` to something secure
4. `cd server && npm install`

## Admin / CMS

Visit `http://localhost:5173/admin` — demo password: **`kwaaba2026`**
(change it in `server/.env`, `ADMIN_PASSWORD`).

The CMS manages every content collection used by the public site:

| Manager | Drives |
|---|---|
| Hero Slides | Full-screen homepage slider (image, title, kicker, CTA) |
| Impact Stats | Animated number counters on the parallax band |
| Programs | "What We Do" cards + program detail pages |
| Board / Team & Interns | People grids with bios |
| Events | Upcoming / Past events pages |
| News & Media Mentions | Homepage news feed + Resources page |
| Gallery Photos | Photo grid with lightbox |
| Newsletters | Dua Pa quarterly archive |
| Quote Marquee | Scrolling quotes strip |
| About & Founder, Settings | Mission text, founder bio, contact info, socials |

## Deploying

### Frontend (`client/`)

```bash
cd client
npm run build
```

Host `client/dist/` on **Netlify** or **Vercel**. Configure SPA rewrites:

- Netlify `_redirects`: `/* /index.html 200`
- Vercel `vercel.json`:
```json
{"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}
```

**Set this env var** in your hosting platform:
```
VITE_SERVER_URL=https://your-backend-url.here
```

### Backend (`server/`)

```bash
cd server
npm install
```

Deploy to **Railway**, **Render**, or **Fly.io**.

**Set these env vars** in your hosting platform:
```
PORT=3000
FRONTEND_URL=https://your-frontend-url.here
JWT_SECRET=a-random-string
ADMIN_PASSWORD=your-secure-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-turso-token
```

The content database lives in [Turso](https://turso.tech) (hosted SQLite), so the server needs no persistent disk.
Without `TURSO_DATABASE_URL` the server uses the local `kwaaba.db` file instead (handy for local dev).
To copy the local database into Turso: add the two `TURSO_*` values to `server/.env`, then `cd server && npm run db:push`.

## Brand palette

- Primary blue `#2271b1` · deep navy `#0c2d4d`
- Green `#27ae60` · Bronze `#cd7f32` · CTA orange `#ff5505` · Cream `#fffaf2`