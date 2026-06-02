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

app.post('/api/data/categories', (req, res) => {
  const categories = req.body
  if (!Array.isArray(categories)) return res.status(400).json({ error: 'Invalid data' })
  fs.writeFileSync(path.join(dataDir, 'categories.json'), JSON.stringify(categories, null, 2))
  res.json({ ok: true })
})

app.post('/api/data/items/:catId', (req, res) => {
  const { catId } = req.params
  if (!/^[a-z0-9-]+$/.test(catId)) return res.status(400).json({ error: 'Invalid catId' })
  const items = req.body
  if (!Array.isArray(items)) return res.status(400).json({ error: 'Invalid data' })
  const itemsDir = path.join(dataDir, 'items')
  if (!fs.existsSync(itemsDir)) fs.mkdirSync(itemsDir, { recursive: true })
  fs.writeFileSync(path.join(itemsDir, `${catId}.json`), JSON.stringify(items, null, 2))
  res.json({ ok: true })
})

app.delete('/api/data/items/:catId', (req, res) => {
  const { catId } = req.params
  if (!/^[a-z0-9-]+$/.test(catId)) return res.status(400).json({ error: 'Invalid catId' })
  const filePath = path.join(dataDir, 'items', `${catId}.json`)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  res.json({ ok: true })
})

app.listen(3001, () => console.log('Dev server: http://localhost:3001'))
