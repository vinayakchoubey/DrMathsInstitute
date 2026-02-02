"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, useScroll, useTransform, useMotionValueEvent, PanInfo } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ArrowRight, User, Calendar, BookOpen, Star, Sparkles, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}`;

interface Course {
    _id: string;
    title: string;
    thumbnail: string;
    price: number;
    originalPrice?: number;
    teacherName: string;
    category: string;
    startDate?: string;
    description: string;
    isFeatured?: boolean;
}

export default function OngoingCoursesCarousel() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCard, setActiveCard] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { addToCart, isInCart } = useCart();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch ONLY featured courses
                const { data } = await axios.get(`${API_URL}/api/courses?featured=true`);
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleCardClick = (courseId: string) => {
        router.push(`/courses/${courseId}`);
    };

    const handleAddToCart = (e: React.MouseEvent, course: Course) => {
        e.stopPropagation(); // Prevent card click navigation
        addToCart({
            _id: course._id,
            title: course.title,
            price: course.price,
            thumbnail: course.thumbnail,
            teacherName: course.teacherName
        });
        alert("Added to cart!");
    };

    if (loading) return null;
    if (courses.length === 0) return null;

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4"
                    >
                        <Sparkles size={14} /> Top Selections
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                    >
                        Master Mathematics with Expert-Led Courses
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto text-lg"
                    >
                        Unlock your potential with our meticulously designed curriculum. Join thousands of successful students achieving their academic goals.
                    </motion.p>
                </div>

                {/* Horizontal Scroll / Slide Show */}
                <div
                    className="flex overflow-x-auto gap-8 pb-12 pt-4 px-4 snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {courses.map((course, index) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -10 }}
                            className="bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden min-w-[320px] md:min-w-[380px] snap-center group hover:bg-slate-900/80 transition-colors cursor-pointer relative"
                            onClick={() => handleCardClick(course._id)}
                        >
                            {/* Image Container */}
                            <div className="h-56 relative overflow-hidden">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />

                                <div className="absolute top-4 left-4">
                                    <span className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        {course.category || "Featured"}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 relative">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                                    {course.title}
                                </h3>

                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                    <User size={14} className="text-blue-500" />
                                    <span>{course.teacherName}</span>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500">Starting From</span>
                                        <span className="text-sm font-medium text-white flex items-center gap-1">
                                            <Calendar size={12} /> {course.startDate ? new Date(course.startDate).toLocaleDateString() : "Flexible"}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        {course.originalPrice && (
                                            <span className="block text-xs text-gray-500 line-through">
                                                ₹{course.originalPrice}
                                            </span>
                                        )}
                                        <span className="text-lg font-bold text-green-400">
                                            ₹{course.price}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => handleAddToCart(e, course)}
                                        disabled={isInCart(course._id)}
                                        className={`flex-1 ${isInCart(course._id) ? 'bg-green-600/20 text-green-400' : 'bg-white/5 hover:bg-white/10 text-gray-300'} border border-white/10 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2`}
                                    >
                                        <ShoppingCart size={16} /> {isInCart(course._id) ? "Added" : "Cart"}
                                    </button>
                                    <button
                                        onClick={() => handleCardClick(course._id)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border border-transparent py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        View <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Ghost Card for styling end of scroll */}
                    <div className="min-w-[20px]" />
                </div>

                {/* Scroll Indicators (Optional visual cue) */}
                <div className="flex justify-center gap-2 mt-4">
                    <motion.div
                        animate={{ x: [-10, 10, -10] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-gray-500 flex items-center gap-2 text-sm"
                    >
                        <ArrowRight /> Swipe to explore
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

