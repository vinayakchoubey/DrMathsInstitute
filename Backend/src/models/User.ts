import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    role: 'admin' | 'client';
    purchasedCourses: mongoose.Types.ObjectId[];
    purchasedModules: mongoose.Types.ObjectId[];
    profileImage?: string;
    mobile?: string;
    city?: string;
    academicClass?: string;
    board?: string;
    exams?: string;
    language?: string;
    aadharNumber?: string;
    isVerified: boolean;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    role: { type: String, enum: ['admin', 'client'], default: 'client' },
    purchasedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    purchasedModules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
    profileImage: { type: String },
    mobile: { type: String },
    city: { type: String },
    academicClass: { type: String },
    board: { type: String },
    exams: { type: String },
    language: { type: String },
    isVerified: { type: Boolean, default: false },
    aadharNumber: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
