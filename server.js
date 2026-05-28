import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const imagesDir = path.join(__dirname, 'public', 'images')

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })

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

app.listen(3001, () => console.log('Upload server: http://localhost:3001'))
