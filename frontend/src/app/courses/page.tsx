"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Loader2, Search, BookOpen, Calendar, ChevronRight, Filter, ShoppingCart, Info, X, User, Check, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Course {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    originalPrice?: number;
    teacherName: string;
    category?: string;
    language?: string;
    examTarget?: string;
    startDate?: string;
    type?: string; // 'online', 'offline', 'hybrid'
    highlights?: string[];
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<string>("all"); // 'all', 'online', 'offline', 'hybrid'
    const { addToCart } = useCart();

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const query = search ? `?keyword=${search}` : "";
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/courses${query}`);
            setCourses(data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search
        const delayDebounceFn = setTimeout(() => {
            fetchCourses();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const calculateDiscount = (price: number, original?: number) => {
        if (!original || original <= price) return 0;
        return Math.round(((original - price) / original) * 100);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Date TBA";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
    };

    // Filter courses client-side for immediate feedback
    const filteredCourses = courses.filter(course => {
        if (filterType === 'all') return true;
        // Default to 'online' if type is missing for backward compatibility
        const cType = course.type?.toLowerCase() || 'online';
        return cType === filterType;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Header & Search */}
            {/* Header Area */}
            <div className="relative mb-6 py-6 flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-500/10 to-transparent rounded-3xl -z-10 blur-xl"></div>

                <div className="inline-block px-3 py-1 mb-3 text-[10px] font-bold tracking-wider text-blue-400 uppercase bg-blue-500/10 rounded-full border border-blue-500/20">
                    Academic Excellence
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
                    All <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Courses</span>
                </h1>

                <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
                    Discover comprehensive study materials and live classes designed to help you master mathematics.
                </p>
            </div>

            {/* Search + Filters — same line on desktop */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6 md:justify-between">
                <div className="w-full md:w-auto md:flex-1 max-w-md relative z-10 md:order-2">
                    <div className="relative group w-full">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-black rounded-xl p-1 flex items-center border border-white/10">
                            <Search className="text-gray-400 ml-3 w-5 h-5 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search for a topic..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent text-white placeholder-gray-500 border-none focus:ring-0 py-2 px-3 outline-none text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0 md:order-1">
                    <button
                        onClick={() => setFilterType("all")}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 border whitespace-nowrap ${filterType === 'all' ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                        All Types
                    </button>
                    <button
                        onClick={() => setFilterType("online")}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${filterType === 'online' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                        Online
                    </button>
                    <button
                        onClick={() => setFilterType("hybrid")}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${filterType === 'hybrid' ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                        Hybrid
                    </button>
                    <button
                        onClick={() => setFilterType("offline")}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${filterType === 'offline' ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                        Offline
                    </button>
                </div>
            </div>


            {
                loading ? (
                    <div className="flex justify-center h-60 items-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredCourses.map((course) => {
                            const discount = calculateDiscount(course.price, course.originalPrice);
                            const isLive = new Date(course.startDate || "") <= new Date();

                            // Determine label color
                            let typeLabelColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                            if (course.type === 'hybrid') typeLabelColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";
                            if (course.type === 'offline') typeLabelColor = "bg-orange-500/10 text-orange-400 border-orange-500/20";

                            return (
                                <Link href={`/courses/${course._id}`} key={course._id} className="block group">
                                    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-200">
                                        {/* Thumbnail Area */}
                                        <div className="relative h-40 bg-gray-100 p-4 flex items-center justify-center overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-full">
                                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-bold uppercase backdrop-blur-md border ${typeLabelColor.replace('bg-', 'bg-black/60 ')} text-white`}>
                                                {course.type || 'Online'}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 flex-1 flex flex-col bg-white">
                                            {/* Tags */}
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-primary font-semibold text-xs uppercase tracking-wide">
                                                    {course.category || "General"}
                                                </span>
                                                {course.language && (
                                                    <span className="border border-gray-200 text-gray-600 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">
                                                        {course.language}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-gray-900 font-bold text-lg leading-tight mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                                {course.title}
                                            </h3>

                                            {/* Meta Info */}
                                            <div className="space-y-2 mb-4">
                                                {course.examTarget && (
                                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                        <BookOpen size={16} />
                                                        <span>{course.examTarget}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                    <Calendar size={16} />
                                                    <div className="flex items-center gap-2">
                                                        {isLive ? (
                                                            <>
                                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                                <span className="font-medium text-gray-900">Started</span>
                                                            </>
                                                        ) : (
                                                            <span>Starts {formatDate(course.startDate)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer: Price & Action */}
                                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-900 font-bold text-lg">₹{course.price.toLocaleString()}</span>
                                                        {course.originalPrice && course.originalPrice > course.price && (
                                                            <span className="text-gray-400 text-sm line-through">₹{course.originalPrice.toLocaleString()}</span>
                                                        )}
                                                    </div>
                                                    {discount > 0 && (
                                                        <div className="text-green-600 text-xs font-bold">{discount}% OFF</div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setSelectedCourse(course);
                                                        }}
                                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-xl transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Info size={20} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            addToCart({
                                                                _id: course._id,
                                                                title: course.title,
                                                                price: course.price,
                                                                thumbnail: course.thumbnail,
                                                                teacherName: course.teacherName
                                                            });
                                                            alert("Added to cart!");
                                                        }}
                                                        className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-black/20 hover:scale-105 active:scale-95"
                                                    >
                                                        <ShoppingCart size={18} />
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )
            }
            {
                !loading && filteredCourses.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                        <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                        <p className="text-gray-400">Try changing filters or search terms.</p>
                    </div>
                )
            }

            {/* Course Details Modal */}
            {selectedCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCourse(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="relative h-56 sm:h-64">
                            <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <button
                                onClick={() => setSelectedCourse(null)}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-md"
                            >
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="flex gap-2 mb-2">
                                    <span className="bg-blue-600/90 text-white text-xs font-bold px-2 py-1 rounded uppercase backdrop-blur-md">
                                        {selectedCourse.category || 'Course'}
                                    </span>
                                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded uppercase backdrop-blur-md border border-white/30">
                                        {selectedCourse.type || 'Online'}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-black text-white leading-tight">{selectedCourse.title}</h2>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 relative z-10">

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl uppercase">
                                        {selectedCourse.teacherName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Instructor</div>
                                        <div className="font-bold text-gray-900 text-lg">{selectedCourse.teacherName}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-gray-900">₹{selectedCourse.price.toLocaleString()}</div>
                                    {selectedCourse.originalPrice && selectedCourse.originalPrice > selectedCourse.price && (
                                        <div className="text-gray-400 text-sm line-through">₹{selectedCourse.originalPrice.toLocaleString()}</div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-1">
                                            <Calendar size={14} /> Start Date
                                        </div>
                                        <div className="font-semibold text-gray-900">
                                            {selectedCourse.startDate ? new Date(selectedCourse.startDate).toLocaleDateString() : 'TBA'}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-1">
                                            <BookOpen size={14} /> Target Exam
                                        </div>
                                        <div className="font-semibold text-gray-900">{selectedCourse.examTarget || 'General'}</div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">About this Course</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{selectedCourse.description}</p>
                                </div>

                                {/* Highlights */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">What you'll learn</h3>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {(selectedCourse.highlights && selectedCourse.highlights.length > 0 ? selectedCourse.highlights : [
                                            "In-depth concept clarity",
                                            "Daily practice problems (DPPs)",
                                            "Mock tests and analysis",
                                            "Exclusive doubt sessions",
                                            "Revision notes and mind maps"
                                        ]).map((highlight, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm">
                                                <div className="mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                    <Check className="w-3 h-3 text-green-600" />
                                                </div>
                                                <span>{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur py-4 -mb-4">
                                <button
                                    onClick={() => setSelectedCourse(null)}
                                    className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={(e) => {
                                        addToCart({
                                            _id: selectedCourse._id,
                                            title: selectedCourse.title,
                                            price: selectedCourse.price,
                                            thumbnail: selectedCourse.thumbnail,
                                            teacherName: selectedCourse.teacherName
                                        });
                                        alert("Added to cart!");
                                        setSelectedCourse(null);
                                    }}
                                    className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl hover:shadow-black/20 hover:scale-105 active:scale-95"
                                >
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

