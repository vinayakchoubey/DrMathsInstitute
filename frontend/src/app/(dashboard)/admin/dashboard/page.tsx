"use client";

import { useEffect, useState } from "react";
import { Video, FileText, BookOpen, User, Library } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
            <div className="text-center mb-16 pt-8">
                <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-6 tracking-tight">
                    Admin Dashboard
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                    Welcome back, Admin.
                </p>
                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-8 rounded-full shadow-lg shadow-purple-500/50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xlg:grid-cols-4 gap-6 animate-in fade-in duration-500">
                <Link href="/admin/courses" className="bg-card hover:bg-card/80 border border-white/10 p-8 rounded-2xl shadow-xl group transition-all hover:-translate-y-1">
                    <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen size={24} className="text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Manage Courses</h3>
                    <p className="text-gray-400 text-sm">Add, edit, or remove courses and study materials.</p>
                </Link>

                <Link href="/admin/modules" className="bg-card hover:bg-card/80 border border-white/10 p-8 rounded-2xl shadow-xl group transition-all hover:-translate-y-1">
                    <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Library size={24} className="text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Manage Modules</h3>
                    <p className="text-gray-400 text-sm">Organize study modules, books, and resources.</p>
                </Link>

                <Link href="/admin/about" className="bg-card hover:bg-card/80 border border-white/10 p-8 rounded-2xl shadow-xl group transition-all hover:-translate-y-1">
                    <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <User size={24} className="text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Manage About Info</h3>
                    <p className="text-gray-400 text-sm">Update institute details and CEO profile.</p>
                </Link>

                <Link href="/admin/policies" className="bg-card hover:bg-card/80 border border-white/10 p-8 rounded-2xl shadow-xl group transition-all hover:-translate-y-1">
                    <div className="bg-orange-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText size={24} className="text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Manage Footer</h3>
                    <p className="text-gray-400 text-sm">Update policies, terms, and footer links.</p>
                </Link>

                <Link href="/admin/documents" className="bg-card hover:bg-card/80 border border-white/10 p-8 rounded-2xl shadow-xl group transition-all hover:-translate-y-1">
                    <div className="bg-indigo-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText size={24} className="text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Knowledge Base</h3>
                    <p className="text-gray-400 text-sm">Manage RAG documents for AI context.</p>
                </Link>

                <Link href="/admin/video" className="bg-card hover:bg-card/80 border border-white/10 p-8 rounded-2xl shadow-xl group transition-all hover:-translate-y-1">
                    <div className="bg-red-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Video size={24} className="text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Manage Video</h3>
                    <p className="text-gray-400 text-sm">Update the promotional video section.</p>
                </Link>

                <Link href="/admin/scholars" className="bg-card hover:bg-card/80 border border-white/10 p-8 rounded-2xl shadow-xl group transition-all hover:-translate-y-1">
                    <div className="bg-teal-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <User size={24} className="text-teal-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Manage Scholars</h3>
                    <p className="text-gray-400 text-sm">Highlight top performing students.</p>
                </Link>
            </div>
        </div>
    );
}

