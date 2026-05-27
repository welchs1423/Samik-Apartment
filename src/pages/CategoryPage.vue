<template>
  <!-- ═══════════════════════════════════════════════
       COCKTAIL layout  →  parchment / watercolor
  ══════════════════════════════════════════════════ -->
  <div v-if="category?.type === 'cocktail'" class="cocktail-page">
    <div class="cocktail-inner">

    <!-- Back -->
    <router-link to="/menu" class="back-link">← Menu</router-link>

    <!-- Page header -->
    <header class="page-header">
      <p class="page-eyebrow">{{ typeLabel(category.type) }}</p>
      <h2 class="page-title">{{ category.name }}</h2>
      <div class="page-ornament">
        <span class="orn-line"></span>
        <span class="orn-dot"></span>
        <span class="orn-line"></span>
      </div>
    </header>

    <!-- 2×2 grid -->
    <div class="cocktail-grid">
      <article
        v-for="item in pagedItems"
        :key="item.id"
        class="cocktail-card"
        @click="openModal(item)"
        :aria-label="`View ${item.name} details`"
        role="button"
        tabindex="0"
        @keydown.enter="openModal(item)"
      >
        <!-- Illustration fills top of card -->
        <div class="card-art">
          <WatercolorIllustration
            :name="item.name"
            :category="category.id"
            :ingredients="item.ingredients || []"
            :uid="`${category.id}-${item.id}`"
          />
          <div class="card-art-overlay"></div>
        </div>

        <!-- Card footer -->
        <div class="card-footer">
          <div class="card-footer-inner">
            <span class="card-name">{{ item.name }}</span>
            <span v-if="item.price" class="card-price">{{ item.price }}</span>
          </div>
          <div class="card-tags">
            <span v-for="tag in (item.tags || []).slice(0,3)" :key="tag" class="card-tag">{{ tag }}</span>
          </div>
        </div>
      </article>

      <!-- Empty placeholder slots to keep 2-column grid stable -->
      <div
        v-for="n in emptySlots"
        :key="`empty-${n}`"
        class="cocktail-card card-empty"
        aria-hidden="true"
      ></div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button class="pag-btn" :disabled="currentPage === 0" @click="currentPage--">
        ←
      </button>

      <div class="pag-dots">
        <button
          v-for="p in totalPages"
          :key="p"
          class="pag-dot"
          :class="{ active: currentPage === p - 1 }"
          @click="currentPage = p - 1"
          :aria-label="`Page ${p}`"
        ></button>
      </div>

      <button class="pag-btn" :disabled="currentPage === totalPages - 1" @click="currentPage++">
        →
      </button>
    </div>

    </div><!-- cocktail-inner -->
  </div>

  <!-- ═══════════════════════════════════════════════
       WINE layout  — full-width dark
  ══════════════════════════════════════════════════ -->
  <div v-else-if="category?.type === 'wine'" class="dark-page">
    <div class="dark-inner">
      <router-link to="/menu" class="dark-back">← Back</router-link>

      <header class="dark-header">
        <p class="dark-eyebrow">{{ typeLabel(category.type) }}</p>
        <h2 class="dark-title">{{ category.name }}</h2>
        <div class="dark-ornament">
          <span class="orn-dark-line"></span>
          <span class="orn-dark-dot"></span>
          <span class="orn-dark-line"></span>
        </div>
      </header>

      <div v-for="group in items" :key="group.subcategory" class="wine-group">
        <div class="wine-subcat-header">
          <h3 class="wine-subcat-name">{{ group.subcategory }}</h3>
          <span class="wine-subcat-line"></span>
        </div>
        <p v-if="group.note" class="wine-note">{{ group.note }}</p>
        <div class="wine-list">
          <div
            v-for="wine in group.items"
            :key="wine.name"
            class="wine-row"
            :class="{ 'wine-row--clickable': wine.image }"
            @click="wine.image ? openModal({ name: wine.name, price: wine.glassPrice, bottlePrice: wine.bottlePrice, image: wine.image, description: null, ingredients: [], tags: [], id: wine.name }) : null"
          >
            <span class="wine-name">{{ wine.name }}</span>
            <div class="wine-prices">
              <span v-if="wine.glassPrice" class="wine-price">gl. {{ wine.glassPrice }}</span>
              <span v-if="wine.bottlePrice" class="wine-price">btl. {{ wine.bottlePrice }}</span>
              <span v-if="wine.image" class="wine-img-hint">⊕</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════
       SPIRIT layout  — full-width dark
  ══════════════════════════════════════════════════ -->
  <div v-else-if="category?.type === 'spirit'" class="dark-page">
    <div class="dark-inner">
      <router-link to="/menu" class="dark-back">← Back</router-link>

      <header class="dark-header">
        <p class="dark-eyebrow">{{ typeLabel(category.type) }}</p>
        <h2 class="dark-title">{{ category.name }}</h2>
        <div class="dark-ornament">
          <span class="orn-dark-line"></span>
          <span class="orn-dark-dot"></span>
          <span class="orn-dark-line"></span>
        </div>
      </header>

      <div class="spirit-grid">
        <div
          v-for="spirit in items"
          :key="spirit.name"
          class="spirit-cell"
          :class="{ 'spirit-cell--clickable': spirit.image }"
          @click="spirit.image ? openModal({ name: spirit.name, price: spirit.price, image: spirit.image, description: spirit.description, ingredients: [], tags: [], id: spirit.name }) : null"
        >
          <span class="spirit-name">{{ spirit.name }}</span>
          <span v-if="spirit.price" class="spirit-price">{{ spirit.price }}</span>
        </div>
      </div>
      <p v-if="category.note" class="spirit-note">{{ category.note }}</p>
    </div>
  </div>

  <!-- 404 -->
  <div v-else class="max-w-4xl mx-auto px-6 py-24 text-center">
    <p class="text-sm tracking-wide" style="color:#C8C2B8;">Category not found.</p>
    <router-link to="/menu" class="text-xs tracking-widest uppercase mt-6 inline-block" style="color:#C5A880;text-decoration:none;">← Back to Menu</router-link>
  </div>

  <!-- Shared detail modal — all category types -->
  <CocktailModal
    :item="selectedItem"
    :category="category?.id ?? ''"
    :category-name="category?.name ?? ''"
    @close="selectedItem = null"
  />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import WatercolorIllustration from '../components/WatercolorIllustration.vue'
