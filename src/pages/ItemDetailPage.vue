<template>
  <div v-if="item" class="max-w-4xl mx-auto px-6 py-24">
    <!-- Back -->
    <router-link
      :to="`/menu/${route.params.id}`"
      class="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-12"
      style="color: #C8C2B8; text-decoration: none; transition: color 0.2s;"
      @mouseenter="e => e.currentTarget.style.color = '#C5A880'"
      @mouseleave="e => e.currentTarget.style.color = '#C8C2B8'"
    >
      ← {{ category?.name ?? 'Back' }}
    </router-link>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      <!-- Image -->
      <div class="relative" style="aspect-ratio: 3/4; background-color: #1A1613; border: 1px solid #2E2823;">
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
          <span class="font-serif text-8xl" style="color: #2E2823; font-style: italic; font-weight: 300; user-select: none;">
            {{ item.name.charAt(0) }}
          </span>
          <span class="text-xs tracking-widest uppercase" style="color: #2E2823;">Image coming soon</span>
        </div>
      </div>

      <!-- Details -->
      <div class="flex flex-col">
        <p class="text-xs tracking-[0.3em] uppercase mb-3" style="color: #C5A880;">
          {{ category?.name }}
        </p>
        <h1 class="font-serif text-4xl sm:text-5xl mb-3" style="color: #EAE6DF; font-style: italic; font-weight: 300; line-height: 1.15;">
          {{ item.name }}
        </h1>

        <div class="flex items-center gap-4 mb-8">
          <span class="font-serif text-2xl" style="color: #C5A880; font-weight: 300;">{{ item.price }}</span>
          <span class="flex-1 block h-px" style="background-color: #2E2823;"></span>
        </div>

        <p class="text-sm leading-8 mb-8" style="color: #C8C2B8;">
          {{ item.description }}
        </p>

        <!-- Tags -->
        <div v-if="item.tags?.length" class="flex flex-wrap gap-2 mb-10">
          <span
            v-for="tag in item.tags"
            :key="tag"
            class="text-xs tracking-widest px-3 py-1"
            style="border: 1px solid #2E2823; color: #C8C2B8;"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Divider -->
        <div class="mb-6" style="border-top: 1px solid #2E2823;"></div>

        <!-- Ingredients -->
        <p class="text-xs tracking-[0.25em] uppercase mb-4" style="color: #C5A880;">Ingredients</p>
        <ul class="flex flex-col gap-3">
          <li
            v-for="ing in item.ingredients"
            :key="ing"
            class="flex items-center gap-3 text-sm"
            style="color: #EAE6DF;"
          >
            <span class="block w-3 h-px shrink-0" style="background-color: #C5A880;"></span>
            {{ ing }}
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- 404 -->
  <div v-else class="max-w-4xl mx-auto px-6 py-24 text-center">
    <p class="text-sm tracking-wide" style="color: #C8C2B8;">Item not found.</p>
    <router-link to="/menu" class="text-xs tracking-widest uppercase mt-6 inline-block" style="color: #C5A880; text-decoration: none;">
      ← Back to Menu
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuData } from '../composables/useMenuData'

const { categories: allCategories, getItems } = useMenuData()
const route = useRoute()

const category = computed(() => allCategories.value.find(c => c.id === route.params.id))
const item = computed(() => {
  const list = getItems(route.params.id)
  return list.find(i => i.id === route.params.itemId) ?? null
})
</script>
