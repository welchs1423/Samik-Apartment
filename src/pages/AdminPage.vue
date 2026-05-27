<template>
  <!-- ── Password gate ── -->
  <div v-if="!authenticated" class="auth-gate">
    <div class="auth-card">
      <p class="auth-logo">Samik</p>
      <p class="auth-subtitle">Admin Access</p>
      <div class="auth-ornament">
        <span class="auth-line"></span>
        <span class="auth-dot"></span>
        <span class="auth-line"></span>
      </div>
      <input
        v-model="passwordInput"
        type="password"
        class="auth-input"
        placeholder="Password"
        @keydown.enter="tryLogin"
        autofocus
      />
      <p v-if="passwordError" class="auth-error">Incorrect password.</p>
      <button class="auth-btn" @click="tryLogin">Enter</button>
    </div>
  </div>

  <!-- ── Admin content ── -->
  <div v-else class="max-w-4xl mx-auto px-6 py-24">
    <div class="mb-12">
      <p class="text-xs tracking-[0.3em] uppercase mb-3" style="color: #C5A880;">Management</p>
      <h2 class="font-serif text-5xl" style="color: #EAE6DF; font-style: italic; font-weight: 300;">Admin</h2>
      <div class="flex items-center gap-4 mt-5 mb-2">
        <span class="block h-px w-16" style="background-color: #C5A880; opacity: 0.4;"></span>
        <span class="block w-1 h-1 rounded-full" style="background-color: #C5A880; opacity: 0.6;"></span>
        <span class="block h-px w-16" style="background-color: #C5A880; opacity: 0.4;"></span>
      </div>
      <p class="text-xs tracking-wide mt-4" style="color: #C8C2B8;">
        Changes are saved to localStorage. Use "Export JSON" to download the updated file and replace the source data.
      </p>
    </div>

    <!-- Category selector -->
    <div class="flex flex-wrap gap-3 mb-10">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectCategory(cat)"
        class="text-xs tracking-widest uppercase px-4 py-2 transition-colors"
        :style="selectedCat?.id === cat.id
          ? { backgroundColor: '#C5A880', color: '#141210', border: '1px solid #C5A880' }
          : { backgroundColor: 'transparent', color: '#C8C2B8', border: '1px solid #2E2823' }"
      >
        {{ cat.name }}
      </button>
    </div>

    <template v-if="selectedCat">
      <!-- Header row -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-serif text-2xl" style="color: #C5A880; font-style: italic; font-weight: 300;">
          {{ selectedCat.name }}
          <span class="font-sans text-sm ml-2" style="color: #C8C2B8; font-style: normal;">
            ({{ editableItems.length }} items)
          </span>
        </h3>
        <div class="flex gap-3">
          <button
            v-if="selectedCat.type === 'cocktail'"
            @click="openAddModal"
            class="text-xs tracking-widest uppercase px-4 py-2"
            style="border: 1px solid #C5A880; color: #C5A880; background: transparent; cursor: pointer; transition: all 0.2s;"
            @mouseenter="e => { e.target.style.backgroundColor = '#C5A880'; e.target.style.color = '#141210' }"
            @mouseleave="e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#C5A880' }"
          >
            + Add Item
          </button>
          <button
            @click="exportJson"
            class="text-xs tracking-widest uppercase px-4 py-2"
            style="border: 1px solid #2E2823; color: #C8C2B8; background: transparent; cursor: pointer; transition: all 0.2s;"
            @mouseenter="e => { e.target.style.borderColor = '#C5A880'; e.target.style.color = '#C5A880' }"
            @mouseleave="e => { e.target.style.borderColor = '#2E2823'; e.target.style.color = '#C8C2B8' }"
          >
            Export JSON
          </button>
        </div>
      </div>

      <!-- Cocktail list -->
      <template v-if="selectedCat.type === 'cocktail'">
        <div style="border: 1px solid #2E2823;">
          <div
            v-for="item in editableItems"
            :key="item.id"
            class="grid grid-cols-1 sm:grid-cols-4 gap-4 px-6 py-5 items-center"
            style="border-bottom: 1px solid #2E2823;"
          >
            <div class="sm:col-span-3">
              <p class="font-serif text-lg mb-1" style="color: #EAE6DF;">{{ item.name }}</p>
              <p class="text-xs" style="color: #C8C2B8;">{{ item.description }}</p>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="tag in (item.tags || [])"
                  :key="tag"
                  class="text-xs px-2 py-0.5"
                  style="border: 1px solid #2E2823; color: #C8C2B8;"
                >{{ tag }}</span>
                <span class="text-xs ml-2" style="color: #C5A880;">{{ item.price }}</span>
              </div>
            </div>
            <div class="flex gap-3 justify-end">
              <button
                @click="openEditModal(item)"
                class="text-xs tracking-widest uppercase px-3 py-1.5"
                style="border: 1px solid #2E2823; color: #C8C2B8; background: transparent; cursor: pointer;"
              >Edit</button>
              <button
                @click="deleteItem(item.id)"
                class="text-xs tracking-widest uppercase px-3 py-1.5"
                style="border: 1px solid #2E2823; color: #C8C2B8; background: transparent; cursor: pointer;"
                @mouseenter="e => { e.target.style.borderColor = '#8B2020'; e.target.style.color = '#8B2020' }"
                @mouseleave="e => { e.target.style.borderColor = '#2E2823'; e.target.style.color = '#C8C2B8' }"
              >Delete</button>
            </div>
          </div>
          <p v-if="editableItems.length === 0" class="px-6 py-8 text-sm text-center" style="color: #C8C2B8;">
            No items yet.
          </p>
        </div>
      </template>

      <!-- Spirit / Wine list (read-only for now) -->
      <template v-else>
        <div class="px-6 py-8 text-center" style="border: 1px solid #2E2823;">
          <p class="text-sm mb-2" style="color: #C8C2B8;">
            {{ selectedCat.type === 'wine' ? 'Wine' : 'Spirit' }} lists are edited directly in the JSON file.
          </p>
          <p class="text-xs" style="color: #C5A880;">
            src/data/items/{{ selectedCat.id }}.json
          </p>
          <button
            @click="exportJson"
            class="text-xs tracking-widest uppercase px-4 py-2 mt-4 inline-block"
            style="border: 1px solid #C5A880; color: #C5A880; background: transparent; cursor: pointer;"
          >
            Export JSON
          </button>
        </div>
      </template>
    </template>

    <!-- Reset notice -->
    <div class="mt-12 px-6 py-4" style="border: 1px solid #2E2823;">
      <p class="text-xs tracking-wide" style="color: #C8C2B8;">
        <span style="color: #C5A880;">Note:</span>
        LocalStorage overrides are applied on top of the source JSON. To make changes permanent, export and replace the file in
        <span style="color: #C5A880;">src/data/items/</span>.
        <button @click="resetAll" class="ml-4 text-xs underline cursor-pointer" style="color: #8B2020; background: none; border: none;">
          Reset all overrides
        </button>
      </p>
    </div>
  </div><!-- /admin content -->

  <!-- Modal (inside v-else scope via teleport-less placement; still works) -->
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center px-4"
    style="background-color: rgba(0,0,0,0.7);"
    @click.self="closeModal"
  >
    <div class="w-full max-w-lg p-8" style="background-color: #1A1613; border: 1px solid #2E2823;">
      <h3 class="font-serif text-2xl mb-6" style="color: #EAE6DF; font-style: italic; font-weight: 300;">
        {{ editingItem ? 'Edit Item' : 'Add Item' }}
      </h3>

      <div class="flex flex-col gap-4">
        <label class="flex flex-col gap-1">
          <span class="text-xs tracking-widest uppercase" style="color: #C8C2B8;">Name *</span>
          <input v-model="form.name" class="admin-input" placeholder="e.g. Manhattan" />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs tracking-widest uppercase" style="color: #C8C2B8;">ID (slug) *</span>
          <input v-model="form.id" class="admin-input" placeholder="e.g. manhattan" :disabled="!!editingItem" />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs tracking-widest uppercase" style="color: #C8C2B8;">Price</span>
          <input v-model="form.price" class="admin-input" placeholder="e.g. $9.25" />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs tracking-widest uppercase" style="color: #C8C2B8;">Description</span>
          <textarea v-model="form.description" class="admin-input" rows="3" placeholder="Ingredients and notes..."></textarea>
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs tracking-widest uppercase" style="color: #C8C2B8;">Ingredients (one per line)</span>
          <textarea v-model="form.ingredientsRaw" class="admin-input" rows="4" placeholder="Bourbon 60ml&#10;Sweet vermouth 30ml"></textarea>
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs tracking-widest uppercase" style="color: #C8C2B8;">Tags (comma-separated)</span>
          <input v-model="form.tagsRaw" class="admin-input" placeholder="Classic, Strong, Stirred" />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs tracking-widest uppercase" style="color: #C8C2B8;">Image path</span>
          <input v-model="form.image" class="admin-input" placeholder="/images/manhattan.jpg" />
        </label>
      </div>

      <p v-if="formError" class="text-xs mt-4" style="color: #8B2020;">{{ formError }}</p>

      <div class="flex gap-3 justify-end mt-8">
        <button
          @click="closeModal"
          class="text-xs tracking-widest uppercase px-5 py-2"
          style="border: 1px solid #2E2823; color: #C8C2B8; background: transparent; cursor: pointer;"
        >Cancel</button>
        <button
          @click="saveItem"
          class="text-xs tracking-widest uppercase px-5 py-2"
          style="border: 1px solid #C5A880; color: #141210; background: #C5A880; cursor: pointer;"
        >Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import categoriesData from '../data/categories.json'