import CocktailModal from '../components/CocktailModal.vue'
import { useMenuData } from '../composables/useMenuData'

const { categories: allCategories, getItems } = useMenuData()
const route = useRoute()

const category = computed(() => allCategories.value.find(c => c.id === route.params.id))
const items    = computed(() => getItems(route.params.id))

// Pagination (cocktail type only)
const ITEMS_PER_PAGE = 4
const currentPage  = ref(0)
const totalPages   = computed(() => Math.max(1, Math.ceil(items.value.length / ITEMS_PER_PAGE)))
const pagedItems   = computed(() => {
  const start = currentPage.value * ITEMS_PER_PAGE
  return items.value.slice(start, start + ITEMS_PER_PAGE)
})
const emptySlots = computed(() => {
  const rem = pagedItems.value.length % 2
  return rem === 0 ? 0 : 2 - rem
})

// Reset page when category changes
watch(() => route.params.id, () => { currentPage.value = 0 })

// Modal
const selectedItem = ref(null)
function openModal(item) { selectedItem.value = item }

function typeLabel(type) {
  if (type === 'cocktail') return 'Cocktails'
  if (type === 'wine')     return 'Wine'
  if (type === 'spirit')   return 'Spirits'
  return type
}
</script>

<style scoped>
/* ─── Dark cocktail page ─── */
.cocktail-page {
  min-height: calc(100vh - 4rem);
  background: #141210;
}
.cocktail-inner {
  max-width: 56rem;
  margin: 0 auto;
  padding: 3.5rem 2rem 4rem;
}

.back-link {
  display: inline-block;
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #C8C2B8;
  text-decoration: none;
  margin-bottom: 2.5rem;
  transition: color 0.18s;
}
.back-link:hover { color: #C5A880; }

/* Header */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}
.page-eyebrow {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #C5A880;
  margin-bottom: 0.6rem;
}
.page-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  font-style: italic;
  font-weight: 300;
  color: #EAE6DF;
  line-height: 1.1;
  margin-bottom: 1.2rem;
}
.page-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}
.orn-line {
  display: block;
  width: 3.5rem;
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

/* ─── 2 × 2 grid ─── */
.cocktail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.cocktail-card {
  background: #1A1613;
  border: 1px solid #2E2823;
  cursor: pointer;
  transition: box-shadow 0.22s, transform 0.22s, border-color 0.22s;
  overflow: hidden;
  outline: none;
  position: relative;
}
.cocktail-card:hover {
  box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3);
  border-color: #C5A880;
  transform: translateY(-3px);
}
.cocktail-card:focus-visible {
  outline: 2px solid #C5A880;
  outline-offset: 2px;
}
.card-empty {
  pointer-events: none;
  opacity: 0;
}

.card-art {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  background: #141210;
  overflow: hidden;
}
.card-art-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 65%, rgba(26,22,19,0.6) 100%);
  pointer-events: none;
}

