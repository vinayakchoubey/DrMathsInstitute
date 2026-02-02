
import mongoose, { Schema, Document } from 'mongoose';

export interface IMember extends Document {
    name: string;
    role: string;
    bio: string;
    image: string;
}

const MemberSchema: Schema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String, default: "" }, // Optional image
}, { timestamps: true });

export default mongoose.model<IMember>('Member', MemberSchema);
