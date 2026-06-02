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
      <input v-model="passwordInput" type="password" class="auth-input" placeholder="Password"
        @keydown.enter="tryLogin" autofocus />
      <p v-if="passwordError" class="auth-error">Incorrect password.</p>
      <button class="auth-btn" @click="tryLogin">Enter</button>
    </div>
  </div>

  <!-- ── Admin content ── -->
  <div v-else class="admin-page">
    <div class="admin-inner">

      <!-- Header -->
      <div class="admin-header">
        <p class="admin-eyebrow">Management</p>
        <h2 class="admin-title">Admin</h2>
        <div class="admin-ornament">
          <span class="orn-line"></span><span class="orn-dot"></span><span class="orn-line"></span>
        </div>
        <p class="admin-note">Changes are written directly to JSON files.</p>
      </div>

      <!-- ════ SECTION 1: CATEGORIES ════ -->
      <section class="admin-section">
        <div class="section-head">
          <h3 class="section-title">Categories</h3>
          <button class="btn-gold" @click="openAddCatModal">+ Add Category</button>
        </div>

        <div class="admin-table">
          <div v-for="cat in categories" :key="cat.id" class="table-row">
            <div class="row-main">
              <span class="row-name">{{ cat.name }}</span>
              <span v-if="cat.description" class="row-desc">{{ cat.description }}</span>
            </div>
            <div class="row-actions">
              <button class="btn-sm" @click="openEditCatModal(cat)">Edit</button>
              <button class="btn-sm btn-danger" @click="confirmDeleteCategory(cat.id)">Delete</button>
            </div>
          </div>
          <p v-if="categories.length === 0" class="empty-msg">No categories.</p>
        </div>

      </section>

      <!-- ════ SECTION 2: ITEMS ════ -->
      <section class="admin-section">
        <div class="section-head">
          <h3 class="section-title">Items</h3>
        </div>

        <div class="cat-selector">
          <button v-for="cat in categories" :key="cat.id" class="cat-tab"
            :class="{ active: selectedCatId === cat.id }" @click="selectedCatId = cat.id">
            {{ cat.name }}
          </button>
        </div>

        <template v-if="selectedCat">
          <div class="section-head" style="margin-top:1.25rem;">
            <span class="section-subtitle">
              {{ selectedCat.name }}
              <span class="item-count">({{ displayItems.length }})</span>
            </span>
            <div class="btn-group">
              <button class="btn-gold" @click="openAddItemModal">+ Add Item</button>
            </div>
          </div>

          <!-- Wine hint -->
          <div v-if="isWineCat" class="type-hint">
            Items are grouped by subcategory. Each row is an individual wine.
          </div>

          <!-- ── Subcategory management ── -->
          <div class="subcat-mgmt">
            <div class="subcat-mgmt-header">
              <span class="subcat-mgmt-title">Subcategories</span>
              <button class="btn-sm" @click="openAddSubcatModal">+ Add</button>
            </div>
            <div v-if="existingSubcategories.length > 0" class="subcat-tag-list">
              <div v-for="s in existingSubcategories" :key="s" class="subcat-tag-row">
                <span class="subcat-tag-name">{{ s }}</span>
                <div class="row-actions" style="gap:0.3rem;">
                  <button class="btn-sm" @click="openEditSubcatModal(s)">Edit</button>
                  <button class="btn-sm btn-danger" @click="confirmDeleteSubcat(s)">Delete</button>
                </div>
              </div>
            </div>
            <p v-else class="empty-msg" style="font-size:0.78rem; margin:0.25rem 0 0;">No subcategories yet.</p>
          </div>

          <div class="admin-table">
            <div v-for="item in displayItems" :key="item._key" class="table-row">
              <div class="item-thumb">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="thumb-img" />
                <div v-else class="thumb-placeholder">{{ item._initial }}</div>
              </div>
              <div class="row-main">
                <span class="row-name">{{ item.name }}</span>
                <span v-if="item._subcategory" class="subcat-badge">{{ item._subcategory }}</span>
                <span v-if="item.price" class="row-price">{{ item.price }}</span>
                <span v-if="item.bottlePrice" class="row-price" style="opacity:.7;">btl. {{ item.bottlePrice }}</span>
                <span v-if="item.description" class="row-desc">{{ item.description }}</span>
              </div>
              <div class="row-actions">
                <button class="btn-sm" @click="openEditItemModal(item)">Edit</button>
                <button class="btn-sm btn-danger" @click="confirmDeleteItem(item)">Delete</button>
              </div>
            </div>
            <p v-if="displayItems.length === 0" class="empty-msg">No items. Add one above.</p>
          </div>
        </template>

        <p v-else class="empty-msg" style="margin-top:1rem;">Select a category above.</p>
      </section>

    </div>
  </div>

  <!-- ════ CATEGORY MODAL ════ -->
  <div v-if="showCatModal" class="modal-overlay" @mousedown.self="closeCatModal">
    <div class="modal-box">
      <h3 class="modal-title">{{ editingCat ? 'Edit Category' : 'Add Category' }}</h3>
      <div class="form-fields">
        <label class="field">
          <span class="field-label">Name *</span>
          <input v-model="catForm.name" class="admin-input" placeholder="e.g. Martinis" />
        </label>
        <label class="field">
          <span class="field-label">ID (slug) *</span>
          <input v-model="catForm.id" class="admin-input" placeholder="e.g. martinis" :disabled="!!editingCat" />
          <span class="field-hint">Lowercase, no spaces. Used in URL.</span>
        </label>
        <label class="field">
          <span class="field-label">Description</span>
          <input v-model="catForm.description" class="admin-input" placeholder="Short tagline" />
        </label>
        <label class="field">
          <span class="field-label">Note</span>
          <textarea v-model="catForm.note" class="admin-input" rows="2" placeholder="Serving note shown on category page"></textarea>
        </label>
      </div>
      <p v-if="catFormError" class="form-error">{{ catFormError }}</p>
      <div class="modal-actions">
        <button class="btn-outline" @click="closeCatModal">Cancel</button>
        <button class="btn-save" @click="saveCategoryForm">Save</button>
      </div>
    </div>
  </div>

  <!-- ════ ITEM MODAL ════ -->
  <div v-if="showItemModal" class="modal-overlay" @mousedown.self="closeItemModal">
    <div class="modal-box modal-box--wide">
      <h3 class="modal-title">{{ editingItem ? 'Edit Item' : 'Add Item' }}</h3>

      <div class="form-fields">
        <!-- Name — all types -->
        <label class="field">
          <span class="field-label">Name *</span>
          <input v-model="itemForm.name" class="admin-input" placeholder="e.g. Cabernet Sauvignon" />
        </label>

        <!-- Cocktail: ID slug -->
        <label v-if="!isWineCat" class="field">
          <span class="field-label">ID (slug) *</span>
          <input v-model="itemForm.id" class="admin-input" placeholder="e.g. manhattan" :disabled="!!editingItem" />
        </label>

        <!-- Subcategory — all types (required for wine, optional otherwise) -->
        <label class="field">
          <span class="field-label">Subcategory{{ isWineCat ? ' *' : '' }}</span>
          <input v-model="itemForm.subcategory" class="admin-input"
            :placeholder="isWineCat ? 'e.g. Red, White, House' : 'e.g. Blanco, Reposado (optional)'"
            list="subcat-list" />
          <datalist id="subcat-list">
            <option v-for="s in existingSubcategories" :key="s" :value="s" />
          </datalist>
        </label>

        <!-- Wine: glass / bottle price -->
        <template v-if="isWineCat">
          <label class="field">
            <span class="field-label">Glass Price</span>
            <input v-model="itemForm.glassPrice" class="admin-input" placeholder="e.g. $8.25" />
          </label>
          <label class="field">
            <span class="field-label">Bottle Price</span>
            <input v-model="itemForm.bottlePrice" class="admin-input" placeholder="e.g. $30" />
          </label>
        </template>

        <!-- Cocktail / Spirit: generic price -->
        <label v-if="!isWineCat" class="field">
          <span class="field-label">Price</span>
          <input v-model="itemForm.price" class="admin-input" placeholder="e.g. $9.25" />
        </label>

        <!-- Description — all types -->
        <label class="field">
          <span class="field-label">Description</span>
          <textarea v-model="itemForm.description" class="admin-input" rows="3" placeholder="Flavor notes..."></textarea>
        </label>

        <!-- Ingredients, tags — cocktail / spirit only -->
        <template v-if="!isWineCat">
          <label class="field">
            <span class="field-label">Ingredients (one per line)</span>
            <textarea v-model="itemForm.ingredientsRaw" class="admin-input" rows="4" placeholder="Bourbon 60ml&#10;Sweet vermouth 30ml"></textarea>
          </label>
          <label class="field">
            <span class="field-label">Tags (comma-separated)</span>
            <input v-model="itemForm.tagsRaw" class="admin-input" placeholder="Classic, Strong, Stirred" />
          </label>
        </template>

        <!-- Image upload — all types -->
        <div class="field">
          <span class="field-label">Image</span>
          <div class="image-upload-area">
            <div v-if="itemForm.image" class="image-preview">
              <img :src="itemForm.image" alt="Preview" class="preview-img" />
              <button class="remove-img-btn" @click="itemForm.image = null" title="Remove">✕</button>
            </div>
            <label class="upload-btn">
              {{ itemForm.image ? 'Replace Image' : 'Choose Image' }}
              <input type="file" accept="image/*" class="file-input" @change="handleImageUpload" />
            </label>
            <p v-if="imageWarning" class="image-warning">{{ imageWarning }}</p>
          </div>
        </div>
      </div>

      <p v-if="itemFormError" class="form-error">{{ itemFormError }}</p>

      <div class="modal-actions">
        <button class="btn-outline" @click="closeItemModal">Cancel</button>
        <button class="btn-save" @click="saveItemForm">Save</button>
      </div>
    </div>
  </div>

  <!-- ════ SUBCATEGORY MODAL ════ -->
  <div v-if="showSubcatModal" class="modal-overlay" @mousedown.self="closeSubcatModal">
    <div class="modal-box">
      <h3 class="modal-title">{{ editingSubcat !== null ? 'Edit Subcategory' : 'Add Subcategory' }}</h3>
      <div class="form-fields">
        <label class="field">
          <span class="field-label">Name *</span>
          <input v-model="subcatForm.name" class="admin-input" placeholder="e.g. Red, Blanco, Reposado" />
        </label>
        <label v-if="isWineCat" class="field">
          <span class="field-label">Note</span>
          <input v-model="subcatForm.note" class="admin-input" placeholder="e.g. By the glass & bottle" />
        </label>
      </div>
      <p v-if="subcatFormError" class="form-error">{{ subcatFormError }}</p>
      <div class="modal-actions">
        <button class="btn-outline" @click="closeSubcatModal">Cancel</button>
        <button class="btn-save" @click="saveSubcatForm">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMenuData } from '../composables/useMenuData'

