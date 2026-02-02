import mongoose, { Document, Schema } from 'mongoose';

interface ICourseContent {
    title: string;
    type: 'pdf' | 'video';
    url: string;
}

export interface ICourse extends Document {
    title: string;
    description: string;
    thumbnail: string;
    teacherName: string;
    teacherBio: string;
    instructors: {
        name: string;
        bio: string;
        image: string;
    }[];
    teacherImage: string;
    price: number;
    originalPrice: number;
    category: string;
    language: string;
    examTarget: string;
    startDate: Date;
    content: ICourseContent[];
    isAvailable: boolean;
    purchasedBy: mongoose.Types.ObjectId[];
    createdAt: Date;
    zoomMeetingId?: string;
    zoomPassword?: string;
    isFeatured?: boolean;
    type: 'online' | 'offline' | 'hybrid';
    highlights: string[];
    schedule: {
        day: string;
        slots: {
            time: string;
            subject: string;
            instructor: string;
        }[];
    }[];
}

const CourseSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    teacherName: { type: String, required: true },
    teacherBio: { type: String },
    teacherImage: { type: String },
    instructors: [{
        name: { type: String, required: true },
        bio: { type: String },
        image: { type: String }
    }],
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String },
    language: { type: String },
    examTarget: { type: String },
    startDate: { type: Date },
    content: [
        {
            title: { type: String, required: true },
            type: { type: String, enum: ['pdf', 'video'], required: true },
            url: { type: String, required: true },
        }
    ],
    isAvailable: { type: Boolean, default: true },
    purchasedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    zoomMeetingId: { type: String },
    zoomPassword: { type: String },
    isFeatured: { type: Boolean, default: false },
    type: { type: String, enum: ['online', 'offline', 'hybrid'], default: 'online' },
    highlights: [{ type: String }],
    schedule: [{
        day: { type: String, required: true },
        slots: [{
            time: { type: String, required: true },
            subject: { type: String, required: true },
            instructor: { type: String, required: true }
        }]
    }],
}, { timestamps: true });

export default mongoose.model<ICourse>('Course', CourseSchema);
