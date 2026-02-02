import { Request, Response } from 'express';
import PromotionalVideo from '../models/PromotionalVideo';

// Get the promotional video (create default if not exists)
export const getPromotionalVideo = async (req: Request, res: Response) => {
    try {
        let video = await PromotionalVideo.findOne();
        if (!video) {
            video = await PromotionalVideo.create({
                title: "Empowering Students Worldwide",
                description: "Discover how Dr. Maths Institute helps students achieve top ranks with our unique learning approach.",
                videoUrl: "https://www.youtube.com/watch?v=Get7rqXYrbQ",
                isActive: true
            });
        } else if (video.videoUrl.includes("your-video-id")) {
            // Auto-fix existing invalid default
            video.videoUrl = "https://www.youtube.com/watch?v=Get7rqXYrbQ";
            video = await video.save();
        }
        res.json(video);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Update the promotional video
export const updatePromotionalVideo = async (req: Request, res: Response) => {
    try {
        let video = await PromotionalVideo.findOne();
        if (video) {
            Object.assign(video, req.body);
            const updatedVideo = await video.save();
            res.json(updatedVideo);
        } else {
            const newVideo = await PromotionalVideo.create(req.body);
            res.json(newVideo);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
