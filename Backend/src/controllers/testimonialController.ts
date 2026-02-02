import { Request, Response } from 'express';
import Testimonial from '../models/Testimonial';

// Get all testimonials
export const getTestimonials = async (req: Request, res: Response) => {
    try {
        const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching testimonials', error });
    }
};

// Add a new testimonial
export const addTestimonial = async (req: Request, res: Response) => {
    try {
        const { name, role, content, image } = req.body;
        const testimonial = new Testimonial({
            name,
            role,
            content,
            image,
        });
        const createdTestimonial = await testimonial.save();
        res.status(201).json(createdTestimonial);
    } catch (error) {
        res.status(400).json({ message: 'Error adding testimonial', error });
    }
};

// Update a testimonial
export const updateTestimonial = async (req: Request, res: Response) => {
    try {
        const { name, role, content, image } = req.body;
        const testimonial = await Testimonial.findById(req.params.id);

        if (testimonial) {
            testimonial.name = name || testimonial.name;
            testimonial.role = role || testimonial.role;
            testimonial.content = content || testimonial.content;
            testimonial.image = image || testimonial.image;

            const updatedTestimonial = await testimonial.save();
            res.json(updatedTestimonial);
        } else {
            res.status(404).json({ message: 'Testimonial not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating testimonial', error });
    }
};

// Delete a testimonial
export const deleteTestimonial = async (req: Request, res: Response) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);

        if (testimonial) {
            await testimonial.deleteOne();
            res.json({ message: 'Testimonial removed' });
        } else {
            res.status(404).json({ message: 'Testimonial not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting testimonial', error });
    }
};
