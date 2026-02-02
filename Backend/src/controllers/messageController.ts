import { Request, Response } from 'express';
import Message from '../models/Message';
import Notification from '../models/Notification';

// Send a message (User/Guest)
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { name, email, contactNumber, message, userId } = req.body;

        const newMessage = await Message.create({
            user: userId || null,
            name,
            email,
            contactNumber,
            message
        });

        // Notify Admin
        await Notification.create({
            recipient: 'admin',
            message: `New message from ${name}`,
            link: '/admin/messages',
            type: 'message'
        });

        res.status(201).json(newMessage);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get all messages (Admin)
export const getAllMessages = async (req: Request, res: Response) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Reply to a message (Admin)
export const replyToMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;

        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        message.reply = reply;
        message.status = 'replied';
        message.isRead = false;
        await message.save();

        // Notify User if registered
        if (message.user) {
            await Notification.create({
                recipient: String(message.user),
                message: `Reply from Admin: ${reply.substring(0, 30)}...`,
                link: '/profile', // Or wherever messages are shown for user
                type: 'reply'
            });
        }

        res.json(message);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get user messages (User)
export const getUserMessages = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user = req.user as any;
        const userId = user._id;
        const userEmail = user.email;

        const messages = await Message.find({
            $or: [
                { user: userId },
                { email: userEmail }
            ]
        }).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
// Delete a message (Admin or Owner)
export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const user = req.user as any;
        const message = await Message.findById(id);

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Check permission
        const isAdmin = user.role === 'admin';
        const isOwner = (message.user && String(message.user) === String(user._id)) || (message.email === user.email);

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: "Not authorized to delete this message" });
        }

        await message.deleteOne();
        res.json({ message: "Message deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
