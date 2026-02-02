import mongoose, { Schema, Document } from 'mongoose';

export interface IModule extends Document {
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    className: string; // e.g. "Class 10", "Class 12"
    isFeatured: boolean;
    purchasedBy: mongoose.Types.ObjectId[];
    instructor?: string;
    highlights?: string[];
}

const ModuleSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    price: { type: Number, required: true },
    className: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    purchasedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    instructor: { type: String, default: 'Expert Faculty' },
    highlights: [{ type: String }],
}, { timestamps: true });

export default mongoose.model<IModule>('Module', ModuleSchema);
