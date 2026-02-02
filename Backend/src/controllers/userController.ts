import { Request, Response } from 'express';
import User from '../models/User';

// Get all users with optional filtering
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { verified, search } = req.query;

        let query: any = {};

        // Filter by verification status if provided
        if (verified !== undefined) {
            query.isVerified = verified === 'true';
        }

        // Search by name or email
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Exclude password and googleId for security
        console.log("Query:", query);
        const users = await User.find(query).select('-password -googleId').sort({ createdAt: -1 });
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle user verification status
export const toggleUserVerification = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isVerified = !user.isVerified;
        await user.save();

        res.json({
            message: `User ${user.isVerified ? 'verified' : 'unverified'} successfully`,
            user: { _id: user._id, isVerified: user.isVerified }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
