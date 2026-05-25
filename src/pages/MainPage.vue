<template>
  <div class="flex flex-col min-h-screen">
    <!-- Hero -->
    <section class="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
      <p class="text-xs tracking-[0.3em] uppercase mb-8" style="color: #C5A880;">
        Est. 2024 &nbsp;·&nbsp; Private Bar
      </p>

      <h1 class="font-serif text-6xl sm:text-8xl mb-6" style="color: #EAE6DF; font-style: italic; font-weight: 300; line-height: 1.1;">
        Samik
      </h1>

      <div class="flex items-center gap-4 mb-10">
        <span class="block h-px w-12" style="background-color: #C5A880; opacity: 0.5;"></span>
        <span class="text-xs tracking-[0.25em] uppercase" style="color: #C8C2B8;">Cocktail Bar</span>
        <span class="block h-px w-12" style="background-color: #C5A880; opacity: 0.5;"></span>
      </div>

      <p class="max-w-md text-sm leading-8 tracking-wide mb-16" style="color: #C8C2B8;">
        문을 열고 들어오면, 세상은 잠시 멈춥니다.<br>
        이곳은 좋은 술과 조용한 대화를 위한 공간입니다.
      </p>

      <router-link
        to="/menu"
        class="inline-block text-xs tracking-[0.2em] uppercase px-8 py-3"
        style="border: 1px solid #C5A880; color: #C5A880; text-decoration: none; transition: background-color 0.2s, color 0.2s;"
        @mouseenter="e => { e.target.style.backgroundColor = '#C5A880'; e.target.style.color = '#141210' }"
        @mouseleave="e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#C5A880' }"
      >
        View the Menu
      </router-link>
    </section>

    <!-- Teaser strip -->
    <section style="border-top: 1px solid #2E2823; border-bottom: 1px solid #2E2823;">
      <div class="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div v-for="item in teasers" :key="item.label">
          <p class="font-serif text-2xl mb-2" style="color: #C5A880; font-style: italic; font-weight: 300;">
            {{ item.value }}
          </p>
          <p class="text-xs tracking-widest uppercase" style="color: #C8C2B8;">
            {{ item.label }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const teasers = [
  { value: 'Hand-crafted', label: 'Every pour' },
  { value: 'Seasonal', label: 'Rotating menu' },
  { value: 'Curated', label: 'Spirit selection' },
]
</script>
