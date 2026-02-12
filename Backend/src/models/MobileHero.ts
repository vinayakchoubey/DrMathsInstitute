import mongoose, { Document, Schema } from 'mongoose';

export interface IMobileHero extends Document {
    imageUrl: string;
    redirectLink?: string;
    isActive: boolean;
    order: number;
    createdAt: Date;
}

const MobileHeroSchema: Schema = new Schema({
    imageUrl: { type: String, required: true },
    redirectLink: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IMobileHero>('MobileHero', MobileHeroSchema);
