import { Request, Response } from 'express';
import Module from '../models/Module';

export const getModules = async (req: Request, res: Response) => {
    try {
        const modules = await Module.find();
        res.json(modules);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getModuleById = async (req: Request, res: Response) => {
    try {
        const module = await Module.findById(req.params.id);
        if (module) {
            res.json(module);
        } else {
            res.status(404).json({ message: 'Module not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createModule = async (req: Request, res: Response) => {
    try {
        const newModule = new Module(req.body);
        const createdModule = await newModule.save();
        res.status(201).json(createdModule);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateModule = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedModule = await Module.findByIdAndUpdate(id, req.body, { new: true });
        if (updatedModule) {
            res.json(updatedModule);
        } else {
            res.status(404).json({ message: 'Module not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteModule = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedModule = await Module.findByIdAndDelete(id);
        if (deletedModule) {
            res.json({ message: 'Module removed' });
        } else {
            res.status(404).json({ message: 'Module not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