.card-footer {
  padding: 0.9rem 1.1rem 1rem;
  border-top: 1px solid #2E2823;
  background: #1A1613;
}
.card-footer-inner {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}
.card-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.15rem;
  font-style: italic;
  font-weight: 400;
  color: #EAE6DF;
  line-height: 1.25;
}
.card-price {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 0.95rem;
  font-weight: 300;
  color: #C5A880;
  white-space: nowrap;
  flex-shrink: 0;
}
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.card-tag {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.58rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #C8C2B8;
  border: 1px solid #2E2823;
  padding: 0.15rem 0.5rem;
}

/* ─── Pagination ─── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 0.5rem;
}
.pag-btn {
  background: none;
  border: 1px solid #2E2823;
  color: #C8C2B8;
  width: 2.2rem;
  height: 2.2rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pag-btn:hover:not(:disabled) {
  background: #C5A880;
  color: #141210;
  border-color: #C5A880;
}
.pag-btn:disabled {
  opacity: 0.3;
  cursor: default;
}
.pag-dots {
  display: flex;
  gap: 0.55rem;
  align-items: center;
}
.pag-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2E2823;
  border: none;
  cursor: pointer;
  transition: background 0.18s, transform 0.18s;
  padding: 0;
}
.pag-dot.active {
  background: #C5A880;
  transform: scale(1.3);
}

/* ─── Dark page shared styles ─── */
.dark-page {
  background: #141210;
  color: #EAE6DF;
  min-height: calc(100vh - 4rem);
  width: 100%;
}
.dark-inner {
  max-width: 56rem;
  margin: 0 auto;
  padding: 5rem 2rem 5rem;
}
.dark-back {
  display: inline-block;
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #C8C2B8;
  text-decoration: none;
  transition: color 0.18s;
}
.dark-back:hover { color: #C5A880; }

.dark-header {
  text-align: center;
  margin: 2.5rem 0 3.5rem;
}
.dark-eyebrow {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #C5A880;
  margin-bottom: 0.75rem;
}
.dark-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.8rem, 5vw, 4.5rem);
  font-style: italic;
  font-weight: 300;
  color: #EAE6DF;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}
.dark-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}
.orn-dark-line {
  display: block;
  width: 4rem;
  height: 1px;
  background: #C5A880;
  opacity: 0.35;
}
.orn-dark-dot {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #C5A880;
  opacity: 0.55;
}

/* ─── Wine ─── */
.wine-group {
  margin-bottom: 3rem;
}
.wine-subcat-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}
.wine-subcat-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.5rem;
  font-style: italic;
  font-weight: 300;
  color: #C5A880;
  white-space: nowrap;
}
.wine-subcat-line {
  flex: 1;
  display: block;
  height: 1px;
  background: #2E2823;
}
.wine-note {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #C8C2B8;
  margin-bottom: 1rem;
}
.wine-list {
  border: 1px solid #2E2823;
}
.wine-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.5rem;
  border-bottom: 1px solid #2E2823;
  transition: background 0.15s;
}
.wine-row:last-child { border-bottom: none; }
.wine-row:hover { background: #1A1613; }
.wine-row--clickable { cursor: pointer; }
.wine-row--clickable:hover { border-left: 2px solid #C5A880; }
.wine-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.05rem;
  font-weight: 300;
  color: #EAE6DF;
  letter-spacing: 0.02em;
}
.wine-prices {
  display: flex;
  gap: 1.5rem;
  flex-shrink: 0;
  margin-left: 1rem;
}
.wine-price {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: #C8C2B8;
}

/* ─── Spirit ─── */
.spirit-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid #2E2823;
  margin-bottom: 2rem;
}
.spirit-cell {
  padding: 1rem 1.25rem;
  border-right: 1px solid #2E2823;
  border-bottom: 1px solid #2E2823;
  transition: background 0.15s;
}
.spirit-cell:hover { background: #1A1613; }
.spirit-cell--clickable { cursor: pointer; }
.spirit-cell--clickable:hover { border-left: 2px solid #C5A880; }
.spirit-price {
  display: block;
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.68rem;
  color: #C5A880;
  margin-top: 0.2rem;
}
.wine-img-hint {
  font-size: 0.75rem;
  color: #C5A880;
  opacity: 0.6;
  margin-left: 0.4rem;
}
.spirit-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1rem;
  font-weight: 300;
  color: #EAE6DF;
  letter-spacing: 0.02em;
}
.spirit-note {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #C8C2B8;
  border: 1px solid #2E2823;
  padding: 0.75rem 1.5rem;
  text-align: center;
}

/* ─── Mobile ─── */
@media (max-width: 500px) {
  .cocktail-page {
    padding: 2.5rem 1rem 3rem;
  }
  .cocktail-grid {
    gap: 1rem;
  }
}
</style>
