"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

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
                // Distribute testimonials into 3 columns
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
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
                        What our Student Says
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Discover inspiration and insights through recent reviews from our students. Their success stories reflect the transformative journey of learning and growth with Dr Maths Institute.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px] overflow-hidden mask-gradient">
                    <TestimonialColumn testimonials={columns[0]} duration={40} />
                    <TestimonialColumn testimonials={columns[1]} duration={50} className="hidden md:block" />
                    <TestimonialColumn testimonials={columns[2]} duration={35} className="hidden lg:block" />
                </div>
            </div>

            {/* Gradient Mask for fading edges */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-950 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent z-20 pointer-events-none" />
        </section>
    );
}

function TestimonialColumn({ testimonials, duration, className = "" }: { testimonials: Testimonial[], duration: number, className?: string }) {
    // Determine how many times to duplicate content to fill vertical space smoothly
    // For simplicity, we just triple the array to ensure enough scroll content
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
                className="flex flex-col gap-6 pb-6"
            >
                {items.map((t, i) => (
                    <div key={`${t._id}-${i}`} className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm hover:border-blue-500/30 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-blue-500/20" />
                            <div>
                                <h4 className="font-bold text-white text-sm">{t.name}</h4>
                                <p className="text-blue-400 text-xs">{t.role}</p>
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            &quot;{t.content}&quot;
                        </p>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