// ── Auth ──────────────────────────────────────────────
const ADMIN_PASSWORD = '181108'
const authenticated = ref(false)
const passwordInput = ref('')
const passwordError = ref(false)

onMounted(() => {
  if (sessionStorage.getItem('samik_admin_auth') === '1') authenticated.value = true
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

// ── Data ──────────────────────────────────────────────
const { categories, getItems, setItems, saveCategory, deleteCategory, saveItem, deleteItem } = useMenuData()

function slugify(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ── Categories section ────────────────────────────────
const showCatModal = ref(false)
const editingCat = ref(null)
const catFormError = ref('')
const catForm = ref({ id: '', name: '', description: '', note: '' })

function openAddCatModal() {
  editingCat.value = null
  catForm.value = { id: '', name: '', description: '', note: '' }
  catFormError.value = ''
  showCatModal.value = true
}

function openEditCatModal(cat) {
  editingCat.value = cat
  catForm.value = { id: cat.id, name: cat.name, description: cat.description ?? '', note: cat.note ?? '' }
  catFormError.value = ''
  showCatModal.value = true
}

function closeCatModal() { showCatModal.value = false }

function saveCategoryForm() {
  if (!catForm.value.name.trim()) { catFormError.value = 'Name is required.'; return }
  if (!catForm.value.id.trim()) { catFormError.value = 'ID is required.'; return }
  if (!editingCat.value && categories.value.some(c => c.id === catForm.value.id.trim())) {
    catFormError.value = 'A category with this ID already exists.'
    return
  }
  const payload = {
    id: catForm.value.id.trim(),
    name: catForm.value.name.trim(),
    type: editingCat.value?.type ?? 'cocktail',
    description: catForm.value.description.trim() || null,
    coverImage: editingCat.value?.coverImage ?? null,
  }
  if (catForm.value.note.trim()) payload.note = catForm.value.note.trim()
  saveCategory(payload)
  closeCatModal()
}

function confirmDeleteCategory(id) {
  const cat = categories.value.find(c => c.id === id)
  if (!cat) return
  if (confirm(`Delete category "${cat.name}" and all its items?`)) {
    deleteCategory(id)
    if (selectedCatId.value === id) selectedCatId.value = null
  }
}

// ── Items section ─────────────────────────────────────
const selectedCatId = ref(null)
const selectedCat = computed(() => categories.value.find(c => c.id === selectedCatId.value) ?? null)

const isWineCat    = computed(() => selectedCat.value?.type === 'wine')
const isSpiritCat  = computed(() => selectedCat.value?.type === 'spirit')
const isCocktailCat = computed(() => selectedCat.value?.type === 'cocktail')

// Normalize raw items into a flat display list regardless of source structure
const displayItems = computed(() => {
  if (!selectedCatId.value) return []
  const raw = getItems(selectedCatId.value)
  if (!raw || !raw.length) return []

  if (isWineCat.value) {
    // Wine: grouped structure {subcategory, items[], note?}
    if ('subcategory' in raw[0]) {
      return raw.flatMap(group =>
        (group.items ?? []).map(wine => ({
          _key: `${group.subcategory}::${wine.name}`,
          _subcategory: group.subcategory,
          _groupNote: group.note,
          _isWine: true,
          id: `${group.subcategory}::${wine.name}`,
          name: wine.name,
          price: wine.glassPrice ?? null,
          bottlePrice: wine.bottlePrice ?? null,
          image: wine.image ?? null,
          description: wine.description ?? null,
          ingredients: wine.ingredients ?? [],
          tags: wine.tags ?? [],
          _initial: (wine.name || '?').charAt(0),
        }))
      )
    }
    // Flat wine items (added by admin)
    return raw.map(item => ({
      ...item,
      _key: item.id ?? slugify(item.name ?? ''),
      _subcategory: item.subcategory ?? '',
      _isWine: true,
      _initial: (item.name || '?').charAt(0),
    }))
  }

  if (isSpiritCat.value) {
    return raw.map(item => ({
      ...item,
      _key: item.id ?? slugify(item.name ?? ''),
      id: item.id ?? slugify(item.name ?? ''),
      _subcategory: item.subcategory ?? '',
      _initial: (item.name || '?').charAt(0),
    }))
  }

  // Cocktail
  return raw.map(item => ({
    ...item,
    _key: item.id ?? slugify(item.name ?? ''),
    _subcategory: item.subcategory ?? '',
    _initial: (item.name || '?').charAt(0),
  }))
})

// Existing subcategories (used for datalist + subcategory management)
const existingSubcategories = computed(() => {
  if (!selectedCatId.value) return []
  const raw = getItems(selectedCatId.value)
  if (isWineCat.value) {
    return [...new Set((raw || []).map(g => g.subcategory).filter(Boolean))]
  }
  // Spirit/cocktail: union of category.subcategories[] + subcategories found on items
  const stored = selectedCat.value?.subcategories ?? []
  const fromItems = (raw || []).map(i => i.subcategory).filter(Boolean)
  return [...new Set([...stored, ...fromItems])]
})

// ── Subcategory management ─────────────────────────────
const showSubcatModal = ref(false)
const editingSubcat = ref(null)   // null = add, string = editing this name
const subcatForm = ref({ name: '', note: '' })
const subcatFormError = ref('')

function openAddSubcatModal() {
  editingSubcat.value = null
  subcatForm.value = { name: '', note: '' }
  subcatFormError.value = ''
  showSubcatModal.value = true
}

function openEditSubcatModal(name) {
  editingSubcat.value = name
  let note = ''
  if (isWineCat.value) {
    const raw = getItems(selectedCatId.value)
    note = (raw || []).find(g => g.subcategory === name)?.note ?? ''
  }
  subcatForm.value = { name, note }
  subcatFormError.value = ''
  showSubcatModal.value = true
}

function closeSubcatModal() { showSubcatModal.value = false }

function saveSubcatForm() {
  const newName = subcatForm.value.name.trim()
  if (!newName) { subcatFormError.value = 'Name is required.'; return }

  if (editingSubcat.value === null) {
    // Add
    if (existingSubcategories.value.includes(newName)) { subcatFormError.value = 'Already exists.'; return }
    if (isWineCat.value) {
      const groups = JSON.parse(JSON.stringify(getItems(selectedCatId.value) || []))
      const newGroup = { subcategory: newName, items: [] }
      if (subcatForm.value.note.trim()) newGroup.note = subcatForm.value.note.trim()
      groups.push(newGroup)
      setItems(selectedCatId.value, groups)
    } else {
      const cat = { ...selectedCat.value }
      cat.subcategories = [...(cat.subcategories ?? []), newName]
      saveCategory(cat)
    }
  } else {
    // Edit / rename
    const oldName = editingSubcat.value
    if (oldName !== newName && existingSubcategories.value.includes(newName)) { subcatFormError.value = 'Already exists.'; return }
    if (isWineCat.value) {
      const groups = JSON.parse(JSON.stringify(getItems(selectedCatId.value) || []))
      const group = groups.find(g => g.subcategory === oldName)
      if (group) {
        group.subcategory = newName
        if (subcatForm.value.note.trim()) group.note = subcatForm.value.note.trim()
        else delete group.note
      }
      setItems(selectedCatId.value, groups)
    } else {
      const cat = { ...selectedCat.value }
      cat.subcategories = (cat.subcategories ?? []).map(s => s === oldName ? newName : s)
      saveCategory(cat)
      const raw = JSON.parse(JSON.stringify(getItems(selectedCatId.value) || []))
      raw.forEach(item => { if (item.subcategory === oldName) item.subcategory = newName })
      setItems(selectedCatId.value, raw)
    }
  }
  closeSubcatModal()
}

function confirmDeleteSubcat(name) {
  if (isWineCat.value) {
    const groups = getItems(selectedCatId.value) || []
    const count = groups.find(g => g.subcategory === name)?.items?.length ?? 0
    if (!confirm(`"${name}" 서브카테고리를 삭제합니다${count > 0 ? ` (포함된 아이템 ${count}개도 삭제됨)` : ''}.`)) return
    setItems(selectedCatId.value, JSON.parse(JSON.stringify(groups.filter(g => g.subcategory !== name))))
  } else {
    const raw = getItems(selectedCatId.value) || []
    const count = raw.filter(i => i.subcategory === name).length
    if (!confirm(`"${name}" 서브카테고리를 삭제합니다${count > 0 ? ` (아이템 ${count}개의 분류가 해제됨)` : ''}.`)) return
    const cat = { ...selectedCat.value }
    cat.subcategories = (cat.subcategories ?? []).filter(s => s !== name)
    saveCategory(cat)
    const newRaw = JSON.parse(JSON.stringify(raw))
    newRaw.forEach(item => { if (item.subcategory === name) delete item.subcategory })
    setItems(selectedCatId.value, newRaw)
  }
}

// ── Item modal ────────────────────────────────────────
const showItemModal = ref(false)
const editingItem = ref(null)
const itemFormError = ref('')
const imageWarning = ref('')
const itemForm = ref({
  id: '', name: '', price: '', description: '', ingredientsRaw: '', tagsRaw: '', image: null,
  subcategory: '', glassPrice: '', bottlePrice: '',
})

function openAddItemModal() {
  editingItem.value = null
  itemForm.value = { id: '', name: '', price: '', description: '', ingredientsRaw: '', tagsRaw: '', image: null, subcategory: '', glassPrice: '', bottlePrice: '' }
  itemFormError.value = ''
  imageWarning.value = ''
  showItemModal.value = true
}

function openEditItemModal(displayItem) {
  editingItem.value = displayItem
  itemForm.value = {
    id: displayItem.id ?? '',
    name: displayItem.name ?? '',
    price: displayItem.price ?? '',
    description: displayItem.description ?? '',
    ingredientsRaw: (displayItem.ingredients ?? []).join('\n'),
    tagsRaw: (displayItem.tags ?? []).join(', '),
    image: displayItem.image ?? null,
    subcategory: displayItem._subcategory ?? '',
    glassPrice: displayItem.price ?? '',
    bottlePrice: displayItem.bottlePrice ?? '',
  }
  itemFormError.value = ''
  imageWarning.value = ''
  showItemModal.value = true
}

function closeItemModal() { showItemModal.value = false }

async function handleImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  imageWarning.value = ''
  const formData = new FormData()
  formData.append('image', file)
  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    itemForm.value.image = data.path
  } catch {
    imageWarning.value = '이미지 업로드에 실패했습니다.'
  }
  e.target.value = ''
}

function saveItemForm() {
  if (!itemForm.value.name.trim()) { itemFormError.value = 'Name is required.'; return }
  if (isWineCat.value) return saveWineItemForm()
  if (isSpiritCat.value) return saveSpiritItemForm()
  saveCocktailItemForm()
}

function saveWineItemForm() {
  if (!itemForm.value.subcategory.trim()) { itemFormError.value = 'Subcategory is required.'; return }

  const groups = JSON.parse(JSON.stringify(getItems(selectedCatId.value) || []))
  const newSubcat = itemForm.value.subcategory.trim()
  const newWine = { name: itemForm.value.name.trim() }
  if (itemForm.value.glassPrice.trim()) newWine.glassPrice = itemForm.value.glassPrice.trim()
  if (itemForm.value.bottlePrice.trim()) newWine.bottlePrice = itemForm.value.bottlePrice.trim()
  if (itemForm.value.image) newWine.image = itemForm.value.image
  if (itemForm.value.description.trim()) newWine.description = itemForm.value.description.trim()
  const wineIngs = itemForm.value.ingredientsRaw.split('\n').map(s => s.trim()).filter(Boolean)
  if (wineIngs.length) newWine.ingredients = wineIngs
  const wineTags = itemForm.value.tagsRaw.split(',').map(s => s.trim()).filter(Boolean)
  if (wineTags.length) newWine.tags = wineTags

  if (editingItem.value?._isWine) {
    const [origSubcat, origName] = editingItem.value.id.split('::')
    const origGroup = groups.find(g => g.subcategory === origSubcat)
    if (origGroup) {
      const wineIdx = origGroup.items.findIndex(w => w.name === origName)
      if (wineIdx !== -1) {
        if (origSubcat === newSubcat) {
          // 같은 subcategory: 제자리 업데이트 → 순서 유지, 사라지지 않음
          origGroup.items[wineIdx] = newWine
          setItems(selectedCatId.value, groups)
          closeItemModal()
          return
        }
        origGroup.items.splice(wineIdx, 1)
        if (origGroup.items.length === 0) groups.splice(groups.indexOf(origGroup), 1)
      }
    }
  }

  let targetGroup = groups.find(g => g.subcategory === newSubcat)
  if (!targetGroup) {
    targetGroup = { subcategory: newSubcat, items: [] }
    groups.push(targetGroup)
  }
  targetGroup.items.push(newWine)

  setItems(selectedCatId.value, groups)
  closeItemModal()
}

function saveSpiritItemForm() {
  const raw = JSON.parse(JSON.stringify(getItems(selectedCatId.value) || []))
  const payload = { name: itemForm.value.name.trim() }
  if (itemForm.value.subcategory.trim()) payload.subcategory = itemForm.value.subcategory.trim()
  if (itemForm.value.price.trim()) payload.price = itemForm.value.price.trim()
  if (itemForm.value.image) payload.image = itemForm.value.image
  if (itemForm.value.description.trim()) payload.description = itemForm.value.description.trim()
  const spiritIngs = itemForm.value.ingredientsRaw.split('\n').map(s => s.trim()).filter(Boolean)
  if (spiritIngs.length) payload.ingredients = spiritIngs
  const spiritTags = itemForm.value.tagsRaw.split(',').map(s => s.trim()).filter(Boolean)
  if (spiritTags.length) payload.tags = spiritTags

  if (editingItem.value) {
    const originalName = editingItem.value.name
    const idx = raw.findIndex(i => i.name === originalName)
    if (idx !== -1) raw[idx] = payload
    else raw.push(payload)
  } else {
    if (raw.some(i => i.name === payload.name)) {
      itemFormError.value = 'A spirit with this name already exists.'
      return
    }
    raw.push(payload)
  }
  setItems(selectedCatId.value, raw)
  closeItemModal()
}

function saveCocktailItemForm() {
  if (!itemForm.value.id.trim()) { itemFormError.value = 'ID is required.'; return }

  const payload = {
    id: itemForm.value.id.trim(),
    name: itemForm.value.name.trim(),
    subcategory: itemForm.value.subcategory.trim() || null,
    price: itemForm.value.price.trim() || null,
    description: itemForm.value.description.trim() || null,
    ingredients: itemForm.value.ingredientsRaw.split('\n').map(s => s.trim()).filter(Boolean),
    tags: itemForm.value.tagsRaw.split(',').map(s => s.trim()).filter(Boolean),
    image: itemForm.value.image || null,
  }

  if (!editingItem.value) {
    const existing = getItems(selectedCatId.value)
    if (existing.some(i => i.id === payload.id)) {
      itemFormError.value = 'An item with this ID already exists.'
      return
    }
  }

  saveItem(selectedCatId.value, payload)
  closeItemModal()
}

function confirmDeleteItem(displayItem) {
  if (!confirm('Delete this item?')) return

  if (isWineCat.value && displayItem._isWine) {
    const groups = JSON.parse(JSON.stringify(getItems(selectedCatId.value) || []))
    const [subcat, name] = displayItem.id.split('::')
    const group = groups.find(g => g.subcategory === subcat)
    if (group) {
      group.items = group.items.filter(w => w.name !== name)
      if (group.items.length === 0) groups.splice(groups.indexOf(group), 1)
    }
    setItems(selectedCatId.value, groups)
  } else if (isSpiritCat.value) {
    const raw = getItems(selectedCatId.value).filter(i => i.name !== displayItem.name)
    setItems(selectedCatId.value, raw)
  } else {
    deleteItem(selectedCatId.value, displayItem.id)
  }
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
.auth-input:focus { border-color: #C5A880; }
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
.auth-btn:hover { background: #C5A880; color: #141210; }

/* ── Admin layout ── */
.admin-page {
  min-height: calc(100vh - 4rem);
  background: #141210;
}
.admin-inner {
  max-width: 56rem;
  margin: 0 auto;
  padding: 3.5rem 2rem 5rem;
}

/* Header */
.admin-header { margin-bottom: 3rem; }
.admin-eyebrow {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #C5A880;
  margin-bottom: 0.5rem;
}
.admin-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 3rem;
  font-style: italic;
  font-weight: 300;
  color: #EAE6DF;
  margin-bottom: 0.75rem;
}
.admin-ornament {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.orn-line {
  display: block;
  width: 3rem;
  height: 1px;
  background: #C5A880;
  opacity: 0.35;
}
.orn-dot {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #C5A880;
  opacity: 0.55;
}
.admin-note {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.72rem;
  color: #C8C2B8;
  line-height: 1.6;
}
/* Sections */
.admin-section { margin-bottom: 3.5rem; }
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.section-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.6rem;
  font-style: italic;
  font-weight: 300;
  color: #C5A880;
}
.section-subtitle {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.3rem;
  font-style: italic;
  font-weight: 300;
  color: #C5A880;
}
.item-count {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.72rem;
  font-style: normal;
  color: #C8C2B8;
  margin-left: 0.4rem;
}
.btn-group { display: flex; gap: 0.5rem; }

.type-hint {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.65rem;
  color: #6B6460;
  letter-spacing: 0.05em;
  margin-bottom: 0.6rem;
}

/* Table */
.admin-table { border: 1px solid #2E2823; }
.table-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #2E2823;
}
.table-row:last-child { border-bottom: none; }
.row-main {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.75rem;
  min-width: 0;
}
.row-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1rem;
  color: #EAE6DF;
  font-style: italic;
}
.row-desc {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.68rem;
  color: #C8C2B8;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-price {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.7rem;
  color: #C5A880;
}

.subcat-badge {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.54rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 0.12rem 0.45rem;
  border: 1px solid #3A2020;
  color: #C58080;
  flex-shrink: 0;
}

/* ── Subcategory management ── */
.subcat-mgmt {
  margin-top: 1rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid #2E2823;
  background: rgba(255,255,255,0.015);
}
.subcat-mgmt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.subcat-mgmt-title {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8A7F74;
}
.subcat-tag-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.subcat-tag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 0.5rem;
  background: rgba(197,168,128,0.04);
  border: 1px solid #2E2823;
}
.subcat-tag-name {
  font-size: 0.82rem;
  color: #C5A880;
}

.row-actions {
  display: flex;
  gap: 0.35rem;
  flex-shrink: 0;
}

/* Thumbnail */
.item-thumb {
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  background: #1A1613;
  border: 1px solid #2E2823;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb-img { width: 100%; height: 100%; object-fit: cover; }
.thumb-placeholder {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1rem;
  font-style: italic;
  color: #2E2823;
  user-select: none;
}

/* Category selector */
.cat-selector { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.cat-tab {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 0.38rem 0.85rem;
  border: 1px solid #2E2823;
  color: #C8C2B8;
  background: transparent;
  cursor: pointer;
  transition: all 0.18s;
}
.cat-tab:hover { border-color: #C5A880; color: #C5A880; }
.cat-tab.active { background: #C5A880; color: #141210; border-color: #C5A880; }

/* Misc */
.empty-msg {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.75rem;
  color: #C8C2B8;
  padding: 1.5rem;
  text-align: center;
}

/* Buttons */
.btn-gold {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 0.42rem 0.9rem;
  border: 1px solid #C5A880;
  color: #C5A880;
  background: transparent;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
}
.btn-gold:hover { background: #C5A880; color: #141210; }

.btn-outline {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 0.42rem 0.9rem;
  border: 1px solid #2E2823;
  color: #C8C2B8;
  background: transparent;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
}
.btn-outline:hover { border-color: #C5A880; color: #C5A880; }

.btn-sm {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.54rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 0.28rem 0.65rem;
  border: 1px solid #2E2823;
  color: #C8C2B8;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-sm:hover { border-color: #C5A880; color: #C5A880; }
.btn-sm.btn-danger:hover { border-color: #7A3535; color: #7A3535; }

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0,0,0,0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow-y: auto;
}
.modal-box {
  width: 100%;
  max-width: 480px;
  background: #1A1613;
  border: 1px solid #2E2823;
  padding: 2rem 2rem 1.75rem;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-box--wide { max-width: 560px; }
.modal-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.7rem;
  font-style: italic;
  font-weight: 300;
  color: #EAE6DF;
  margin-bottom: 1.5rem;
}
.form-fields { display: flex; flex-direction: column; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.3rem; }
.field-label {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.58rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #C8C2B8;
}
.field-hint {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.62rem;
  color: #6B6460;
}
.admin-input {
  background: #141210;
  border: 1px solid #2E2823;
  color: #EAE6DF;
  padding: 0.5rem 0.75rem;
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.85rem;
  width: 100%;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
}
.admin-input:focus { border-color: #C5A880; }
.admin-input:disabled { opacity: 0.45; cursor: not-allowed; }
select.admin-input { cursor: pointer; }

/* Image upload */
.image-upload-area { display: flex; flex-direction: column; gap: 0.6rem; }
.image-preview {
  position: relative;
  width: 100%;
  max-height: 180px;
  overflow: hidden;
  background: #141210;
  border: 1px solid #2E2823;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-img { max-width: 100%; max-height: 180px; object-fit: contain; }
.remove-img-btn {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  width: 1.4rem;
  height: 1.4rem;
  background: rgba(20,18,16,0.85);
  border: 1px solid #2E2823;
  color: #C8C2B8;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.upload-btn {
  display: inline-block;
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 0.42rem 0.9rem;
  border: 1px solid #2E2823;
  color: #C8C2B8;
  background: transparent;
  cursor: pointer;
  transition: all 0.18s;
  align-self: flex-start;
}
.upload-btn:hover { border-color: #C5A880; color: #C5A880; }
.file-input { display: none; }
.image-warning {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.65rem;
  color: #B87A40;
}

.form-error {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.68rem;
  color: #B87A40;
  margin-top: 0.75rem;
}
.modal-actions { display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 1.5rem; }
.btn-save {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 0.5rem 1.4rem;
  border: 1px solid #C5A880;
  color: #141210;
  background: #C5A880;
  cursor: pointer;
  transition: all 0.18s;
}
.btn-save:hover { background: #D4B990; border-color: #D4B990; }

@media (max-width: 500px) {
  .admin-inner { padding: 2.5rem 1rem 3rem; }
  .table-row { flex-wrap: wrap; }
  .row-actions { width: 100%; justify-content: flex-end; }
  .modal-box { padding: 1.5rem 1.25rem; }
}
</style>
