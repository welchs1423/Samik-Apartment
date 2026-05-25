<template>
  <div class="max-w-5xl mx-auto px-6 py-24">
    <!-- Page header -->
    <div class="text-center mb-16">
      <p class="text-xs tracking-[0.3em] uppercase mb-4" style="color: #C5A880;">Our Selection</p>
      <h2 class="font-serif text-5xl sm:text-6xl" style="color: #EAE6DF; font-style: italic; font-weight: 300;">
        The Menu
      </h2>
      <div class="flex items-center justify-center gap-4 mt-6">
        <span class="block h-px w-16" style="background-color: #C5A880; opacity: 0.4;"></span>
        <span class="block w-1 h-1 rounded-full" style="background-color: #C5A880; opacity: 0.6;"></span>
        <span class="block h-px w-16" style="background-color: #C5A880; opacity: 0.4;"></span>
      </div>
    </div>

    <!-- Filter tabs -->
    <div class="flex flex-wrap gap-3 justify-center mb-14">
      <button
        v-for="base in baseFilters"
        :key="base"
        @click="activeFilter = base"
        class="text-xs tracking-widest uppercase px-5 py-2 transition-colors"
        :style="activeFilter === base
          ? { backgroundColor: '#C5A880', color: '#141210', border: '1px solid #C5A880' }
          : { backgroundColor: 'transparent', color: '#C8C2B8', border: '1px solid #2E2823' }"
      >
        {{ base === 'All' ? 'All' : base }}
      </button>
    </div>

    <!-- Cocktail list grouped by base -->
    <div v-for="group in filteredGroups" :key="group.base" class="mb-16">
      <div class="flex items-center gap-5 mb-8">
        <h3 class="font-serif text-2xl" style="color: #C5A880; font-style: italic; font-weight: 300;">
          {{ group.base }}
        </h3>
        <span class="flex-1 block h-px" style="background-color: #2E2823;"></span>
      </div>

      <div class="flex flex-col gap-px" style="border: 1px solid #2E2823;">
        <div
          v-for="cocktail in group.cocktails"
          :key="cocktail.id"
          class="cocktail-row group grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 py-7 cursor-default"
          style="border-bottom: 1px solid #2E2823; transition: background-color 0.15s;"
          @mouseenter="e => e.currentTarget.style.backgroundColor = '#1A1613'"
          @mouseleave="e => e.currentTarget.style.backgroundColor = 'transparent'"
          @click="toggleDetail(cocktail.id)"
        >
          <!-- Name & tags -->
          <div class="sm:col-span-1">
            <p class="font-serif text-xl mb-2" style="color: #EAE6DF; font-weight: 400;">
              {{ cocktail.name }}
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in cocktail.tags"
                :key="tag"
                class="text-xs tracking-widest px-2 py-0.5"
                style="border: 1px solid #2E2823; color: #C8C2B8;"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div class="sm:col-span-2">
            <p class="text-sm leading-7" style="color: #C8C2B8;">
              {{ cocktail.description }}
            </p>

            <!-- Expanded ingredients -->
            <transition name="fade">
              <ul
                v-if="openId === cocktail.id"
                class="mt-5 pt-5 flex flex-col gap-2"
                style="border-top: 1px solid #2E2823;"
              >
                <li
                  v-for="ing in cocktail.ingredients"
                  :key="ing"
                  class="text-xs tracking-wide"
                  style="color: #C5A880;"
                >
                  — {{ ing }}
                </li>
              </ul>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <p v-if="filteredGroups.length === 0" class="text-center text-sm tracking-wide mt-8" style="color: #C8C2B8;">
      No cocktails available for this selection.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import cocktailData from '../data/cocktails.json'

const activeFilter = ref('All')
const openId = ref(null)

const baseFilters = computed(() => {
  const bases = [...new Set(cocktailData.map(c => c.base))]
  return ['All', ...bases]
})

const filteredGroups = computed(() => {
  const list = activeFilter.value === 'All'
    ? cocktailData
    : cocktailData.filter(c => c.base === activeFilter.value)

  const groupMap = {}
  for (const c of list) {
    if (!groupMap[c.base]) groupMap[c.base] = []
    groupMap[c.base].push(c)
  }

  return Object.entries(groupMap).map(([base, cocktails]) => ({ base, cocktails }))
})

function toggleDetail(id) {
  openId.value = openId.value === id ? null : id
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
