# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with HMR (Vite)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

No test suite or linter is configured.

## Architecture

**Samik** is a fully static Vue 3 SPA for a private cocktail bar. There is no backend — all data lives in `src/data/cocktails.json`.

### Stack

- Vue 3 Composition API (`<script setup>`)
- Vue Router 4 with hash history (`/#/menu`, `/#/info`)
- Tailwind CSS v4 via `@tailwindcss/vite` — no `tailwind.config.js`; theme tokens are defined in `src/style.css` using `@theme`
- Vite 8 as build tool

### Page structure

Three routes, each a page component in `src/pages/`:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `MainPage.vue` | Hero + teaser strip |
| `/menu` | `MenuPage.vue` | Cocktail list with base filter + expandable ingredients |
| `/info` | `InfoPage.vue` | Hours, visit guidelines, location |

`App.vue` wraps all pages with `NavBar.vue` (fixed header) and `SiteFooter.vue`.

### Data layer

`src/data/cocktails.json` is the single source of truth. Each cocktail has: `id`, `name`, `base`, `description`, `ingredients[]`, `tags[]`.

`MenuPage.vue` derives filter tabs dynamically from the `base` field using a computed property — adding a new base type requires only a new entry in the JSON.

### Styling conventions

- Custom color tokens (`--color-bar-black`, `--color-bar-gold`, etc.) are defined in `src/style.css` and used as Tailwind utilities (`bg-bar-black`, `text-bar-gold`).
- Dynamic per-element colors use inline `:style` bindings rather than Tailwind classes.
- Fonts: Cormorant Garamond (serif, italic, headings) + Lato (sans, body) loaded from Google Fonts in `src/style.css`.
- Only `MenuPage.vue` uses `<style scoped>` — for the ingredient fade transition. Prefer inline styles or Tailwind elsewhere.