// ── Auth ──────────────────────────────────────────────
const ADMIN_PASSWORD = '181108'

const authenticated = ref(false)
const passwordInput = ref('')
const passwordError = ref(false)

onMounted(() => {
  if (sessionStorage.getItem('samik_admin_auth') === '1') {
    authenticated.value = true
  }
})

function tryLogin() {
  if (passwordInput.value === ADMIN_PASSWORD) {
    sessionStorage.setItem('samik_admin_auth', '1')
    authenticated.value = true
    passwordError.value = false
  } else {
    passwordError.value = true
    passwordInput.value = ''
  }
}
// ─────────────────────────────────────────────────────

const itemModules = import.meta.glob('../data/items/*.json', { eager: true })
const sourceItems = {}
for (const path in itemModules) {
  const key = path.replace('../data/items/', '').replace('.json', '')
  sourceItems[key] = itemModules[path].default
}

const STORAGE_PREFIX = 'samik_admin_'

function loadItems(categoryId) {
  const stored = localStorage.getItem(STORAGE_PREFIX + categoryId)
  if (stored) {
    try { return JSON.parse(stored) } catch { /* ignore */ }
  }
  return JSON.parse(JSON.stringify(sourceItems[categoryId] ?? []))
}

function saveItems(categoryId, items) {
  localStorage.setItem(STORAGE_PREFIX + categoryId, JSON.stringify(items))
}

