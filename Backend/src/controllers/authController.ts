import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User, { IUser } from '../models/User';
import Otp from '../models/Otp';
import { sendEmail } from '../services/emailService';

const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- SIGNUP FLOW ---
export const initiateSignup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    console.log("Initiate Signup Request:", { email, name }); // Log the request
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Invalidate any previous OTPs immediately
        await Otp.deleteMany({ email });

        const otp = generateOTP();
        console.log("Generated OTP:", otp, "for", email); // Log the OTP

        await Otp.create({ email, otp });

        const subject = "Verify your email - Dr Maths Institute";
        const html = `<h1>Email Verification</h1><p>Your OTP is: <b>${otp}</b></p><p>This code is valid for 1 minute.</p>`;

        console.log("Attempting to send email to:", email);
        const emailSent = await sendEmail(email, subject, html);
        console.log("Email send result:", emailSent);

        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send OTP email. Please check the email address.' });
        }

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error: any) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const finalizeSignup = async (req: Request, res: Response) => {
    const { name, email, password, otp } = req.body;
    try {
        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) return res.status(400).json({ message: 'Invalid OTP' });

        // Strict 1-minute check (60000ms)
        const now = new Date().getTime();
        const otpTime = new Date(validOtp.createdAt).getTime();
        if (now - otpTime > 60000) {
            await Otp.deleteOne({ _id: validOtp._id }); // Cleanup
            return res.status(400).json({ message: 'OTP has expired' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const role = email === 'vinayakchoubey123@gmail.com' ? 'admin' : 'client';

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await Otp.deleteOne({ _id: validOtp._id });

        // Welcome Email
        await sendEmail(email, "Welcome to Dr Maths Institute", `<h1>Welcome ${name}!</h1><p>You have successfully registered.</p>`);

        res.status(201).json({
            _id: (user as any)._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken((user as any)._id, user.role),
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// --- LOGIN FLOW ---
export const initiateLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("Initiate Login Request:", email);
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        if (!user.password && user.googleId) return res.status(400).json({ message: 'Please login with Google' });

        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        // Invalidate any previous OTPs
        await Otp.deleteMany({ email });

        const otp = generateOTP();
        console.log("Generated Login OTP:", otp);

        await Otp.create({ email, otp });

        const subject = "Login OTP - Dr Maths Institute";
        const html = `<h1>Login Verification</h1><p>Your OTP is: <b>${otp}</b></p>`;

        const emailSent = await sendEmail(email, subject, html);
        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send OTP email.' });
        }

        res.status(200).json({ message: 'OTP sent for login' });
    } catch (error: any) {
        console.error("Login Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const finalizeLogin = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    try {
        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) return res.status(400).json({ message: 'Invalid OTP' });

        // Strict 1-minute check
        const now = new Date().getTime();
        const otpTime = new Date(validOtp.createdAt).getTime();
        if (now - otpTime > 60000) {
            await Otp.deleteOne({ _id: validOtp._id });
            return res.status(400).json({ message: 'OTP has expired' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        await Otp.deleteOne({ _id: validOtp._id });

        res.json({
            _id: (user as any)._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            mobile: user.mobile,
            city: user.city,
            academicClass: user.academicClass,
            board: user.board,
            exams: user.exams,
            language: user.language,
            aadharNumber: user.aadharNumber,
            token: generateToken((user as any)._id, user.role),
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const resendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const otp = generateOTP();
        console.log("Resending OTP:", otp, "for", email);

        // Remove old OTPs
        await Otp.deleteMany({ email });

        await Otp.create({ email, otp });

        const subject = "Resend OTP - Dr Maths Institute";
        const html = `<h1>OTP Verification</h1><p>Your new OTP is: <b>${otp}</b></p><p>This code is valid for 1 minute.</p>`;

        await sendEmail(email, subject, html);

        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const googleLogin = async (req: Request, res: Response) => {
    const fs = require('fs');
    fs.appendFileSync('backend_debug.log', `[${new Date().toISOString()}] Entered googleLogin\n`);
    const { token } = req.body;

    try {
        fs.appendFileSync('backend_debug.log', `Received Token: ${token?.substring(0, 20)}...\n`);
        console.log("Verifying Google Token...");
        console.log("Expected Audience:", process.env.GOOGLE_CLIENT_ID);
        console.log("Received Token (first 20 chars):", token?.substring(0, 20));

        const ticket = await client.verifyIdToken({
            idToken: token,
            // audience: process.env.GOOGLE_CLIENT_ID, // Relaxed check
        });
        const payload = ticket.getPayload();
        console.log("Verification Payload:", payload);
        fs.appendFileSync('backend_debug.log', `Payload: ${JSON.stringify(payload)}\n`);

        if (payload) {
            const { email, name, picture, sub: googleId } = payload;

            let user = await User.findOne({ email });

            if (user) {
                // User exists, update googleId if missing
                if (!user.googleId) {
                    user.googleId = googleId;
                    await user.save();
                }

                res.json({
                    _id: (user as any)._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profileImage: user.profileImage || picture,
                    mobile: user.mobile,
                    city: user.city,
                    academicClass: user.academicClass,
                    board: user.board,
                    exams: user.exams,
                    language: user.language,
                    aadharNumber: user.aadharNumber,
                    token: generateToken((user as any)._id, user.role),
                });
            } else {
                // Create new user
                const role = email === 'vinayakchoubey123@gmail.com' ? 'admin' : 'client';

                const newUser = await User.create({
                    name,
                    email,
                    googleId,
                    profileImage: picture,
                    role, // Default role based on email check
                    // No password for google users
                });

                // Send Welcome Email
                const subject = "Welcome to Dr Maths Institute";
                const html = `
                    <h1>Welcome, ${name}!</h1>
                    <p>You have successfully signed up using Google.</p>
                    <p>Explore our courses and start learning today!</p>
                `;
                await sendEmail(email!, subject, html);

                res.status(201).json({
                    _id: (newUser as any)._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    profileImage: newUser.profileImage,
                    token: generateToken((newUser as any)._id, newUser.role),
                });
            }
        } else {
            res.status(400).json({ message: 'Invalid Google Token' });
        }
    } catch (error: any) {
        console.error("CRITICAL: Google Login Error Caught:", error);
        res.status(400).json({
            message: "Google Verification Failed",
            details: error.message || "Unknown error",
            stack: error.stack
        });
    }
};

// --- FORGOT PASSWORD FLOW ---
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    console.log("Forgot Password Request:", email);
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No account found with this email' });

        // Google-only users cannot reset password
        if (!user.password && user.googleId) {
            return res.status(400).json({ message: 'This account uses Google login. Please sign in with Google.' });
        }

        // Invalidate any previous OTPs
        await Otp.deleteMany({ email });

        const otp = generateOTP();
        console.log("Generated Password Reset OTP:", otp, "for", email);

        await Otp.create({ email, otp });

        const subject = "Password Reset OTP - Dr Maths Institute";
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #1a1a2e; color: #ffffff; border-radius: 12px;">
                <h1 style="color: #818cf8; margin-bottom: 16px;">Password Reset</h1>
                <p>You requested a password reset. Use the OTP below to reset your password:</p>
                <div style="background: #16213e; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #818cf8;">${otp}</span>
                </div>
                <p style="color: #9ca3af; font-size: 14px;">This code is valid for <b>1 minute</b>. If you did not request this, ignore this email.</p>
            </div>
        `;

        const emailSent = await sendEmail(email, subject, html);
        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
        }

        res.status(200).json({ message: 'Password reset OTP sent to your email' });
    } catch (error: any) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    console.log("Reset Password Request for:", email);
    try {
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) return res.status(400).json({ message: 'Invalid OTP' });

        // Strict 1-minute check
        const now = new Date().getTime();
        const otpTime = new Date(validOtp.createdAt).getTime();
        if (now - otpTime > 60000) {
            await Otp.deleteOne({ _id: validOtp._id });
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Hash the new password and save
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        // Cleanup OTP
        await Otp.deleteOne({ _id: validOtp._id });

        // Send confirmation email
        await sendEmail(email, "Password Changed - Dr Maths Institute",
            `<h1>Password Updated</h1><p>Your password was successfully changed. If you did not do this, contact support immediately.</p>`
        );

        console.log("Password reset successful for:", email);
        res.status(200).json({ message: 'Password reset successful! You can now login with your new password.' });
    } catch (error: any) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById((req as any).user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById((req as any).user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.mobile = req.body.mobile || user.mobile;
            user.city = req.body.city || user.city;
            user.profileImage = req.body.profileImage || user.profileImage;
            user.aadharNumber = req.body.aadharNumber || user.aadharNumber;

            // Academic 
            user.academicClass = req.body.academicClass || user.academicClass;
            user.board = req.body.board || user.board;
            user.exams = req.body.exams || user.exams;
            user.language = req.body.language || user.language;

            // Handle password update if needed
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: (updatedUser as any)._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profileImage: updatedUser.profileImage,
                token: generateToken((updatedUser as any)._id, updatedUser.role),
                mobile: updatedUser.mobile,
                city: updatedUser.city,
                academicClass: updatedUser.academicClass,
                board: updatedUser.board,
                exams: updatedUser.exams,
                language: updatedUser.language,
                aadharNumber: updatedUser.aadharNumber
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
