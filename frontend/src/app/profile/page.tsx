"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Camera, Edit2, Loader2, MessageSquare, Trash2, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        city: "",
        academicClass: "",
        board: "",
        exams: "",
        language: "",
        aadharNumber: "",
    });

    const [messages, setMessages] = useState<any[]>([]);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const { data } = await axios.get("http://127.0.0.1:5000/api/messages/my-messages", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const handleDeleteMessage = async (id: string) => {
        if (!confirm("Delete this message?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://127.0.0.1:5000/api/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(prev => prev.filter(m => m._id !== id));
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    useEffect(() => {
        // Initial load from localStorage for immediate render
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setFormData({
                name: parsed.name || "",
                mobile: parsed.mobile || "",
                email: parsed.email || "",
                city: parsed.city || "",
                academicClass: parsed.academicClass || "",
                board: parsed.board || "",
                exams: parsed.exams || "",
                language: parsed.language || "",
                aadharNumber: parsed.aadharNumber || "",
            });
        }

        // Fetch latest from API
        fetchProfile();
        fetchMessages();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const { data } = await axios.get("http://127.0.0.1:5000/api/auth/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser(data);
            setFormData({
                name: data.name || "",
                mobile: data.mobile || "",
                email: data.email || "",
                city: data.city || "",
                academicClass: data.academicClass || "",
                board: data.board || "",
                exams: data.exams || "",
                language: data.language || "",
                aadharNumber: data.aadharNumber || "",
            });

            // Update local storage to keep it fresh
            const existingLS = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...existingLS, ...data }));
            window.dispatchEvent(new Event("user-updated"));
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            // 1. Upload to Cloudinary via backend
            const uploadRes = await axios.post("http://127.0.0.1:5000/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const imageUrl = uploadRes.data.url;

            // 2. Update user profile with new image URL
            const token = localStorage.getItem("token");
            await axios.put("http://127.0.0.1:5000/api/auth/profile",
                { profileImage: imageUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // 3. Refresh local state
            await fetchProfile();

        } catch (error) {
            console.error("Image upload failed", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.put("http://127.0.0.1:5000/api/auth/profile", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await fetchProfile();
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-gray-50/5 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">Profile</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-card border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />

                            <div className="relative mt-4 mb-4 group">
                                <div className="w-32 h-32 rounded-full border-4 border-card shadow-2xl overflow-hidden relative bg-gray-800">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-500 bg-gray-900">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-transform active:scale-95 border-4 border-card"
                                >
                                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>

                            <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                            <p className="text-sm text-gray-400 mb-6">{user.email}</p>

                            {user.isVerified ? (
                                <div className="bg-green-500/10 text-green-500 px-6 py-2 rounded-full font-bold text-sm border border-green-500/20 w-full flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    Verified
                                </div>
                            ) : (
                                <div className="bg-red-500/10 text-red-500 px-6 py-2 rounded-full font-bold text-sm border border-red-500/20 w-full flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                                    Not Verified
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* My Messages */}
                        <div className="bg-card border border-white/10 rounded-2xl p-8 shadow-xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <MessageSquare className="text-primary" /> My Inquiries
                            </h3>

                            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                                {messages.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                                        No inquiries found
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg._id} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${msg.status === 'replied' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                                        }`}>
                                                        {msg.status}
                                                    </span>
                                                    <span className="text-gray-500 text-xs flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {new Date(msg.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteMessage(msg._id)}
                                                    className="text-gray-500 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <p className="text-gray-300 text-sm mb-3 font-medium">
                                                {msg.message}
                                            </p>

                                            {msg.reply && (
                                                <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                                                    <p className="text-xs text-green-400 font-bold mb-1 flex items-center gap-1">
                                                        <CheckCircle size={10} /> Support Reply
                                                    </p>
                                                    <p className="text-gray-300 text-xs">
                                                        {msg.reply}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>



                        {/* Profile Detail */}
                        <div className="bg-card border border-white/10 rounded-2xl p-8 relative">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold">Profile Detail</h3>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                                    >
                                        <Edit2 size={16} /> Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 text-sm rounded-lg hover:bg-white/5 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                        >
                                            {loading && <Loader2 size={14} className="animate-spin" />}
                                            Save
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-8">
                                {/* Personal Details */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Personal Details</h4>
                                    <div className="space-y-4">
                                        <DetailRow label="Name" value={formData.name} isEditing={isEditing} field="name" onChange={(v) => setFormData({ ...formData, name: v })} />
                                        <DetailRow label="Mobile No" value={formData.mobile} isEditing={isEditing} field="mobile" onChange={(v) => setFormData({ ...formData, mobile: v })} />
                                        <DetailRow label="Email" value={formData.email} isEditing={false} field="email" />
                                        <DetailRow label="Living City/Village/Town" value={formData.city} isEditing={isEditing} field="city" onChange={(v) => setFormData({ ...formData, city: v })} />
                                        <DetailRow label="Aadhar Number" value={formData.aadharNumber} isEditing={isEditing} field="aadharNumber" onChange={(v) => setFormData({ ...formData, aadharNumber: v })} />
                                    </div>
                                </div>

                                <div className="h-px bg-white/10" />

                                {/* Academic Details */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Academic Details</h4>
                                    <div className="space-y-4">
                                        <DetailRow
                                            label="Class"
                                            value={formData.academicClass}
                                            isEditing={isEditing}
                                            field="academicClass"
                                            options={["7th", "8th", "9th", "10th", "11th", "12th", "JEE", "NEET", "CUET"]}
                                            onChange={(v) => setFormData({ ...formData, academicClass: v })}
                                        />
                                        <DetailRow
                                            label="Board/State Board"
                                            value={formData.board}
                                            isEditing={isEditing}
                                            field="board"
                                            options={["CBSE", "ICSE", "State Board"]}
                                            onChange={(v) => setFormData({ ...formData, board: v })}
                                        />
                                        <DetailRow
                                            label="Exams"
                                            value={formData.exams}
                                            isEditing={isEditing}
                                            field="exams"
                                            options={["Boards", "JEE", "NEET", "CUET"]}
                                            onChange={(v) => setFormData({ ...formData, exams: v })}
                                        />
                                        <DetailRow
                                            label="Language"
                                            value={formData.language}
                                            isEditing={isEditing}
                                            field="language"
                                            options={["English", "Hinglish"]}
                                            onChange={(v) => setFormData({ ...formData, language: v })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailRow({
    label,
    value,
    isEditing,
    field,
    options,
    onChange
}: {
    label: string,
    value: string,
    isEditing: boolean,
    field?: string,
    options?: string[],
    onChange?: (val: string) => void
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1">
            <div className="text-gray-400 font-medium text-sm pt-2">{label}</div>
            <div className="sm:col-span-2">
                {isEditing && onChange ? (
                    options ? (
                        <select
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full bg-secondary/50 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                        >
                            <option value="" disabled>Select {label}</option>
                            {options.map((opt) => (
                                <option key={opt} value={opt} className="bg-slate-800 text-white">
                                    {opt}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full bg-secondary/50 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder={`Enter ${label}`}
                        />
                    )
                ) : (
                    <div className={`font-semibold py-2 ${!value ? 'text-gray-600 italic' : ''}`}>
                        {value || 'Not Set'}
                    </div>
                )}
            </div>
        </div>
    );
}
