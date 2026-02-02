"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Award, Users, BookOpen, Quote, Mail, Linkedin, Twitter } from "lucide-react";

export default function AboutPage() {
    const [data, setData] = useState<any>(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/about`);
                setData(data);

                const membersRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/about/members`);
                setMembers(membersRes.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAbout();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Default content if no data from API
    const content = data || {
        instituteOverview: "Dr. Maths Institute is dedicated to providing top-tier mathematical education. Our mission is to simplify complex concepts and empower students to achieve academic excellence.",
        ceoProfile: "A visionary educator with over 20 years of experience in mathematics coaching.",
        ceoImage: "/placeholder-ceo.jpg"
    };

    return (
        <div className="min-h-screen bg-background text-white">
            {/* Hero Section */}
            <div className="relative pt-20 pb-16 flex flex-col items-center text-center px-4 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-gradient-to-b from-blue-900/10 to-transparent -z-10 blur-3xl rounded-full opacity-50"></div>

                <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                    Who We Are
                </span>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                    Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Minds</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    We are dedicated to shaping the future of education through innovation, expertise, and a passion for mathematics.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-24">

                {/* Institute Overview & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">About Our Institute</h2>
                            <div className="w-20 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6"></div>
                            <p className="text-gray-300 text-lg leading-relaxed text-justify">
                                {content.instituteOverview}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold">Excellence</h4>
                                    <p className="text-xs text-gray-400">Top-tier Education</p>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                                <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold">Community</h4>
                                    <p className="text-xs text-gray-400">Vibrant Learning</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
                        <div className="relative bg-card border border-white/10 rounded-3xl p-8 overflow-hidden">
                            {/* Decorative Pattern */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>

                            <div className="flex items-start gap-4 mb-6">
                                <Quote className="text-blue-500 w-10 h-10 flex-shrink-0" />
                                <h3 className="text-2xl font-bold">Message from the Founder</h3>
                            </div>

                            <blockquote className="text-gray-300 italic text-lg leading-relaxed mb-8">
                                &quot;{content.ceoProfile}&quot;
                            </blockquote>

                            <div className="flex items-center gap-6 pt-8 border-t border-white/10">
                                <img
                                    src={content.ceoImage || "/placeholder-ceo.jpg"}
                                    alt="CEO"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500/20 shadow-xl"
                                />
                                <div>
                                    <h4 className="text-xl font-bold text-white">CEO & Founder</h4>
                                    <p className="text-blue-400 font-medium">Dr. Maths Institute</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Members Section */}
                {members.length > 0 && (
                    <div className="space-y-12">
                        <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-black mb-4">Meet Our Exceptional Team</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                The passionate educators and professionals behind our success.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {members.map((member: any) => (
                                <div key={member._id} className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
                                    <div className="flex items-start gap-5">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 group-hover:border-purple-500/50 transition-colors">
                                                <img
                                                    src={member.image || "/placeholder-user.jpg"}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-purple-600 rounded-lg p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                                <Linkedin size={14} className="text-white" />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0 pt-1">
                                            <h3 className="text-lg font-bold text-white truncate">{member.name}</h3>
                                            <p className="text-purple-400 text-sm font-medium mb-2 truncate">{member.role}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                                            {member.bio}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

