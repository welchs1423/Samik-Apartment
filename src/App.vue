<template>
  <div id="app-root">
    <NavBar />
    <main class="pt-16 flex-1 flex flex-col">
      <router-view />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>
