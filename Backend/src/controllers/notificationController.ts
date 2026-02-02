import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user = req.user;
        let query = {};

        if (user.role === 'admin') {
            // Admin sees notifications addressed to 'admin' OR their own ID
            query = { recipient: { $in: ['admin', user._id] } };
        } else {
            query = { recipient: user._id };
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);
        res.json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { isRead: true });
        res.json({ message: 'Marked as read' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user = req.user;
        let query = {};

        if (user.role === 'admin') {
            query = { recipient: { $in: ['admin', user._id] }, isRead: false };
        } else {
            query = { recipient: user._id, isRead: false };
        }

        await Notification.updateMany(query, { isRead: true });
        res.json({ message: 'All marked as read' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
