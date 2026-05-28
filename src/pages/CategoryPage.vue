<template>
  <div v-if="category" class="category-page">
    <div class="page-inner">

      <!-- Top bar: back + view toggle -->
      <div class="top-bar">
        <router-link to="/menu" class="back-link">← Menu</router-link>
        <div class="view-toggle">
          <button
            class="toggle-btn"
            :class="{ active: viewMode === 'grid' }"
            title="Card view"
            @click="setView('grid')"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="0" y="0" width="5.5" height="5.5"/>
              <rect x="8.5" y="0" width="5.5" height="5.5"/>
              <rect x="0" y="8.5" width="5.5" height="5.5"/>
              <rect x="8.5" y="8.5" width="5.5" height="5.5"/>
            </svg>
          </button>
          <button
            class="toggle-btn"
            :class="{ active: viewMode === 'list' }"
            title="List view"
            @click="setView('list')"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="0" y="1" width="14" height="2"/>
              <rect x="0" y="6" width="14" height="2"/>
              <rect x="0" y="11" width="14" height="2"/>
            </svg>
          </button>
          <button
            class="toggle-btn"
            :class="{ active: viewMode === 'table' }"
            title="Table view"
            @click="setView('table')"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="0"    y="0"    width="3.5" height="3.5"/>
              <rect x="5.25" y="0"    width="3.5" height="3.5"/>
              <rect x="10.5" y="0"    width="3.5" height="3.5"/>
              <rect x="0"    y="5.25" width="3.5" height="3.5"/>
              <rect x="5.25" y="5.25" width="3.5" height="3.5"/>
              <rect x="10.5" y="5.25" width="3.5" height="3.5"/>
              <rect x="0"    y="10.5" width="3.5" height="3.5"/>
              <rect x="5.25" y="10.5" width="3.5" height="3.5"/>
              <rect x="10.5" y="10.5" width="3.5" height="3.5"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Page header -->
      <header class="page-header">
        <p v-if="category.description" class="page-eyebrow">{{ category.description }}</p>
        <h2 class="page-title">{{ category.name }}</h2>
        <div class="page-ornament">
          <span class="orn-line"></span>
          <span class="orn-dot"></span>
          <span class="orn-line"></span>
        </div>
      </header>

      <!-- ── GRID VIEW ── -->
      <template v-if="viewMode === 'grid'">
        <div class="cocktail-grid">
          <article
            v-for="item in pagedFlatItems"
            :key="item.id ?? item.name"
            class="cocktail-card"
            @click="openModal(item)"
            role="button"
            tabindex="0"
            @keydown.enter="openModal(item)"
            :aria-label="`View ${item.name} details`"
          >
            <div class="card-art">
              <WatercolorIllustration
                :name="item.name"
                :category="category.id"
                :ingredients="item.ingredients || []"
                :uid="`${category.id}-${item.id ?? item.name}`"
              />
              <div class="card-art-overlay"></div>
            </div>
            <div class="card-footer">
              <div class="card-footer-inner">
                <span class="card-name">{{ item.name }}</span>
                <span v-if="item.price" class="card-price">{{ item.price }}</span>
              </div>
              <div v-if="item.tags?.length" class="card-tags">
                <span v-for="tag in item.tags.slice(0,3)" :key="tag" class="card-tag">{{ tag }}</span>
              </div>
            </div>
          </article>
          <div
            v-for="n in emptySlots"
            :key="`empty-${n}`"
            class="cocktail-card card-empty"
            aria-hidden="true"
          ></div>
        </div>
        <div v-if="totalPages > 1" class="pagination">
          <button class="pag-btn" :disabled="currentPage === 0" @click="currentPage--">←</button>
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
          <button class="pag-btn" :disabled="currentPage === totalPages - 1" @click="currentPage++">→</button>
        </div>
      </template>

      <!-- ── LIST VIEW ── -->
      <template v-else-if="viewMode === 'list'">
        <!-- Wine: keep subcategory grouping -->
        <template v-if="category.type === 'wine'">
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
                class="wine-row wine-row--clickable"
                @click="openModal({ id: wine.name, name: wine.name, price: wine.glassPrice, bottlePrice: wine.bottlePrice, image: wine.image ?? null, description: wine.description ?? null, ingredients: wine.ingredients ?? [], tags: wine.tags ?? [] })"
              >
                <span class="wine-name">{{ wine.name }}</span>
                <div class="wine-prices">
                  <span v-if="wine.glassPrice" class="wine-price">gl. {{ wine.glassPrice }}</span>
                  <span v-if="wine.bottlePrice" class="wine-price">btl. {{ wine.bottlePrice }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- Cocktail / Spirit: grouped or flat list rows -->
        <template v-else>
          <template v-if="hasSubcats">
            <div v-for="group in subcategoryGroups" :key="group.subcategory" class="wine-group">
              <div v-if="group.subcategory" class="wine-subcat-header">
                <h3 class="wine-subcat-name">{{ group.subcategory }}</h3>
                <span class="wine-subcat-line"></span>
              </div>
              <div class="wine-list">
                <div
                  v-for="item in group.items"
                  :key="item.id ?? item.name"
                  class="wine-row wine-row--clickable"
                  @click="openModal(item)"
                >
                  <span class="wine-name">{{ item.name }}</span>
                  <div class="wine-prices">
                    <span v-if="item.price" class="wine-price">{{ item.price }}</span>
                    <span v-for="tag in (item.tags || []).slice(0,2)" :key="tag" class="card-tag" style="margin-left:0.4rem;">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="wine-list">
            <div
              v-for="item in flatItems"
              :key="item.id ?? item.name"
              class="wine-row wine-row--clickable"
              @click="openModal(item)"
            >
              <span class="wine-name">{{ item.name }}</span>
              <div class="wine-prices">
                <span v-if="item.price" class="wine-price">{{ item.price }}</span>
                <span
                  v-for="tag in (item.tags || []).slice(0,2)"
                  :key="tag"
                  class="card-tag"
                  style="margin-left:0.4rem;"
                >{{ tag }}</span>
              </div>
            </div>
          </div>
        </template>
      </template>

      <!-- ── TABLE VIEW ── -->
      <template v-else>
        <!-- Wine: table grouped by subcategory -->
        <template v-if="category.type === 'wine'">
          <div v-for="group in items" :key="group.subcategory" class="wine-table-group">
            <div class="wine-subcat-header">
              <h3 class="wine-subcat-name">{{ group.subcategory }}</h3>
              <span class="wine-subcat-line"></span>
            </div>
            <p v-if="group.note" class="wine-note">{{ group.note }}</p>
            <div class="spirit-grid" style="margin-bottom:0;">
              <div
                v-for="wine in group.items"
                :key="wine.name"
                class="spirit-cell spirit-cell--clickable"
                @click="openModal({ id: wine.name, name: wine.name, price: wine.glassPrice, bottlePrice: wine.bottlePrice, image: wine.image ?? null, description: wine.description ?? null, ingredients: wine.ingredients ?? [], tags: wine.tags ?? [] })"
              >
                <span class="spirit-name">{{ wine.name }}</span>
                <span v-if="wine.glassPrice" class="spirit-price">gl. {{ wine.glassPrice }}</span>
              </div>
            </div>
          </div>
        </template>
        <!-- Cocktail / Spirit: grouped or flat compact grid -->
        <template v-else>
          <template v-if="hasSubcats">
            <div v-for="group in subcategoryGroups" :key="group.subcategory" class="wine-table-group">
              <div v-if="group.subcategory" class="wine-subcat-header">
                <h3 class="wine-subcat-name">{{ group.subcategory }}</h3>
                <span class="wine-subcat-line"></span>
              </div>
              <div class="spirit-grid" style="margin-bottom:0;">
                <div
                  v-for="item in group.items"
                  :key="item.id ?? item.name"
                  class="spirit-cell spirit-cell--clickable"
                  @click="openModal(item)"
                >
                  <span class="spirit-name">{{ item.name }}</span>
                  <span v-if="item.price" class="spirit-price">{{ item.price }}</span>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="spirit-grid">
            <div
              v-for="item in flatItems"
              :key="item.id ?? item.name"
              class="spirit-cell spirit-cell--clickable"
              @click="openModal(item)"
            >
              <span class="spirit-name">{{ item.name }}</span>
              <span v-if="item.price" class="spirit-price">{{ item.price }}</span>
            </div>
          </div>
          <p v-if="category.note" class="spirit-note">{{ category.note }}</p>
        </template>
      </template>

    </div>
  </div>

  <!-- 404 -->
  <div v-else class="max-w-4xl mx-auto px-6 py-24 text-center">
    <p class="text-sm tracking-wide" style="color:#C8C2B8;">Category not found.</p>
    <router-link
      to="/menu"
      class="text-xs tracking-widest uppercase mt-6 inline-block"
      style="color:#C5A880;text-decoration:none;"
    >← Back to Menu</router-link>
  </div>

  <!-- Shared detail modal -->
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

// View mode — default depends on category type
const DEFAULT_VIEW = { cocktail: 'grid', wine: 'list', spirit: 'table' }
const currentPage  = ref(0)
const viewMode     = ref('grid')

watch(
  () => category.value?.type,
  (type) => {
    viewMode.value = DEFAULT_VIEW[type] ?? 'grid'
    currentPage.value = 0
  },
  { immediate: true }
)

function setView(mode) {
  viewMode.value = mode
  currentPage.value = 0
}

// Flatten wine groups for grid / table views
const flatItems = computed(() => {
  if (!category.value) return []
  if (category.value.type === 'wine') {
    return items.value.flatMap(group =>
      group.items.map(w => ({
        id: w.name,
        name: w.name,
        price: w.glassPrice,
        bottlePrice: w.bottlePrice,
        image: w.image ?? null,
        description: null,
        ingredients: [],
        tags: [],
      }))
    )
  }
  return items.value
})

// Group spirit/cocktail items by subcategory when subcategories are present
const subcategoryGroups = computed(() => {
  if (category.value?.type === 'wine') return []
  if (!items.value?.length) return []
  if (!items.value.some(i => i.subcategory)) return []
  const groupMap = new Map()
  for (const item of items.value) {
    const key = item.subcategory || ''
    if (!groupMap.has(key)) groupMap.set(key, [])
    groupMap.get(key).push(item)
  }
  return [...groupMap.entries()].map(([subcategory, its]) => ({ subcategory, items: its }))
})

const hasSubcats = computed(() => subcategoryGroups.value.length > 0)

// Pagination (grid view only)
const ITEMS_PER_PAGE = 4
const totalPages     = computed(() => Math.max(1, Math.ceil(flatItems.value.length / ITEMS_PER_PAGE)))
const pagedFlatItems = computed(() => {
  const start = currentPage.value * ITEMS_PER_PAGE
  return flatItems.value.slice(start, start + ITEMS_PER_PAGE)
})
const emptySlots = computed(() => {
  const rem = pagedFlatItems.value.length % 2
  return rem === 0 ? 0 : 2 - rem
})

watch(() => route.params.id, () => { currentPage.value = 0 })

// Modal
const selectedItem = ref(null)
function openModal(item) { selectedItem.value = item }

</script>

<style scoped>
/* ─── Unified page wrapper ─── */
.category-page {
  min-height: calc(100vh - 4rem);
  background: #141210;
  color: #EAE6DF;
  width: 100%;
}
.page-inner {
  max-width: 56rem;
  margin: 0 auto;
  padding: 3.5rem 2rem 5rem;
}

/* ─── Top bar ─── */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
}
.back-link {
  display: inline-block;
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #C8C2B8;
  text-decoration: none;
  transition: color 0.18s;
}
.back-link:hover { color: #C5A880; }

/* ─── View toggle ─── */
.view-toggle {
  display: flex;
  gap: 0.3rem;
}
.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: none;
  border: 1px solid #2E2823;
  color: #4A4540;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  padding: 0;
}
.toggle-btn:hover {
  border-color: #C5A880;
  color: #C5A880;
}
.toggle-btn.active {
  background: #C5A880;
  border-color: #C5A880;
  color: #141210;
}

