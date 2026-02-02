import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    user: mongoose.Types.ObjectId;
    courses: mongoose.Types.ObjectId[];
    modules: mongoose.Types.ObjectId[];
    amount: number;
    currency: string;
    status: 'created' | 'completed' | 'failed';
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'INR' },
    status: { type: String, enum: ['created', 'completed', 'failed'], default: 'created' },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
}, { timestamps: true });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
