import { reactive, computed } from 'vue'
import categoriesJson from '../data/categories.json'

const itemModules = import.meta.glob('../data/items/*.json', { eager: true })
const sourceItems = {}
for (const path in itemModules) {
  const key = path.replace('../data/items/', '').replace('.json', '')
  sourceItems[key] = itemModules[path].default ?? itemModules[path]
}

const CATS_KEY = 'samik_cats'
const ITEMS_PREFIX = 'samik_admin_'

function loadCategories() {
  const stored = localStorage.getItem(CATS_KEY)
  if (stored) {
    try { return JSON.parse(stored) } catch { /* ignore */ }
  }
  return JSON.parse(JSON.stringify(categoriesJson))
}

function loadItems(catId) {
  const stored = localStorage.getItem(ITEMS_PREFIX + catId)
  if (stored) {
    try { return JSON.parse(stored) } catch { /* ignore */ }
  }
  return JSON.parse(JSON.stringify(sourceItems[catId] ?? []))
}

const state = reactive({
  categories: loadCategories(),
  itemsCache: {},
})

// Preload all source categories upfront — avoids side effects inside computed getters
for (const catId of Object.keys(sourceItems)) {
  state.itemsCache[catId] = loadItems(catId)
}

export function useMenuData() {
  const categories = computed(() => state.categories)

  function getItems(catId) {
    if (!state.itemsCache[catId]) {
      state.itemsCache[catId] = loadItems(catId)
    }
    return state.itemsCache[catId]
  }

  function setItems(catId, items) {
    state.itemsCache[catId] = items
    localStorage.setItem(ITEMS_PREFIX + catId, JSON.stringify(items))
  }

  function saveCategory(cat) {
    const idx = state.categories.findIndex(c => c.id === cat.id)
    if (idx !== -1) {
      state.categories[idx] = { ...cat }
    } else {
      state.categories.push({ ...cat })
      state.itemsCache[cat.id] = []
      localStorage.setItem(ITEMS_PREFIX + cat.id, JSON.stringify([]))
    }
    localStorage.setItem(CATS_KEY, JSON.stringify(state.categories))
  }

  function deleteCategory(id) {
    const idx = state.categories.findIndex(c => c.id === id)
    if (idx !== -1) state.categories.splice(idx, 1)
    localStorage.setItem(CATS_KEY, JSON.stringify(state.categories))
    localStorage.removeItem(ITEMS_PREFIX + id)
    delete state.itemsCache[id]
  }

  function saveItem(catId, item) {
    const list = getItems(catId)
    const idx = list.findIndex(i => i.id === item.id)
    if (idx !== -1) {
      list[idx] = { ...item }
    } else {
      list.push({ ...item })
    }
    localStorage.setItem(ITEMS_PREFIX + catId, JSON.stringify(list))
  }

  function deleteItem(catId, itemId) {
    const list = getItems(catId)
    const idx = list.findIndex(i => i.id === itemId)
    if (idx !== -1) list.splice(idx, 1)
    localStorage.setItem(ITEMS_PREFIX + catId, JSON.stringify(list))
  }

  function resetAll() {
    localStorage.removeItem(CATS_KEY)
    for (const cat of [...categoriesJson, ...state.categories]) {
      localStorage.removeItem(ITEMS_PREFIX + cat.id)
    }
    state.categories.splice(0, state.categories.length, ...JSON.parse(JSON.stringify(categoriesJson)))
    for (const catId of Object.keys(sourceItems)) {
      state.itemsCache[catId] = loadItems(catId)
    }
  }

  return {
    categories,
    getItems,
    setItems,
    saveCategory,
    deleteCategory,
    saveItem,
    deleteItem,
    resetAll,
  }
}
