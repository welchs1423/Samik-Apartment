<template>
  <header class="fixed top-0 left-0 right-0 z-50" style="background-color: rgba(20,18,16,0.96); border-bottom: 1px solid #2E2823;">
    <div class="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
      <router-link to="/" class="font-serif text-xl tracking-widest" style="color: #C5A880; font-style: italic; text-decoration: none;">
        Samik
      </router-link>

      <nav class="flex gap-8">
        <router-link
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="nav-link text-xs tracking-widest uppercase"
          style="text-decoration: none; transition: color 0.2s;"
          :style="isActive(link.path) ? { color: '#C5A880' } : { color: '#C8C2B8' }"
        >
          {{ link.label }}
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const links = [
  { path: '/', label: 'Home' },
  { path: '/menu', label: 'Menu' },
  { path: '/info', label: 'Info' },
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
