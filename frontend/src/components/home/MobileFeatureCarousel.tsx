"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Video, Award } from "lucide-react";

const features = [
    {
        id: 1,
        title: "Comprehensive Material",
        description: "Access detailed PDF notes and study guides curated by experts.",
        icon: <BookOpen className="w-12 h-12 text-blue-400" />,
        gradient: "from-blue-500/20 to-purple-500/20",
        border: "border-blue-500/30",
        glow: "bg-blue-500/20"
    },
    {
        id: 2,
        title: "Video Lectures",
        description: "High-quality video sessions explaining complex concepts simply.",
        icon: <Video className="w-12 h-12 text-purple-400" />,
        gradient: "from-purple-500/20 to-pink-500/20",
        border: "border-purple-500/30",
        glow: "bg-purple-500/20"
    },
    {
        id: 3,
        title: "Proven Success",
        description: "Join hundreds of students who have achieved top results.",
        icon: <Award className="w-12 h-12 text-pink-400" />,
        gradient: "from-pink-500/20 to-red-500/20",
        border: "border-pink-500/30",
        glow: "bg-pink-500/20"
    }
];

export default function MobileFeatureCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % features.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [isAutoPlaying]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % features.length);
        setIsAutoPlaying(false);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
        setIsAutoPlaying(false);
    };

    // Calculate styles for 3D effect
    const getSlideStyles = (index: number) => {
        // Since we only have 3 items, the logic is simpler
        // 0, 1, 2

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
        } else if (index === (currentIndex - 1 + features.length) % features.length) {
            position = 'left';
            scale = 0.85;
            zIndex = 10;
            opacity = 0.5;
            x = -50;
            rotateY = -15; // Subtle rotate
        } else if (index === (currentIndex + 1) % features.length) {
            position = 'right';
            scale = 0.85;
            zIndex = 10;
            opacity = 0.5;
            x = 50;
            rotateY = 15;
        }

        return { x, scale, zIndex, opacity, rotateY, position };
    };

    return (
        <div className="relative h-[400px] w-full flex items-center justify-center overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] -z-10 transition-colors duration-1000 ${features[currentIndex].glow}`} />

            <div className="relative w-full max-w-[320px] h-[350px] flex items-center justify-center perspective-1000">
                <AnimatePresence>
                    {features.map((feature, index) => {
                        const styles = getSlideStyles(index);
                        return (
                            <motion.div
                                key={feature.id}
                                className={`absolute inset-0 m-auto w-[280px] h-[320px] rounded-3xl bg-black/40 backdrop-blur-xl border ${feature.border} shadow-2xl flex flex-col items-center justify-center p-6 text-center`}
                                initial={false}
                                animate={{
                                    x: styles.position === 'left' ? '-15%' : styles.position === 'right' ? '15%' : '0%',
                                    scale: styles.scale,
                                    zIndex: styles.zIndex,
                                    opacity: styles.opacity,
                                    rotateY: styles.rotateY
                                }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className={`mb-6 p-4 rounded-full bg-white/5 ring-1 ring-white/10 ${features[index].glow} shadow-inner`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="absolute bottom-2 flex gap-6 z-50">
                <button onClick={handlePrev} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <ChevronLeft />
                </button>
                <div className="flex gap-2 items-center">
                    {features.map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'w-6 bg-white' : 'bg-white/20'}`} />
                    ))}
                </div>
                <button onClick={handleNext} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
}
