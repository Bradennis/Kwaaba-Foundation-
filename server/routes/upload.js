import express from 'express';
import multer from 'multer';
import cloudinary from '../cloudinary.js';
import path from 'path';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext || mime);
  }
});

async function uploadToCloudinary(buffer, folder = 'kwaaba') {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Cloudinary upload timed out after 15s'));
    }, 15000);
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        clearTimeout(timer);
        if (error) {
          console.error('Cloudinary upload error:', error?.message, error?.code);
          reject(new Error(`Cloudinary upload failed: ${error?.message || error}`));
        } else {
          resolve(result);
        }
      }
    );
    stream.write(buffer);
    stream.end();
  });
}

// POST /api/upload - Upload a single image to Cloudinary
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const folder = req.body.folder || 'kwaaba';
    const result = await uploadToCloudinary(req.file.buffer, folder);

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      path: result.path,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload image to Cloudinary' });
  }
});

// POST /api/upload/batch - Upload multiple images
router.post('/batch', upload.array('images', 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const folder = req.body.folder || 'kwaaba';
    const results = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, folder);
      results.push({
        url: result.secure_url,
        publicId: result.public_id,
        path: result.path,
        width: result.width,
        height: result.height,
        format: result.format,
      });
    }

    res.json({ success: true, count: results.length, images: results });
  } catch (error) {
    console.error('Batch upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload images to Cloudinary' });
  }
});

export default router;
export { upload, uploadToCloudinary };