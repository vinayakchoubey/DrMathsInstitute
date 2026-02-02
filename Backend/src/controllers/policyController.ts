import { Request, Response } from 'express';
import Policy from '../models/Policy';

// Get all policies
export const getPolicies = async (req: Request, res: Response) => {
    try {
        const policies = await Policy.find({});
        res.json(policies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching policies', error });
    }
};

// Add a new policy
export const addPolicy = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;
        const policy = new Policy({
            title,
            content,
        });
        const createdPolicy = await policy.save();
        res.status(201).json(createdPolicy);
    } catch (error) {
        res.status(400).json({ message: 'Error adding policy', error });
    }
};

// Update a policy
export const updatePolicy = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;
        const policy = await Policy.findById(req.params.id);

        if (policy) {
            policy.title = title || policy.title;
            policy.content = content || policy.content;

            const updatedPolicy = await policy.save();
            res.json(updatedPolicy);
        } else {
            res.status(404).json({ message: 'Policy not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating policy', error });
    }
};

// Delete a policy
export const deletePolicy = async (req: Request, res: Response) => {
    try {
        const policy = await Policy.findById(req.params.id);

        if (policy) {
            await policy.deleteOne();
            res.json({ message: 'Policy removed' });
        } else {
            res.status(404).json({ message: 'Policy not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting policy', error });
    }
};
