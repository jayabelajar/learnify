import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', protect, upload.single('file'), (req, res) => {
  const file = (req as any).file;
  if (!file) {
    res.status(400);
    throw new Error('File is required');
  }
  res.status(201).json({
    filename: file.filename,
    url: `/uploads/${file.filename}`,
    originalName: file.originalname,
    size: file.size
  });
});

export default router;
