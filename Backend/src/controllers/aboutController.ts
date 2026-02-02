import { Request, Response } from 'express';
import About from '../models/About';

export const getAbout = async (req: Request, res: Response) => {
    try {
        const about = await About.findOne();
        res.json(about || {});
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAbout = async (req: Request, res: Response) => {
    try {
        let about = await About.findOne();
        if (about) {
            Object.assign(about, req.body);
            const updatedAbout = await about.save();
            res.json(updatedAbout);
        } else {
            const newAbout = await About.create(req.body);
            res.json(newAbout);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAbout = async (req: Request, res: Response) => {
    try {
        await About.deleteOne({});
        res.json({ message: 'About section deleted' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// -- Members Sub-Section Logic --
import Member from '../models/Member';

// Get all members
export const getMembers = async (req: Request, res: Response) => {
    try {
        const members = await Member.find().sort({ createdAt: 1 });
        res.json(members);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new member
export const createMember = async (req: Request, res: Response) => {
    try {
        const newMember = await Member.create(req.body);
        res.status(201).json(newMember);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Update a member
export const updateMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const member = await Member.findById(id);

        if (member) {
            Object.assign(member, req.body);
            const updatedMember = await member.save();
            res.json(updatedMember);
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a member
export const deleteMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const member = await Member.findById(id);

        if (member) {
            await member.deleteOne();
            res.json({ message: 'Member removed' });
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
