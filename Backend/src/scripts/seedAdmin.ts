import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';

dotenv.config();

const seedAdmin = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/drmaths');
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const adminExists = await User.findOne({ email: 'admin@drmaths.com' });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@drmaths.com',
            password: hashedPassword,
            role: 'admin',
        });

        console.log('Admin user created successfully');
        console.log('Email: admin@drmaths.com');
        console.log('Password: admin123');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
