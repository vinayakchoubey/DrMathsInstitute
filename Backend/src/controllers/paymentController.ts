import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User';
import Course from '../models/Course';
import Payment from '../models/Payment';
import Module from '../models/Module';

// Helper to get Razorpay instance
const getRazorpayInstance = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay keys not configured");
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

export const createOrder = async (req: any, res: Response) => {
    try {
        const { courseId, courseIds, moduleId, moduleIds } = req.body;
        const userId = req.user._id;

        const razorpay = getRazorpayInstance();

        let totalAmount = 0;
        const selectedCourseIds: string[] = [];
        const selectedModuleIds: string[] = [];

        // Handle Courses
        if (courseIds && Array.isArray(courseIds) && courseIds.length > 0) {
            const courses = await Course.find({ _id: { $in: courseIds } });
            courses.forEach(c => totalAmount += (c.price || 0));
            selectedCourseIds.push(...courses.map(c => c._id.toString()));
        } else if (courseId) {
            const course = await Course.findById(courseId);
            if (course) {
                totalAmount += (course.price || 0);
                selectedCourseIds.push(course._id.toString());
            }
        }

        // Handle Modules
        if (moduleIds && Array.isArray(moduleIds) && moduleIds.length > 0) {
            const modules = await Module.find({ _id: { $in: moduleIds } });
            modules.forEach(m => totalAmount += (m.price || 0));
            selectedModuleIds.push(...modules.map(m => m._id.toString()));
        } else if (moduleId) {
            const module = await Module.findById(moduleId);
            if (module) {
                totalAmount += (module.price || 0);
                selectedModuleIds.push(module._id.toString());
            }
        }

        if (totalAmount === 0) {
            return res.status(404).json({ message: 'No valid items found' });
        }

        // Add Tax (18%)
        const amountWithTax = Math.round(totalAmount * 1.18);

        const options = {
            amount: amountWithTax * 100, // amount in smallest currency unit
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Save Payment Intent
        await Payment.create({
            user: userId,
            courses: selectedCourseIds,
            modules: selectedModuleIds,
            amount: amountWithTax,
            currency: "INR",
            status: 'created',
            razorpayOrderId: order.id
        } as any);

        const user = await User.findById(userId);

        res.json({
            ...order,
            key_id: process.env.RAZORPAY_KEY_ID,
            user_name: user?.name,
            user_email: user?.email,
            user_contact: user?.mobile,
            orderId: order.id
        });

    } catch (error: any) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: error.message });
    }
};

export const verifyPayment = async (req: any, res: Response) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const userId = req.user._id;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment Success
            const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
            if (payment) {
                payment.status = 'completed';
                payment.razorpayPaymentId = razorpay_payment_id;
                payment.razorpaySignature = razorpay_signature;
                await payment.save();

                const user = await User.findById(userId);
                if (user) {
                    // Update Courses
                    if (payment.courses && payment.courses.length > 0) {
                        for (const cId of payment.courses) {
                            if (!user.purchasedCourses.includes(cId as any)) {
                                user.purchasedCourses.push(cId as any);
                            }
                            await Course.findByIdAndUpdate(cId, { $addToSet: { purchasedBy: userId } });
                        }
                    }
                    // Update Modules
                    if (payment.modules && payment.modules.length > 0) {
                        for (const mId of payment.modules) {
                            if (!user.purchasedModules.includes(mId as any)) {
                                user.purchasedModules.push(mId as any);
                            }
                            await Module.findByIdAndUpdate(mId, { $addToSet: { purchasedBy: userId } });
                        }
                    }
                    await user.save();
                }
            }

            return res.json({ message: 'Payment verified', success: true });
        } else {
            const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
            if (payment) {
                payment.status = 'failed';
                await payment.save();
            }
            return res.status(400).json({ message: 'Invalid Signature', success: false });
        }

    } catch (error: any) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllPayments = async (req: Request, res: Response) => {
    try {
        const payments = await Payment.find()
            .populate('user', 'name email')
            .populate('courses', 'title')
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
