<template>
  <div id="app-root">
    <NavBar />
    <main class="pt-16">
      <router-view />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import SiteFooter from './components/SiteFooter.vue'
import { initMenuData } from './composables/useMenuData'

onMounted(initMenuData)
</script>
