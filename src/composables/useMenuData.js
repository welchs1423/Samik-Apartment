import { reactive, computed } from 'vue'

const state = reactive({
  categories: [],
  itemsCache: {},
})

export async function initMenuData() {
  const [catsRes, itemsRes] = await Promise.all([
    fetch('/api/data/categories'),
    fetch('/api/data/items'),
  ])
  const cats = await catsRes.json()
  const items = await itemsRes.json()
  state.categories = cats
  Object.assign(state.itemsCache, items)
}

function persist(url, method, data) {
  const opts = { method }
  if (data !== undefined) {
    opts.headers = { 'Content-Type': 'application/json' }
    opts.body = JSON.stringify(data)
  }
  fetch(url, opts).catch(err => console.error('[menu] persist error:', err))
}

function persistItems() {
  persist('/api/data/items', 'POST', JSON.parse(JSON.stringify(state.itemsCache)))
}

export function useMenuData() {
  const categories = computed(() => state.categories)

  function getItems(catId) {
    if (!state.itemsCache[catId]) {
      state.itemsCache[catId] = []
    }
    return state.itemsCache[catId]
  }

  function setItems(catId, items) {
    state.itemsCache[catId] = items
    persistItems()
  }

  function saveCategory(cat) {
    const idx = state.categories.findIndex(c => c.id === cat.id)
    if (idx !== -1) {
      state.categories[idx] = { ...cat }
    } else {
      state.categories.push({ ...cat })
      state.itemsCache[cat.id] = []
    }
    persist('/api/data/categories', 'POST', JSON.parse(JSON.stringify(state.categories)))
    persistItems()
  }

  function deleteCategory(id) {
    const idx = state.categories.findIndex(c => c.id === id)
    if (idx !== -1) state.categories.splice(idx, 1)
    delete state.itemsCache[id]
    persist('/api/data/categories', 'POST', JSON.parse(JSON.stringify(state.categories)))
    persistItems()
  }

  function saveItem(catId, item) {
    const list = getItems(catId)
    const idx = list.findIndex(i => i.id === item.id)
    if (idx !== -1) {
      list[idx] = { ...item }
    } else {
      list.push({ ...item })
    }
    persistItems()
  }

  function deleteItem(catId, itemId) {
    const list = getItems(catId)
    const idx = list.findIndex(i => i.id === itemId)
    if (idx !== -1) list.splice(idx, 1)
    persistItems()
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
