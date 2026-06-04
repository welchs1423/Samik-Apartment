import { reactive, computed } from 'vue'
import { useMenuData } from './useMenuData'

const state = reactive({ ingredients: [] })

export async function initIngredients() {
  const res = await fetch('/api/data/ingredients')
  state.ingredients = await res.json()
}

function persist() {
  fetch('/api/data/ingredients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(JSON.parse(JSON.stringify(state.ingredients))),
  }).catch(err => console.error('[ingredients] persist error:', err))
}

export function useIngredients() {
  const { categories, getItems } = useMenuData()

  const ingredients = computed(() => state.ingredients)
  const ingredientNames = computed(() => state.ingredients.map(i => i.name))

  // Master list + available items from non-multiIngredient categories (spirits, etc.)
  const effectiveIngredientNames = computed(() => {
    const seen = new Set()
    const result = []
    for (const name of ingredientNames.value) {
      const key = name.toLowerCase()
      if (!seen.has(key)) { seen.add(key); result.push(name) }
    }
    for (const cat of categories.value) {
      if (cat.multiIngredient) continue
      for (const item of getItems(cat.id)) {
        if (item.available !== false && item.name) {
          const key = item.name.toLowerCase()
          if (!seen.has(key)) { seen.add(key); result.push(item.name) }
        }
      }
    }
    return result
  })

  function addIngredient(name) {
    const trimmed = name.trim()
    if (!trimmed) return
    if (state.ingredients.some(i => i.name.toLowerCase() === trimmed.toLowerCase())) return
    state.ingredients.push({ id: Date.now().toString(), name: trimmed })
    persist()
  }

  function deleteIngredient(id) {
    const idx = state.ingredients.findIndex(i => i.id === id)
    if (idx !== -1) state.ingredients.splice(idx, 1)
    persist()
  }

  function toggleIngredientAvailable(id) {
    const ing = state.ingredients.find(i => i.id === id)
    if (ing) {
      ing.available = ing.available === false ? true : false
      persist()
    }
  }

  function hasOutOfStockIngredient(itemIngredients) {
    if (!itemIngredients?.length) return false
    return itemIngredients.some(ingName => {
      const lower = ingName.toLowerCase()
      // Check explicit master list
      const masterMatch = state.ingredients.find(m => lower.startsWith(m.name.toLowerCase()))
      if (masterMatch?.available === false) return true
      // Check single-ingredient category items
      for (const cat of categories.value) {
        if (cat.multiIngredient) continue
        const item = getItems(cat.id).find(i => i.name && lower.startsWith(i.name.toLowerCase()))
        if (item?.available === false) return true
      }
      return false
    })
  }

  return { ingredients, ingredientNames, effectiveIngredientNames, addIngredient, deleteIngredient, toggleIngredientAvailable, hasOutOfStockIngredient }
}