/* ─── Page header ─── */
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

/* ─── Cocktail card grid ─── */
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
.card-empty { pointer-events: none; opacity: 0; }
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
.card-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }
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
.pag-btn:disabled { opacity: 0.3; cursor: default; }
.pag-dots { display: flex; gap: 0.55rem; align-items: center; }
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
.pag-dot.active { background: #C5A880; transform: scale(1.3); }

/* ─── Wine list view ─── */
.wine-group { margin-bottom: 3rem; }
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
.wine-subcat-line { flex: 1; display: block; height: 1px; background: #2E2823; }
.wine-note {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #C8C2B8;
  margin-bottom: 1rem;
}
.wine-list { border: 1px solid #2E2823; }
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
  align-items: center;
}
.wine-price {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: #C8C2B8;
}
.wine-img-hint { font-size: 0.75rem; color: #C5A880; opacity: 0.6; margin-left: 0.4rem; }

/* ─── Spirit / table grid ─── */
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
.spirit-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1rem;
  font-weight: 300;
  color: #EAE6DF;
  letter-spacing: 0.02em;
  display: block;
}
.spirit-price {
  display: block;
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.68rem;
  color: #C5A880;
  margin-top: 0.2rem;
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

/* ─── Wine table view ─── */
.wine-table-group { margin-bottom: 2.5rem; }

/* ─── Mobile ─── */
@media (max-width: 500px) {
  .cocktail-grid { gap: 1rem; }
  .spirit-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
