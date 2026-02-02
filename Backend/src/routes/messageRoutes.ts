import express from 'express';
import { sendMessage, getAllMessages, replyToMessage, getUserMessages, deleteMessage } from '../controllers/messageController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', sendMessage);
router.get('/', protect, admin, getAllMessages);
router.put('/:id/reply', protect, admin, replyToMessage);
router.get('/my-messages', protect, getUserMessages);
router.delete('/:id', protect, deleteMessage);

export default router;
