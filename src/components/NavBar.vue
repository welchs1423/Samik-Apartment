<template>
  <header class="navbar">
    <div class="navbar-inner">
      <!-- Logo -->
      <router-link to="/" class="navbar-logo">Samik</router-link>

      <!-- Decorative center divider (hidden on mobile) -->
      <div class="navbar-divider" aria-hidden="true">
        <span class="div-line"></span>
        <span class="div-dot"></span>
        <span class="div-line"></span>
      </div>

      <!-- Nav links -->
      <nav class="navbar-nav">
        <router-link
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="nav-link"
          :class="{ 'nav-link--active': isActive(link.path) }"
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
  ...(import.meta.env.DEV ? [{ path: '/admin', label: 'Admin' }] : []),
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(20, 18, 16, 0.95);
  border-bottom: 1px solid #2E2823;
  backdrop-filter: blur(8px);
}

.navbar-inner {
  max-width: 56rem;
  margin: 0 auto;
  padding: 0.95rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.navbar-logo {
  font-family: 'Dancing Script', cursive;
  font-size: 1.6rem;
  font-weight: 700;
  color: #C5A880;
  text-decoration: none;
  letter-spacing: 0.02em;
  line-height: 1;
  transition: color 0.2s;
  flex-shrink: 0;
}
.navbar-logo:hover { color: #EAE6DF; }

.navbar-divider {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  opacity: 0.4;
}
.div-line {
  flex: 1;
  height: 1px;
  background: #C5A880;
}
.div-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #C5A880;
  flex-shrink: 0;
}

.navbar-nav {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-shrink: 0;
}

.nav-link {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  text-decoration: none;
  color: #C8C2B8;
  transition: color 0.18s;
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  right: 0;
  height: 1px;
  background: #C5A880;
  transform: scaleX(0);
  transition: transform 0.2s ease;
}
.nav-link:hover { color: #EAE6DF; }
.nav-link:hover::after { transform: scaleX(1); }
.nav-link--active { color: #C5A880; }
.nav-link--active::after { transform: scaleX(1); }

@media (max-width: 500px) {
  .navbar-divider { display: none; }
  .navbar-nav { gap: 1.2rem; }
}
</style>
