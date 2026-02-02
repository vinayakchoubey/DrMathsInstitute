"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, Lock, PlayCircle, FileText, CheckCircle, Video, Clock, Users, Star, Award, ShieldCheck, ChevronRight, Check, Calendar } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Course {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    originalPrice?: number;
    teacherName: string;
    teacherBio?: string;
    instructors?: { name: string; bio: string; image: string; }[];
    teacherImage?: string;
    zoomMeetingId?: string;
    zoomPassword?: string;
    highlights?: string[];
    content?: any[];
    startDate?: string;
    type?: string;
    category?: string;
    schedule?: { day: string; slots: { time: string; subject: string; instructor: string; }[] }[];
}

export default function CourseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isPurchased, setIsPurchased] = useState(false);
    const [processing, setProcessing] = useState(false);
    const { addToCart, isInCart } = useCart();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchCourse();
    }, [id]);

    useEffect(() => {
        if (user && course) {
            const purchased = user.purchasedCourses?.includes(id) || user.role === 'admin';
            setIsPurchased(purchased);
        }
    }, [user, course]);

    const fetchCourse = async () => {
        try {
            const { data } = await axios.get(`http://127.0.0.1:5000/api/courses/${id}`);
            setCourse(data);
        } catch (error) {
            console.error("Failed to fetch course", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        setProcessing(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://127.0.0.1:5000/api/payment/verify",
                { courseId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedUser = { ...user, purchasedCourses: [...(user.purchasedCourses || []), id] };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsPurchased(true);
            alert("Course processed successfully! Redirecting to your dashboard...");
            router.push("/dashboard");
        } catch (error) {
            console.error("Purchase failed", error);
            alert("Purchase failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-40 min-h-screen bg-[#020617]">
            <Loader2 className="animate-spin text-purple-500 w-12 h-12" />
        </div>
    );

    if (!course) return (
        <div className="flex flex-col items-center justify-center py-40 min-h-screen bg-[#020617] text-white">
            <h2 className="text-2xl font-bold mb-2">Course not found</h2>
            <button onClick={() => router.back()} className="text-primary hover:underline">Go Back</button>
        </div>
    );

    const discount = course.originalPrice && course.originalPrice > course.price
        ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-[#020617] text-gray-100 pb-20">
            {/* Hero Background */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-purple-900/20 via-[#020617]/80 to-[#020617] -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-20">

                {/* Breacrumbs purely visual */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-medium">
                    <span className="hover:text-white cursor-pointer" onClick={() => router.push('/courses')}>Courses</span>
                    <ChevronRight size={14} />
                    <span className="text-purple-400">{course.category || "General"}</span>
                    <ChevronRight size={14} />
                    <span className="text-white truncate max-w-[200px]">{course.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Title Section */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-xl text-gray-400 leading-relaxed font-light border-l-4 border-purple-500 pl-4">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4 text-sm font-medium text-gray-300">
                                {course.startDate && (
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                        <Clock className="w-4 h-4 text-purple-400" />
                                        <span>Starts {new Date(course.startDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                    <Video className="w-4 h-4 text-pink-400" />
                                    <span>{course.type || 'Online'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                    <ShieldCheck className="w-4 h-4 text-green-400" />
                                    <span>Certified Course</span>
                                </div>
                            </div>
                        </div>

                        {/* Live Class CTA (If Purchased) */}
                        {isPurchased && (
                            <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-8 shadow-2xl shadow-red-900/30 group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="text-white">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="flex h-3 w-3 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                            </span>
                                            <h2 className="text-xl font-bold tracking-wide">LIVE SESSION ACCESS</h2>
                                        </div>
                                        <p className="text-red-100/90 font-medium">Interactive classes are available. Join now!</p>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/meeting?courseId=${id}&meetingId=${course.zoomMeetingId}&pwd=${course.zoomPassword}`)}
                                        className="bg-white text-red-600 font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                                    >
                                        <Video className="w-5 h-5" /> Join Live Class
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Weekly Schedule (If Purchased) */}
                        {isPurchased && course.schedule && course.schedule.length > 0 && (
                            <div className="bg-[#0f172a]/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <Calendar className="text-blue-400" /> Weekly Class Schedule
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {course.schedule.map((daySch, idx) => (
                                        <div key={idx} className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                                            <div className="bg-white/5 p-3 font-bold text-center border-b border-white/5 text-purple-200">
                                                {daySch.day}
                                            </div>
                                            <div className="p-4 space-y-3">
                                                {daySch.slots.length === 0 ? (
                                                    <p className="text-xs text-gray-500 text-center italic">No classes</p>
                                                ) : (
                                                    daySch.slots.map((slot, sIdx) => (
                                                        <div key={sIdx} className="flex items-start gap-3 relative pb-3 border-b border-white/5 last:border-0 last:pb-0">
                                                            <div className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-1 rounded shrink-0 flex items-center gap-1">
                                                                <Clock size={12} /> {slot.time}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm text-gray-200">{slot.subject}</p>
                                                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                                    <Users size={10} /> {slot.instructor}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* What you'll learn */}
                        <div className="bg-[#0f172a]/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Award className="text-yellow-500" /> What you'll learn
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(course.highlights && course.highlights.length > 0 ? course.highlights : [
                                    "Complete synergy of concepts",
                                    "Problem solving mastery",
                                    "Test series and analysis",
                                    "Revision strategy sessions"
                                ]).map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                                        <div className="mt-1 bg-green-500/20 p-1 rounded-full">
                                            <Check className="w-3 h-3 text-green-500" />
                                        </div>
                                        <span className="text-gray-300 text-sm font-medium leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Content List - Only shown after purchase */}
                        {isPurchased && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <FileText className="text-blue-500" /> Course Content
                                </h2>
                                <div className="bg-[#0f172a]/80 border border-white/5 rounded-3xl overflow-hidden">
                                    {course.content && course.content.length > 0 ? (
                                        <div className="divide-y divide-white/5">
                                            {course.content.map((item: any, index: number) => (
                                                <div key={index} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                                    <div className="flex items-center gap-5">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'video' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                                            {item.type === 'video' ? <PlayCircle size={20} /> : <FileText size={20} />}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-medium group-hover:text-purple-400 transition-colors">{item.title}</h4>
                                                            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">{item.type}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors">
                                                            Open
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-10 text-center flex flex-col items-center justify-center space-y-3">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-2">
                                                <FileText className="w-8 h-8 text-gray-600" />
                                            </div>
                                            <p className="text-gray-400 font-medium">No instructional content uploaded yet.</p>
                                            <p className="text-xs text-gray-600">Check back later or join live sessions.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Instructors Section */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Instructors</h2>

                            {(course.instructors && course.instructors.length > 0) ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {course.instructors.map((inst: any, idx: number) => (
                                        <div key={idx} className="bg-[#0f172a]/50 border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center space-y-4 hover:bg-white/[0.02] transition-colors">
                                            <div className="shrink-0 relative">
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
                                                    {inst.image ? (
                                                        <img src={inst.image} alt={inst.name} className="w-full h-full rounded-full object-cover border-2 border-[#0f172a]" />
                                                    ) : (
                                                        <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                                                            <span className="text-3xl font-bold text-white uppercase">{inst.name.charAt(0)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute bottom-0 right-0 bg-green-500 border-4 border-[#0f172a] w-6 h-6 rounded-full" title="Verified Instructor"></div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{inst.name}</h3>
                                                <p className="text-gray-400 text-sm leading-relaxed">{inst.bio}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // Legacy Fallback for single instructor
                                <div className="bg-[#0f172a]/50 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center bg-gradient-to-br from-white/[0.02] to-transparent">
                                    <div className="shrink-0 relative">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
                                            {course.teacherImage ? (
                                                <img src={course.teacherImage} alt={course.teacherName} className="w-full h-full rounded-full object-cover border-2 border-[#0f172a]" />
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                                                    <span className="text-3xl font-bold text-white uppercase">{course.teacherName.charAt(0)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute bottom-0 right-0 bg-green-500 border-4 border-[#0f172a] w-6 h-6 rounded-full" title="Verified Instructor"></div>
                                    </div>
                                    <div className="text-center md:text-left space-y-2">
                                        <h3 className="text-lg font-bold text-gray-500 uppercase tracking-widest text-xs">Your Instructor</h3>
                                        <h2 className="text-3xl font-bold text-white">{course.teacherName}</h2>
                                        <p className="text-gray-400 max-w-xl leading-relaxed">{course.teacherBio || "Start your journey with an expert instructor dedicated to simplified learning and conceptual mastery."}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Pricing Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-[#1e293b]/50 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
                            <div className="relative aspect-video rounded-xl overflow-hidden mb-6 shadow-lg group">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                {!isPurchased && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                                    </div>
                                )}
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-4xl font-black text-white tracking-tight">₹{course.price.toLocaleString()}</span>
                                    {course.originalPrice && course.originalPrice > course.price && (
                                        <span className="text-lg text-gray-500 line-through decoration-gray-500/50">₹{course.originalPrice.toLocaleString()}</span>
                                    )}
                                </div>
                                {discount > 0 && (
                                    <div className="inline-block bg-green-500/10 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/20">
                                        {discount}% Savings
                                    </div>
                                )}
                            </div>

                            {isPurchased ? (
                                <div className="space-y-4">
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 text-green-400">
                                        <CheckCircle className="w-6 h-6 shrink-0" />
                                        <div>
                                            <p className="font-bold text-sm">You are enrolled!</p>
                                            <p className="text-xs opacity-80">Access content anytime.</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push('/dashboard')}
                                        className="w-full bg-white text-black hover:bg-gray-100 font-bold py-4 rounded-xl shadow-lg shadow-white/5 transition-all flex items-center justify-center gap-2"
                                    >
                                        Go to Dashboard
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <button
                                        onClick={() => {
                                            addToCart({
                                                _id: course._id,
                                                title: course.title,
                                                price: course.price,
                                                thumbnail: course.thumbnail,
                                                teacherName: course.teacherName
                                            });
                                            alert("Added to cart!");
                                        }}
                                        disabled={isInCart(course._id)}
                                        className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${isInCart(course._id)
                                            ? 'bg-green-600 text-white cursor-default'
                                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                                            }`}
                                    >
                                        {isInCart(course._id) ? <><CheckCircle size={20} /> Added to Cart</> : "Add to Cart"}
                                    </button>

                                    <button
                                        onClick={handlePurchase}
                                        disabled={processing}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                                    >
                                        {processing ? <Loader2 className="animate-spin" /> : "Buy Now"}
                                    </button>
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-3">
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                    <ShieldCheck size={14} className="text-green-500" />
                                    <span>30-Day Money-Back Guarantee</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                    <Lock size={14} className="text-blue-500" />
                                    <span>Secure SSL Payment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
