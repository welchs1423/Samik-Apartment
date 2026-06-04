# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server (HMR, port 5173) + Express upload server (port 3001) via concurrently
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

No test suite or linter is configured.

## Dev Environment

`npm run dev` starts both the Vite frontend (port 5173) and the Express dev server (port 3001) concurrently. Both must be running for admin saves and image uploads to work.

Images can be uploaded via the admin UI (stored in `public/images/` with timestamp filenames) or committed directly and referenced by path (e.g. `/images/filename.jpg`).

## Architecture

**Samik** is a Vue 3 SPA for a private cocktail bar. Data originates from JSON files in `src/data/`. A lightweight Express dev server (`server.js`, port 3001) handles image uploads and persists admin edits back to those JSON files at runtime.

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
| `/menu/:id/:itemId` | `ItemDetailPage.vue` | Single item detail (direct URL access) |
| `/admin` | `AdminPage.vue` | Password-gated CRUD for categories and items |

`App.vue` wraps all pages with `NavBar.vue` (fixed header) and `SiteFooter.vue`. Item detail is primarily accessed via `CocktailModal` (slide-up sheet) rather than navigating to the `/:itemId` route.

### Data layer

Two-tier data model:

- **`src/data/categories.json`** — ordered list of categories. Each entry: `id`, `name`, `type` (`cocktail` | `spirit` | `wine`), `description`, `coverImage`, optional `note`.
- **`src/data/items/<catId>.json`** — one file per category. Cocktails/spirits are flat arrays; wines are grouped arrays `[{ subcategory, note, items: [...] }]` with `glassPrice`/`bottlePrice` fields instead of `ingredients`.

**`src/composables/useMenuData.js`** is the single reactive store. It uses `import.meta.glob('../data/items/*.json', { eager: true })` to load all item files at build time into an in-memory reactive state. It exposes `getItems`, `setItems`, `saveItem`, `deleteItem`, `saveCategory`, and `deleteCategory`. All pages read/write through this composable.

Every mutation calls an internal `persist()` helper that fires-and-forgets a `fetch` to the Express dev server:
- `POST /api/data/categories` — overwrites `src/data/categories.json`
- `POST /api/data/items/:catId` — overwrites `src/data/items/<catId>.json`
- `DELETE /api/data/items/:catId` — deletes the item file
- `POST /api/upload` — saves an uploaded image to `public/images/` and returns its path

There is no localStorage layer; the JSON source files are the live data store during development.

### Key non-obvious patterns

- **Wine item identification**: Wine items have no `id` field. Admin operations use a composite key `${subcategory}::${wineName}` to identify them. When editing a wine item's subcategory, it is removed from the old group and inserted into (or creates) the new group.
- **Subcategory sorting**: `CategoryPage.vue` sorts items so those with a `subcategory` field appear before ungrouped items, in both `flatItems` (grid view) and `subcategoryGroups` (list/table view).
- **Category default views**: `cocktail` → grid, `wine` → list, `spirit` → table (set in `DEFAULT_VIEW` in `CategoryPage.vue`).
- **Admin auth**: Password is hardcoded as `'181108'` in `AdminPage.vue`. Auth state is stored in `sessionStorage` (cleared on browser close).
- **WatercolorIllustration**: SVG procedural art used as fallback when `item.image` is absent. Color palette and glass shape are determined by `category` id. The SVG filter `seed` is derived from a hash of `uid`, making the illustration deterministic per item.

### Components

- **`WatercolorIllustration.vue`** — SVG-based procedural illustration; palette and glass shape are derived from the category id and item name. Used as fallback art when an item has no `image` field.
- **`CocktailModal.vue`** — slide-up detail sheet opened from search results or category pages. Shows `item.image` if set, otherwise falls back to `WatercolorIllustration`.

### Styling conventions

- Custom color tokens (`--color-bar-black`, `--color-bar-gold`, etc.) are defined in `src/style.css` and used as Tailwind utilities (`bg-bar-black`, `text-bar-gold`).
- Most pages use `<style scoped>` with raw CSS rather than Tailwind utilities. Inline `:style` bindings are used for dynamic per-element colors.
- Fonts: Cormorant Garamond (serif, italic, headings) + Lato (sans, body) loaded from Google Fonts in `src/style.css`.
