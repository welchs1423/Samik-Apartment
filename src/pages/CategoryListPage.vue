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

    <!-- Category grid -->
    <div class="catlist-grid">
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
          <!-- Type badge -->
          <span class="cat-badge">{{ typeLabel(cat.type) }}</span>
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
</template>

<script setup>
import { computed } from 'vue'
import WatercolorIllustration from '../components/WatercolorIllustration.vue'
import { useMenuData } from '../composables/useMenuData'

const { categories: categoriesRef } = useMenuData()
const categories = computed(() => categoriesRef.value)

function typeLabel(type) {
  if (type === 'cocktail') return 'Cocktails'
  if (type === 'wine')     return 'Wine'
  if (type === 'spirit')   return 'Spirits'
  return type
}
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
.cat-badge {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.58rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #C5A880;
  margin-bottom: 0.35rem;
  display: block;
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
