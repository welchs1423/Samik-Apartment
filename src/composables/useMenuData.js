import { reactive, computed } from 'vue'
import categoriesJson from '../data/categories.json'

const itemModules = import.meta.glob('../data/items/*.json', { eager: true })
const sourceItems = {}
for (const path in itemModules) {
  const key = path.replace('../data/items/', '').replace('.json', '')
  sourceItems[key] = itemModules[path].default ?? itemModules[path]
}

function persist(url, method, data) {
  const opts = { method }
  if (data !== undefined) {
    opts.headers = { 'Content-Type': 'application/json' }
    opts.body = JSON.stringify(data)
  }
  fetch(url, opts).catch(err => console.error('[menu] persist error:', err))
}

const state = reactive({
  categories: JSON.parse(JSON.stringify(categoriesJson)),
  itemsCache: {},
})

for (const catId of Object.keys(sourceItems)) {
  state.itemsCache[catId] = JSON.parse(JSON.stringify(sourceItems[catId]))
}

export function useMenuData() {
  const categories = computed(() => state.categories)

  function getItems(catId) {
    if (!state.itemsCache[catId]) {
      state.itemsCache[catId] = JSON.parse(JSON.stringify(sourceItems[catId] ?? []))
    }
    return state.itemsCache[catId]
  }

  function setItems(catId, items) {
    state.itemsCache[catId] = items
    persist(`/api/data/items/${catId}`, 'POST', items)
  }

  function saveCategory(cat) {
    const idx = state.categories.findIndex(c => c.id === cat.id)
    if (idx !== -1) {
      state.categories[idx] = { ...cat }
    } else {
      state.categories.push({ ...cat })
      state.itemsCache[cat.id] = []
      persist(`/api/data/items/${cat.id}`, 'POST', [])
    }
    persist('/api/data/categories', 'POST', JSON.parse(JSON.stringify(state.categories)))
  }

  function deleteCategory(id) {
    const idx = state.categories.findIndex(c => c.id === id)
    if (idx !== -1) state.categories.splice(idx, 1)
    persist('/api/data/categories', 'POST', JSON.parse(JSON.stringify(state.categories)))
    persist(`/api/data/items/${id}`, 'DELETE')
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
    persist(`/api/data/items/${catId}`, 'POST', JSON.parse(JSON.stringify(list)))
  }

  function deleteItem(catId, itemId) {
    const list = getItems(catId)
    const idx = list.findIndex(i => i.id === itemId)
    if (idx !== -1) list.splice(idx, 1)
    persist(`/api/data/items/${catId}`, 'POST', JSON.parse(JSON.stringify(list)))
  }

  return {
    categories,
    getItems,
    setItems,
    saveCategory,
    deleteCategory,
    saveItem,
    deleteItem,
  }
}
