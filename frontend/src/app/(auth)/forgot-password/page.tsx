"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Loader2, Eye, EyeOff, Mail, KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [step, setStep] = useState(1); // 1: email, 2: OTP + password, 3: success
    const [timer, setTimer] = useState(60);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Countdown timer for OTP expiry
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    // Step 1: Send OTP to registered email
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
            setStep(2);
            setTimer(60);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        setLoading(true);
        setError("");
        try {
            await axios.post(`${API_URL}/api/auth/resend-otp`, { email });
            setTimer(60);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP and reset password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/auth/reset-password`, {
                email,
                otp,
                newPassword,
            });
            setStep(3);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Password reset failed");
            setOtp("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-sm w-full p-6 rounded-2xl bg-card border border-white/10 shadow-2xl">

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                        {step === 3 ? (
                            <CheckCircle2 className="w-7 h-7 text-green-400" />
                        ) : step === 2 ? (
                            <KeyRound className="w-7 h-7 text-purple-400" />
                        ) : (
                            <Mail className="w-7 h-7 text-blue-400" />
                        )}
                    </div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        {step === 3
                            ? "Password Reset!"
                            : step === 2
                                ? "Reset Password"
                                : "Forgot Password"}
                    </h2>
                    <p className="text-gray-400 text-sm mt-2">
                        {step === 3
                            ? "Your password has been changed successfully."
                            : step === 2
                                ? `Enter the OTP sent to ${email}`
                                : "Enter your registered email to receive a reset code."}
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Step 1: Email Input */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-secondary/50 border border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white text-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-fit mx-auto block px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2.5 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP"}
                        </button>
                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-1 text-gray-400 hover:text-white text-sm transition-colors mt-2"
                        >
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </form>
                )}

                {/* Step 2: OTP + New Password */}
                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        {/* OTP Timer */}
                        <div className="bg-blue-500/10 p-3 rounded-lg text-sm text-blue-200">
                            OTP sent to <b>{email}</b>
                            <div className={`mt-1 font-bold ${timer < 10 ? 'text-red-400' : 'text-yellow-400'}`}>
                                Time Left: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                            </div>
                        </div>

                        {/* OTP Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 6) setOtp(val);
                                }}
                                maxLength={6}
                                required
                                className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white text-center text-2xl tracking-widest font-mono"
                                placeholder="000000"
                            />
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full bg-secondary/50 border border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white pr-10 text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full bg-secondary/50 border border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white pr-10 text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-fit mx-auto block px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2.5 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
                        </button>

                        {/* Resend / Back */}
                        <div className="flex flex-col items-center gap-2">
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={loading || timer > 0}
                                className={`text-sm font-semibold ${loading || timer > 0
                                    ? 'text-gray-500 cursor-not-allowed'
                                    : 'text-primary hover:text-primary/80'
                                    }`}
                            >
                                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setStep(1); setOtp(""); setError(""); }}
                                className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
                            >
                                <ArrowLeft size={14} /> Change email
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="text-center space-y-5">
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg text-sm">
                            Your password has been updated successfully. You can now log in with your new password.
                        </div>
                        <Link
                            href="/login"
                            className="w-fit mx-auto block px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2.5 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all text-center text-sm"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
