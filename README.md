# Koefo ✂

> Premium client-side Instagram Carousel Splitter — by sumincreates

Drop a wide image, pick 2–10 panels, preview, and download every slide as a ZIP.
Everything runs in the browser. No uploads. No accounts. No nonsense.

## Tech

- React 19 + Vite 7
- Tailwind CSS v4 (`@tailwindcss/vite`)
- framer-motion, lucide-react, wouter
- jszip + react-dropzone for the splitter core
- shadcn/ui primitives (Radix)

## Quick start

You need **Node.js 20 or 22+** and a package manager (npm, pnpm, or yarn).

```bash
# 1. Install dependencies
npm install
# or: pnpm install
# or: yarn

# 2. Run the dev server
npm run dev
# → opens at http://localhost:5173

# 3. Build for production
npm run build
# → outputs static files to ./dist

# 4. Preview the production build locally
npm run preview
# → opens at http://localhost:4173
```

## Deploy

Koefo is a fully **static** site — no backend, no database, no env vars.
After `npm run build`, just upload the contents of the `dist/` folder to any static host:

- **Netlify** — drag `dist/` into the Netlify dashboard, or run `netlify deploy --prod --dir=dist`
- **Vercel** — `vercel --prod` from the project root, or import the repo in the Vercel dashboard
- **Cloudflare Pages** — connect the repo, set build command `npm run build`, output dir `dist`
- **GitHub Pages** — push `dist/` to the `gh-pages` branch
- **S3 / Cloudflare R2 / any CDN** — upload `dist/` and serve `index.html`

For SPAs that use client-side routing, configure your host to fall back to `index.html` for unknown routes (Netlify: a `_redirects` file with `/* /index.html 200`; Vercel: handled automatically).

## Environment variables

**None.** This app does not need any `.env` file.

## Project structure

```
koefo-standalone/
├── index.html              # Vite HTML entry
├── package.json            # Dependencies + scripts
├── vite.config.ts          # Vite config (React + Tailwind v4)
├── tsconfig.json           # TypeScript config
├── components.json         # shadcn/ui config
├── .gitignore
├── README.md
├── public/
│   ├── favicon.svg
│   └── opengraph.jpg       # Social-share preview image
└── src/
    ├── main.tsx            # React bootstrap
    ├── App.tsx             # Router (wouter)
    ├── index.css           # Tailwind theme + custom styles
    ├── pages/
    │   ├── Home.tsx        # Main splitter UI
    │   └── not-found.tsx
    ├── hooks/
    │   ├── use-image-splitter.ts   # Core slicing logic (canvas + jszip)
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    ├── lib/
    │   └── utils.ts        # cn() + formatBytes()
    └── components/ui/      # shadcn/ui primitives
```

## License

MIT — built by sumincreates. Use it, fork it, ship it.
