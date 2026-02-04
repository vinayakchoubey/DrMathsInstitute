import express from 'express';
import multer from 'multer';
import { getStorage } from '../config/cloudinary';

const router = express.Router();

// Lazy initialization of multer with cloudinary storage

router.post('/', (req, res) => {
    const upload = multer({ storage: getStorage() });
    upload.single('file')(req, res, (err: any) => {
        if (err) {
            console.error('Upload Error:', err);
            return res.status(500).json({
                message: 'File upload failed',
                error: err.message || err.toString(),
                stack: err.stack
            });
        }
        if (req.file) {
            res.json({ url: req.file.path });
        } else {
            res.status(400).json({ message: 'No file uploaded' });
        }
    });
});

export default router;
