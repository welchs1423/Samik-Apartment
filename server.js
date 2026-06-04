import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const imagesDir = path.join(__dirname, 'public', 'images')
const dataDir = path.join(__dirname, 'src', 'data')

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })

app.use(express.json())

const storage = multer.diskStorage({
  destination: imagesDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}${ext}`)
  },
})

const upload = multer({ storage })

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' })
  res.json({ path: `/images/${req.file.filename}` })
})

app.get('/api/data/categories', (req, res) => {
  const data = fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf8')
  res.json(JSON.parse(data))
})

app.post('/api/data/categories', (req, res) => {
  const categories = req.body
  if (!Array.isArray(categories)) return res.status(400).json({ error: 'Invalid data' })
  fs.writeFileSync(path.join(dataDir, 'categories.json'), JSON.stringify(categories, null, 2))
  res.json({ ok: true })
})

app.get('/api/data/items', (req, res) => {
  const data = fs.readFileSync(path.join(dataDir, 'items.json'), 'utf8')
  res.json(JSON.parse(data))
})

app.post('/api/data/items', (req, res) => {
  const items = req.body
  if (typeof items !== 'object' || Array.isArray(items)) return res.status(400).json({ error: 'Invalid data' })
  fs.writeFileSync(path.join(dataDir, 'items.json'), JSON.stringify(items, null, 2))
  res.json({ ok: true })
})

app.get('/api/data/ingredients', (req, res) => {
  const filePath = path.join(dataDir, 'ingredients.json')
  if (!fs.existsSync(filePath)) return res.json([])
  res.json(JSON.parse(fs.readFileSync(filePath, 'utf8')))
})

app.post('/api/data/ingredients', (req, res) => {
  const ingredients = req.body
  if (!Array.isArray(ingredients)) return res.status(400).json({ error: 'Invalid data' })
  fs.writeFileSync(path.join(dataDir, 'ingredients.json'), JSON.stringify(ingredients, null, 2))
  res.json({ ok: true })
})

app.listen(3001, () => console.log('Dev server: http://localhost:3001'))
