import { Request, Response } from 'express';
import MobileHero from '../models/MobileHero';

// Get all active hero images (Public)
export const getProHeroImages = async (req: Request, res: Response) => {
    try {
        // For public, only show active ones, sorted by order
        const images = await MobileHero.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.json(images);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get all images (Admin - includes inactive)
export const getAdminHeroImages = async (req: Request, res: Response) => {
    try {
        const images = await MobileHero.find({}).sort({ order: 1, createdAt: -1 });
        res.json(images);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Add new hero image (Admin)
export const addHeroImage = async (req: Request, res: Response) => {
    const { imageUrl, redirectLink, order } = req.body;
    try {
        const newHero = await MobileHero.create({
            imageUrl,
            redirectLink,
            order: order || 0
        });
        res.status(201).json(newHero);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Delete hero image (Admin)
export const deleteHeroImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await MobileHero.findByIdAndDelete(id);
        res.json({ message: 'Image deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Update hero image (Admin - toggle active, change order, etc)
export const updateHeroImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedHero = await MobileHero.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedHero);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
