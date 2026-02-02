import { Request, Response } from 'express';
import Course from '../models/Course';

export const getCourses = async (req: Request, res: Response) => {
    try {
        let query: any = { isAvailable: true };

        if (req.query.keyword) {
            query.title = {
                $regex: req.query.keyword,
                $options: 'i',
            };
        }

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.featured) {
            query.isFeatured = req.query.featured === 'true';
        }

        const courses = await Course.find(query);
        res.json(courses);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseBuyers = async (req: Request, res: Response) => {
    try {
        const course = await Course.findById(req.params.id).populate('purchasedBy', 'name email mobile');
        if (course) {
            res.json(course.purchasedBy);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseById = async (req: Request, res: Response) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createCourse = async (req: Request, res: Response) => {
    // Assume generic admin check is done in middleware
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            Object.assign(course, req.body);
            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            await course.deleteOne();
            res.json({ message: 'Course removed' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
