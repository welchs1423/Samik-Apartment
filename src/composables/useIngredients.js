import { reactive, computed } from 'vue'

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
  const ingredients = computed(() => state.ingredients)
  const ingredientNames = computed(() => state.ingredients.map(i => i.name))

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
    return itemIngredients.some(itemIng =>
      state.ingredients.some(master =>
        master.available === false &&
        itemIng.toLowerCase().startsWith(master.name.toLowerCase())
      )
    )
  }

  return { ingredients, ingredientNames, addIngredient, deleteIngredient, toggleIngredientAvailable, hasOutOfStockIngredient }
}
