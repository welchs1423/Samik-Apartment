<template>
  <div class="catlist-page">
    <div class="catlist-inner">

    <!-- Header -->
    <header class="catlist-header">
      <p class="catlist-eyebrow">Our Selection</p>
      <h2 class="catlist-title">The Menu</h2>
      <div class="catlist-ornament">
        <span class="orn-line"></span>
        <span class="orn-dot"></span>
        <span class="orn-line"></span>
      </div>
    </header>

    <!-- Search bar -->
    <div class="search-wrap">
      <div class="search-box">
        <svg class="search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="5.5" cy="5.5" r="4"/>
          <line x1="9" y1="9" x2="13" y2="13"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Search menu..."
          autocomplete="off"
          spellcheck="false"
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">×</button>
      </div>
    </div>

    <!-- Search results -->
    <template v-if="searchQuery.trim()">
      <p v-if="searchResults.length === 0" class="search-empty">
        No results for "<em>{{ searchQuery }}</em>"
      </p>
      <div v-else class="search-results">
        <div
          v-for="item in searchResults"
          :key="`${item._catId}-${item.id ?? item.name}`"
          class="search-row"
          @click="openModal(item)"
        >
          <div class="search-row-left">
            <span class="search-item-name">{{ item.name }}</span>
            <span v-if="item.description" class="search-item-desc">{{ item.description }}</span>
          </div>
          <span class="search-item-cat">{{ item._catName }}</span>
        </div>
      </div>
    </template>

    <!-- Category grid -->
    <div v-else class="catlist-grid">
      <router-link
        v-for="cat in categories"
        :key="cat.id"
        :to="`/menu/${cat.id}`"
        class="cat-card"
      >
        <!-- Illustration area -->
        <div class="cat-art">
          <WatercolorIllustration
            :name="cat.name"
            :category="cat.id"
            :ingredients="[]"
            :uid="`cat-${cat.id}`"
          />
          <div class="cat-art-fade"></div>
        </div>

        <!-- Card body -->
        <div class="cat-body">
          <h3 class="cat-name">{{ cat.name }}</h3>
          <p class="cat-desc">{{ cat.description }}</p>
          <div class="cat-cta">
            <span>Explore</span>
            <span class="cat-arrow">→</span>
          </div>
        </div>
      </router-link>
    </div>

    </div><!-- catlist-inner -->
  </div>

  <CocktailModal
    :item="selectedItem"
    :category="selectedItem?._catId ?? ''"
    :category-name="selectedItem?._catName ?? ''"
    @close="selectedItem = null"
  />
</template>

<script setup>
import { computed, ref } from 'vue'
import WatercolorIllustration from '../components/WatercolorIllustration.vue'
import CocktailModal from '../components/CocktailModal.vue'
import { useMenuData } from '../composables/useMenuData'

const { categories: categoriesRef, getItems } = useMenuData()
const categories = computed(() => categoriesRef.value)

// ── Search ────────────────────────────────────────────
const searchQuery = ref('')
const selectedItem = ref(null)

const allItems = computed(() => {
  return categories.value.flatMap(cat => {
    const raw = getItems(cat.id)
    if (!raw?.length) return []
    if (cat.type === 'wine') {
      return raw.flatMap(group =>
        (group.items ?? []).map(w => ({
          id: w.name,
          name: w.name,
          price: w.glassPrice ?? null,
          bottlePrice: w.bottlePrice ?? null,
          image: w.image ?? null,
          description: w.description ?? null,
          ingredients: w.ingredients ?? [],
          tags: w.tags ?? [],
          _catId: cat.id,
          _catName: cat.name,
        }))
      )
    }
    return raw.map(item => ({ ...item, _catId: cat.id, _catName: cat.name }))
  })
})

const searchResults = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []
  return allItems.value.filter(item => item.name.toLowerCase().includes(q))
})

function openModal(item) { selectedItem.value = item }
</script>

<style scoped>
.catlist-page {
  min-height: calc(100vh - 4rem);
  background: #141210;
}
.catlist-inner {
  max-width: 56rem;
  margin: 0 auto;
  padding: 3.5rem 2rem 4rem;
}

/* Header */
.catlist-header {
  text-align: center;
  margin-bottom: 3rem;
}
.catlist-eyebrow {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #C5A880;
  margin-bottom: 0.6rem;
}
.catlist-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-style: italic;
  font-weight: 300;
  color: #EAE6DF;
  margin-bottom: 1rem;
}
.catlist-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}
.orn-line {
  display: block;
  width: 3rem;
  height: 1px;
  background: #C5A880;
  opacity: 0.35;
}
.orn-dot {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #C5A880;
  opacity: 0.55;
}

/* Search */
.search-wrap {
  margin-bottom: 2.5rem;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid #2E2823;
  background: #1A1613;
  padding: 0.6rem 0.9rem;
  transition: border-color 0.18s;
}
.search-box:focus-within {
  border-color: #C5A880;
}
.search-icon {
  color: #8A7F74;
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.85rem;
  color: #EAE6DF;
  letter-spacing: 0.04em;
}
.search-input::placeholder { color: #5A504A; }
.search-clear {
  background: none;
  border: none;
  cursor: pointer;
  color: #8A7F74;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0 0.1rem;
  transition: color 0.15s;
}
.search-clear:hover { color: #C8C2B8; }
.search-empty {
  text-align: center;
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.8rem;
  color: #8A7F74;
  padding: 3rem 0;
  letter-spacing: 0.04em;
}
.search-empty em { font-style: italic; color: #C8C2B8; }
.search-results {
  display: flex;
  flex-direction: column;
  border: 1px solid #2E2823;
}
.search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.1rem;
  border-bottom: 1px solid #2E2823;
  cursor: pointer;
  transition: background 0.15s;
}
.search-row:last-child { border-bottom: none; }
.search-row:hover { background: #1A1613; }
.search-row-left {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}
.search-item-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.1rem;
  font-style: italic;
  font-weight: 400;
  color: #EAE6DF;
}
.search-item-desc {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.72rem;
  color: #8A7F74;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 36ch;
}
.search-item-cat {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #C5A880;
  flex-shrink: 0;
}

/* Grid */
.catlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

/* Card */
.cat-card {
  background: #1A1613;
  border: 1px solid #2E2823;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.22s, transform 0.22s, border-color 0.22s;
  overflow: hidden;
}
.cat-card:hover {
  box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3);
  border-color: #C5A880;
  transform: translateY(-3px);
}

/* Illustration area */
.cat-art {
  position: relative;
  aspect-ratio: 1 / 1;
  background: #141210;
  overflow: hidden;
}
.cat-art-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 55%, rgba(26,22,19,0.65) 100%);
  pointer-events: none;
}

/* Body */
.cat-body {
  padding: 0.9rem 1.1rem 1.1rem;
  border-top: 1px solid #2E2823;
  background: #1A1613;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.cat-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.35rem;
  font-style: italic;
  font-weight: 400;
  color: #EAE6DF;
  margin-bottom: 0.3rem;
  line-height: 1.2;
}
.cat-desc {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.72rem;
  color: #C8C2B8;
  letter-spacing: 0.04em;
  margin-bottom: 0.75rem;
  flex: 1;
}
.cat-cta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #C5A880;
}
.cat-arrow {
  transition: transform 0.18s;
}
.cat-card:hover .cat-arrow {
  transform: translateX(4px);
}

@media (max-width: 480px) {
  .catlist-page { padding: 2.5rem 1rem 3rem; }
  .catlist-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
}
</style>
