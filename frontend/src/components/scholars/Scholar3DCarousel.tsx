"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface Scholar {
    _id: string;
    name: string;
    image: string;
    description: string;
}

export default function Scholar3DCarousel() {
    const [scholars, setScholars] = useState<Scholar[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        const fetchScholars = async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/scholars`);
                setScholars(data);
            } catch (error) {
                console.error("Failed to fetch scholars", error);
            } finally {
                setLoading(false);
            }
        };
        fetchScholars();
    }, []);

    useEffect(() => {
        if (!isAutoPlaying || scholars.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % scholars.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [isAutoPlaying, scholars.length]);

    if (loading) return <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />;
    if (scholars.length === 0) return null;

    // Use a minimum of 3 items for the effect to work well. If less, duplicate.
    const displayScholars = scholars.length < 3 ? [...scholars, ...scholars, ...scholars].slice(0, 3) : scholars;

    // Detect mobile for responsive offsets
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const sideOffset = isMobile ? 200 : 300;

    const getSlideStyles = (index: number) => {
        const diff = (index - currentIndex + displayScholars.length) % displayScholars.length;

        let position = 'hidden';
        let x = 0;
        let scale = 0.8;
        let zIndex = 0;
        let opacity = 0;
        let rotateY = 0;

        if (index === currentIndex) {
            position = 'center';
            scale = 1;
            zIndex = 20;
            opacity = 1;
            x = 0;
            rotateY = 0;
        } else if (index === (currentIndex - 1 + displayScholars.length) % displayScholars.length) {
            position = 'left';
            scale = 0.85;
            zIndex = 10;
            opacity = 0.6;
            x = -sideOffset;
            rotateY = -25;
        } else if (index === (currentIndex + 1) % displayScholars.length) {
            position = 'right';
            scale = 0.85;
            zIndex = 10;
            opacity = 0.6;
            x = sideOffset;
            rotateY = 25;
        } else {
            position = 'back';
            scale = 0.7;
            zIndex = 0;
            opacity = 0;
        }

        return { x, scale, zIndex, opacity, rotateY };
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % displayScholars.length);
        setIsAutoPlaying(false);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + displayScholars.length) % displayScholars.length);
        setIsAutoPlaying(false);
    };

    return (
        <div className="relative h-[400px] md:h-[420px] w-full flex items-center justify-center overflow-hidden perspective-1000">
            <div className="relative w-[260px] h-[330px] md:w-[350px] md:h-[450px] flex items-center justify-center perspective-1000">
                <AnimatePresence>
                    {displayScholars.map((scholar, index) => {
                        const styles = getSlideStyles(index);
                        if (styles.opacity === 0) return null; // Optimization

                        return (
                            <motion.div
                                key={`${scholar._id}-${index}`}
                                className="absolute top-0 w-full h-full bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                                initial={false}
                                animate={styles}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                style={{
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                <div className="h-[70%] w-full overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60 z-10" />
                                    <img
                                        src={scholar.image}
                                        alt={scholar.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-3 md:p-6 relative z-20 -mt-10 md:-mt-12 bg-gradient-to-b from-transparent to-slate-900/90 h-[30%] flex flex-col justify-end">
                                    <h3 className="text-lg md:text-2xl font-bold text-white text-center mb-0.5 md:mb-1">{scholar.name}</h3>
                                    <p className="text-blue-400 text-xs md:text-sm text-center line-clamp-2">{scholar.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 flex gap-4 z-50">
                <button
                    onClick={handlePrev}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10"
                >
                    <ChevronLeft className="text-white" />
                </button>
                <div className="flex gap-2 items-center">
                    {displayScholars.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'w-6 bg-blue-500' : 'bg-white/30'}`}
                        />
                    ))}
                </div>
                <button
                    onClick={handleNext}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10"
                >
                    <ChevronRight className="text-white" />
                </button>
            </div>

            {/* Background Glow Effect - Sphere Suggestion */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        </div>
    );
}

