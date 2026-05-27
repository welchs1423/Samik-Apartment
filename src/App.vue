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
import NavBar from './components/NavBar.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>
