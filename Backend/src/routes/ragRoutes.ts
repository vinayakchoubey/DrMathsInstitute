import express from 'express';
import multer from 'multer';
import { uploadDocument, chatWithBot, getDocuments } from '../controllers/ragController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage

// Admin Routes for Documents
router.post('/upload', protect, admin, upload.single('file'), uploadDocument);
router.get('/documents', protect, admin, getDocuments);

// Public Chat Route
router.post('/chat', chatWithBot);

export default router;