const categories = categoriesData
const selectedCat = ref(null)
const editableItems = ref([])

function selectCategory(cat) {
  selectedCat.value = cat
  editableItems.value = loadItems(cat.id)
}

function deleteItem(id) {
  if (!confirm('Delete this item?')) return
  editableItems.value = editableItems.value.filter(i => i.id !== id)
  saveItems(selectedCat.value.id, editableItems.value)
}

function exportJson() {
  const data = JSON.stringify(editableItems.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${selectedCat.value.id}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function resetAll() {
  if (!confirm('Reset all localStorage overrides? This cannot be undone.')) return
  for (const cat of categories) {
    localStorage.removeItem(STORAGE_PREFIX + cat.id)
  }
  if (selectedCat.value) {
    editableItems.value = loadItems(selectedCat.value.id)
  }
}

// Modal
const showModal = ref(false)
const editingItem = ref(null)
const formError = ref('')
const form = ref({ id: '', name: '', price: '', description: '', ingredientsRaw: '', tagsRaw: '', image: '' })

function openAddModal() {
  editingItem.value = null
  form.value = { id: '', name: '', price: '', description: '', ingredientsRaw: '', tagsRaw: '', image: '' }
  formError.value = ''
  showModal.value = true
}

function openEditModal(item) {
  editingItem.value = item
  form.value = {
    id: item.id,
    name: item.name,
    price: item.price ?? '',
    description: item.description ?? '',
    ingredientsRaw: (item.ingredients ?? []).join('\n'),
    tagsRaw: (item.tags ?? []).join(', '),
    image: item.image ?? '',
  }
  formError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function saveItem() {
  if (!form.value.name.trim()) { formError.value = 'Name is required.'; return }
  if (!form.value.id.trim()) { formError.value = 'ID is required.'; return }

  const payload = {
    id: form.value.id.trim(),
    name: form.value.name.trim(),
    price: form.value.price.trim() || null,
    description: form.value.description.trim() || null,
    ingredients: form.value.ingredientsRaw.split('\n').map(s => s.trim()).filter(Boolean),
    tags: form.value.tagsRaw.split(',').map(s => s.trim()).filter(Boolean),
    image: form.value.image.trim() || null,
  }

  if (editingItem.value) {
    const idx = editableItems.value.findIndex(i => i.id === payload.id)
    if (idx !== -1) editableItems.value[idx] = payload
  } else {
    if (editableItems.value.some(i => i.id === payload.id)) {
      formError.value = 'An item with this ID already exists.'
      return
    }
    editableItems.value.push(payload)
  }

  saveItems(selectedCat.value.id, editableItems.value)
  closeModal()
}
</script>

<style scoped>
/* ── Auth gate ── */
.auth-gate {
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.auth-card {
  width: 100%;
  max-width: 360px;
  border: 1px solid #2E2823;
  padding: 2.5rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}
.auth-logo {
  font-family: 'Dancing Script', cursive;
  font-size: 2rem;
  font-weight: 700;
  color: #C5A880;
  line-height: 1;
  margin-bottom: 0.6rem;
}
.auth-subtitle {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.58rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #C8C2B8;
  margin-bottom: 1.2rem;
}
.auth-ornament {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.8rem;
}
.auth-line {
  display: block;
  width: 2.5rem;
  height: 1px;
  background: #C5A880;
  opacity: 0.3;
}
.auth-dot {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #C5A880;
  opacity: 0.5;
}
.auth-input {
  width: 100%;
  background: #141210;
  border: 1px solid #2E2823;
  color: #EAE6DF;
  padding: 0.6rem 0.9rem;
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  outline: none;
  transition: border-color 0.2s;
  margin-bottom: 0.75rem;
  text-align: center;
}
.auth-input:focus {
  border-color: #C5A880;
}
.auth-error {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  color: #C8C2B8;
  margin-bottom: 0.75rem;
}
.auth-btn {
  width: 100%;
  padding: 0.65rem;
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #EAE6DF;
  background: transparent;
  border: 1px solid #C5A880;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.auth-btn:hover {
  background: #C5A880;
  color: #141210;
}

/* ── Admin inputs ── */
.admin-input {
  background-color: #141210;
  border: 1px solid #2E2823;
  color: #EAE6DF;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  width: 100%;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
}
.admin-input:focus {
  border-color: #C5A880;
}
.admin-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
