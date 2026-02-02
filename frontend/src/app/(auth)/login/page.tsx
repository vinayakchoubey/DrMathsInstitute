"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [timer, setTimer] = useState(60);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleInitialLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
                email,
                password,
            });
            setStep(2);
            setTimer(60);
            alert(`OTP sent to ${email}`);
        } catch (err: any) {
            if (err?.response?.data?.message === 'Please login with Google') {
                setError("Please login with Google");
            } else {
                setError(err?.response?.data?.message || "Login failed");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        setError("");
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/resend-otp`, { email });
            setTimer(60);
            alert(`New OTP sent to ${email}`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login/verify`, {
                email,
                otp
            });

            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);

            window.location.href = "/";
        } catch (err: any) {
            setError(err?.response?.data?.message || "Verification failed");
            setOtp("");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        console.log("Google Login Success Response:", credentialResponse);
        // ... (same as before)
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/google`, {
                token: credentialResponse.credential
            });
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);
            window.location.href = "/";
        } catch (e: any) {
            console.error("Full Google Login Error:", e);
            if (e.response) {
                console.error("Backend Error Response:", e.response.data);
                console.error("Backend Status:", e.response.status);
            }
            setError("Google Login Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full p-8 rounded-2xl bg-card border border-white/10 shadow-2xl">
                <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    {step === 1 ? "Welcome Back" : "Verify Login"}
                </h2>
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleInitialLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white pr-10"
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
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-primary/50 transition-all flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login & Verify"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyLogin} className="space-y-6">
                        <div className="bg-blue-500/10 p-4 rounded-lg text-sm text-blue-200 mb-4">
                            We&apos;ve sent a 6-digit code to <b>{email}</b>.
                            <div className={`mt-2 font-bold ${timer < 10 ? 'text-red-400' : 'text-yellow-400'}`}>
                                Time Left: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, ''); // Only numbers
                                    if (val.length <= 6) setOtp(val);
                                }}
                                maxLength={6}
                                required
                                className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white text-center text-2xl tracking-widest font-mono"
                                placeholder="000000"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-primary/50 transition-all flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify OTP"}
                        </button>
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={loading || timer > 0}
                            className={`w-full text-sm font-semibold mt-2 ${loading || timer > 0 ? 'text-gray-500 cursor-not-allowed' : 'text-primary hover:text-primary/80'}`}
                        >
                            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-gray-400 hover:text-white text-sm"
                        >
                            Back to Login
                        </button>
                    </form>
                )}

                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                    <div className="flex-grow border-t border-white/10"></div>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError("Google Login Failed")}
                        theme="filled_black"
                        shape="pill"
                        text="continue_with"
                    />
                </div>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
