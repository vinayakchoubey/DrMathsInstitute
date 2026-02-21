"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    content: string;
    image: string;
}

export default function TestimonialSection() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [columns, setColumns] = useState<Testimonial[][]>([[], [], []]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/testimonials`);
                const cols: Testimonial[][] = [[], [], []];
                data.forEach((t: Testimonial, i: number) => {
                    cols[i % 3].push(t);
                });
                setTestimonials(data);
                setColumns(cols);
            } catch (error) {
                console.error("Failed to fetch testimonials", error);
            }
        };
        fetchTestimonials();
    }, []);

    if (testimonials.length === 0) return null;

    return (
        <section className="py-14 md:py-16 bg-slate-950 relative overflow-hidden">
            {/* Background accents */}
            <div className="absolute top-1/3 left-0 w-72 h-72 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-8 md:mb-8">
                    {/* Decorative accent line */}
                    <div className="flex justify-center mb-3">
                        <div className="w-10 h-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
                    </div>
                    {/* Badge */}
                    <span className="inline-block px-3 py-1 mb-3 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-[10px] md:text-xs font-semibold tracking-widest uppercase">
                        💬 Student Reviews
                    </span>
                    <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent mb-2 md:mb-3">
                        What Our Students Say
                    </h2>
                    <p className="hidden md:block text-gray-400 max-w-2xl mx-auto text-base">
                        Discover inspiration and insights through recent reviews from our students. Their success stories reflect the transformative journey of learning and growth with Dr Maths Institute.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4 h-[420px] md:h-[400px] overflow-hidden mask-gradient max-w-5xl mx-auto">
                    <TestimonialColumn testimonials={columns[0]} duration={40} />
                    <TestimonialColumn testimonials={columns[1]} duration={50} className="hidden md:block" />
                    <TestimonialColumn testimonials={columns[2]} duration={35} className="hidden lg:block" />
                </div>
            </div>

            {/* Gradient Mask for fading edges */}
            <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-b from-slate-950 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-slate-950 to-transparent z-20 pointer-events-none" />
        </section>
    );
}

function TestimonialColumn({ testimonials, duration, className = "" }: { testimonials: Testimonial[], duration: number, className?: string }) {
    const items = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

    return (
        <div className={`relative h-full overflow-hidden ${className}`}>
            <motion.div
                animate={{ y: "-50%" }}
                transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: duration,
                    ease: "linear",
                }}
                className="flex flex-col gap-3 md:gap-4 pb-3 md:pb-4"
            >
                {items.map((t, i) => (
                    <div
                        key={`${t._id}-${i}`}
                        className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/40 border border-white/[0.08] p-4 rounded-xl md:rounded-2xl backdrop-blur-sm hover:border-blue-500/30 hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] transition-all duration-300 group"
                    >
                        {/* Quote icon */}
                        <Quote className="absolute top-3 right-3 w-4 h-4 md:w-5 md:h-5 text-blue-500/15 group-hover:text-blue-500/25 transition-colors" />

                        {/* Stars */}
                        <div className="flex gap-0.5 mb-2">
                            {[...Array(5)].map((_, idx) => (
                                <Star key={idx} className="w-2.5 h-2.5 md:w-3 md:h-3 fill-yellow-500 text-yellow-500" />
                            ))}
                        </div>

                        <p className="text-gray-300 text-xs md:text-[13px] leading-relaxed mb-2.5 md:mb-3">
                            &ldquo;{t.content}&rdquo;
                        </p>

                        <div className="flex items-center gap-2.5 pt-2 border-t border-white/[0.06]">
                            <img
                                src={t.image}
                                alt={t.name}
                                className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                            />
                            <div>
                                <h4 className="font-semibold text-white text-[11px] md:text-xs">{t.name}</h4>
                                <p className="text-blue-400 text-[9px] md:text-[11px]">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}


