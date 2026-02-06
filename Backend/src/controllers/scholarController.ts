import { Request, Response } from 'express';
import Scholar from '../models/Scholar';

// Get all scholars
export const getScholars = async (req: Request, res: Response) => {
    try {
        const scholars = await Scholar.find({});
        return res.json(scholars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching scholars', error });
    }
};

// Add a new scholar
export const addScholar = async (req: Request, res: Response) => {
    try {
        const { name, image, description } = req.body;
        const scholar = new Scholar({
            name,
            image,
            description,
        });
        const createdScholar = await scholar.save();
        res.status(201).json(createdScholar);
    } catch (error) {
        res.status(400).json({ message: 'Error adding scholar', error });
    }
};

// Update a scholar
export const updateScholar = async (req: Request, res: Response) => {
    try {
        const { name, image, description } = req.body;
        const scholar = await Scholar.findById(req.params.id);

        if (scholar) {
            scholar.name = name || scholar.name;
            scholar.image = image || scholar.image;
            scholar.description = description || scholar.description;

            const updatedScholar = await scholar.save();
            res.json(updatedScholar);
        } else {
            res.status(404).json({ message: 'Scholar not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating scholar', error });
    }
};

// Delete a scholar
export const deleteScholar = async (req: Request, res: Response) => {
    try {
        const scholar = await Scholar.findById(req.params.id);

        if (scholar) {
            await scholar.deleteOne();
            res.json({ message: 'Scholar removed' });
        } else {
            res.status(404).json({ message: 'Scholar not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting scholar', error });
    }
};
