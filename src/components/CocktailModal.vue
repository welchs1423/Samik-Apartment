<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="item" class="modal-backdrop" @click.self="$emit('close')">
        <Transition name="modal-rise">
          <div v-if="item" class="modal-panel" role="dialog" :aria-label="item.name">

            <button class="modal-close" @click="$emit('close')" aria-label="Close">×</button>

            <div class="modal-inner">
              <!-- Left: image or watercolor illustration -->
              <div class="modal-art">
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                  class="modal-img"
                />
                <WatercolorIllustration
                  v-else
                  :name="item.name"
                  :category="category"
                  :ingredients="item.ingredients || []"
                  :uid="`m-${item.id}`"
                />
              </div>

              <!-- Right: details -->
              <div class="modal-details">
                <p class="modal-cat">{{ categoryName }}</p>

                <h2 class="modal-name">{{ item.name }}</h2>

                <p v-if="item.description" class="modal-desc">{{ item.description }}</p>

                <div v-if="item.tags?.length" class="modal-tags">
                  <span v-for="tag in item.tags" :key="tag" class="modal-tag">{{ tag }}</span>
                </div>

                <template v-if="item.ingredients?.length">
                  <div class="modal-sep"></div>
                  <p class="modal-section">Ingredients</p>
                  <ul class="modal-ings">
                    <li v-for="ing in item.ingredients" :key="ing" class="modal-ing">
                      <span class="modal-dash">—</span>{{ ing }}
                    </li>
                  </ul>
                </template>
              </div>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import WatercolorIllustration from './WatercolorIllustration.vue'
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  item: { type: Object, default: null },
  category: { type: String, default: '' },
  categoryName: { type: String, default: '' },
})
const emit = defineEmits(['close'])

watch(() => props.item, val => {
  document.body.style.overflow = val ? 'hidden' : ''
})
onUnmounted(() => { document.body.style.overflow = '' })

function onKey(e) { if (e.key === 'Escape' && props.item) emit('close') }
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(14, 12, 10, 0.82);
  backdrop-filter: blur(6px);
}

.modal-panel {
  position: relative;
  background: #1A1613;
  max-width: 860px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #2E2823;
  box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(197,168,128,0.08);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1.2rem;
  z-index: 10;
  background: none;
  border: none;
  cursor: pointer;
  color: #C8C2B8;
  font-size: 1.8rem;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  transition: color 0.15s;
}
.modal-close:hover { color: #EAE6DF; }

.modal-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 480px;
}

/* Left panel */
.modal-art {
  background: #141210;
  border-right: 1px solid #2E2823;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.modal-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Right panel */
.modal-details {
  padding: 2.5rem 2.2rem 2.5rem 2rem;
  display: flex;
  flex-direction: column;
}

.modal-cat {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #C5A880;
  margin-bottom: 0.6rem;
}

.modal-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 2.4rem;
  font-style: italic;
  font-weight: 300;
  color: #EAE6DF;
  line-height: 1.15;
  margin-bottom: 1rem;
}

.modal-desc {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.82rem;
  line-height: 1.85;
  color: #C8C2B8;
  margin-bottom: 1.2rem;
}

.modal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.4rem;
}
.modal-tag {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.58rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #C8C2B8;
  border: 1px solid #2E2823;
  padding: 0.18rem 0.6rem;
}

.modal-sep {
  border-top: 1px solid #2E2823;
  margin-bottom: 1.2rem;
}

.modal-section {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #C5A880;
  margin-bottom: 0.85rem;
}

.modal-ings {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.modal-ing {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.8rem;
  color: #EAE6DF;
  display: flex;
  align-items: baseline;
  gap: 0.55rem;
}
.modal-dash {
  color: #C5A880;
  flex-shrink: 0;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.28s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to     { opacity: 0; }

.modal-rise-enter-active  { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1); }
.modal-rise-leave-active  { transition: opacity 0.22s ease, transform 0.22s ease; }
.modal-rise-enter-from    { opacity: 0; transform: translateY(28px) scale(0.97); }
.modal-rise-leave-to      { opacity: 0; transform: translateY(14px) scale(0.98); }

@media (max-width: 640px) {
  .modal-inner { grid-template-columns: 1fr; }
  .modal-art {
    border-right: none;
    border-bottom: 1px solid #2E2823;
    min-height: 220px;
  }
  .modal-details { padding: 1.8rem 1.5rem; }
  .modal-name { font-size: 2rem; }
}
</style>
