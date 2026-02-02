import mongoose, { Document, Schema } from 'mongoose';

export interface IAbout extends Document {
    instituteOverview: string;
    ceoProfile: string;
    ceoImage: string;
}

const AboutSchema: Schema = new Schema({
    instituteOverview: { type: String, required: true },
    ceoProfile: { type: String, required: true },
    ceoImage: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IAbout>('About', AboutSchema);
