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

**Samik** is a fully static Vue 3 SPA for a private cocktail bar. No backend — all data originates from JSON files in `src/data/`, with runtime edits persisted to `localStorage`.

### Stack

- Vue 3 Composition API (`<script setup>`)
- Vue Router 4 with hash history
- Tailwind CSS v4 via `@tailwindcss/vite` — no `tailwind.config.js`; theme tokens are defined in `src/style.css` using `@theme`
- Vite 8 as build tool

### Page structure

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `MainPage.vue` | Hero + teaser strip |
| `/menu` | `CategoryListPage.vue` | Category grid + cross-category search |
| `/menu/:id` | `CategoryPage.vue` | Items within a category |
| `/menu/:id/:itemId` | `ItemDetailPage.vue` | Single item detail |
| `/admin` | `AdminPage.vue` | Password-gated CRUD for categories and items |

`App.vue` wraps all pages with `NavBar.vue` (fixed header) and `SiteFooter.vue`.

### Data layer

Two-tier data model:

- **`src/data/categories.json`** — ordered list of categories. Each entry: `id`, `name`, `type` (`cocktail` | `spirit` | `wine`), `description`, `coverImage`, optional `note`.
- **`src/data/items/<catId>.json`** — one file per category. Cocktails/spirits are flat arrays; wines are grouped arrays `[{ subcategory, note, items: [...] }]` with `glassPrice`/`bottlePrice` fields instead of `ingredients`.

**`src/composables/useMenuData.js`** is the single reactive store — it wraps both JSON files and `localStorage`. It loads source JSON at startup, overlays any `localStorage` edits (`samik_cats`, `samik_admin_<catId>`), and exposes `getItems`, `saveItem`, `deleteItem`, `saveCategory`, `deleteCategory`, `exportCategories`, `exportItems`, and `resetAll`. All pages read/write through this composable.

The Admin page saves changes to `localStorage` only. To persist edits into source files, use **Export JSON** and replace the relevant file in `src/data/`.

### Components

- **`WatercolorIllustration.vue`** — SVG-based procedural illustration; palette and glass shape are derived from the category id and item name. Used as fallback art when an item has no `image` field.
- **`CocktailModal.vue`** — slide-up detail sheet opened from search results or category pages. Shows `WatercolorIllustration` unless `item.image` is set.

### Styling conventions

- Custom color tokens (`--color-bar-black`, `--color-bar-gold`, etc.) are defined in `src/style.css` and used as Tailwind utilities (`bg-bar-black`, `text-bar-gold`).
- Most pages use `<style scoped>` with raw CSS rather than Tailwind utilities. Inline `:style` bindings are used for dynamic per-element colors.
- Fonts: Cormorant Garamond (serif, italic, headings) + Lato (sans, body) loaded from Google Fonts in `src/style.css`.
