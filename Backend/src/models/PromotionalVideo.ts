import mongoose, { Schema, Document } from 'mongoose';

export interface IPromotionalVideo extends Document {
    title: string;
    description: string;
    videoUrl: string; // YouTube URL
    isActive: boolean;
}

const PromotionalVideoSchema: Schema = new Schema({
    title: { type: String, required: true, default: "Why Join Us?" },
    description: { type: String, required: true, default: "Watch this video to learn more about our methodology." },
    videoUrl: { type: String, required: true, default: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IPromotionalVideo>('PromotionalVideo', PromotionalVideoSchema);
