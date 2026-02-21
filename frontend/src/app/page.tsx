"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, BookOpen, Video, Award } from "lucide-react";

import TestimonialSection from "@/components/testimonials/TestimonialSection";
import Scholar3DCarousel from "@/components/scholars/Scholar3DCarousel";
import OngoingCoursesCarousel from "@/components/home/OngoingCoursesCarousel";
import VideoSection from "@/components/home/VideoSection";
import MobileHeroCarousel from "@/components/home/MobileHeroCarousel";
import MobileFeatureCarousel from "@/components/home/MobileFeatureCarousel";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};



export default function Home() {
  const featureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (featureRef.current && window.innerWidth < 768) {
        const { scrollLeft, scrollWidth, clientWidth } = featureRef.current;
        const scrollAmount = clientWidth; // Scroll by one view width (since cards are basically full width on mobile)

        if (scrollLeft + clientWidth >= scrollWidth - 50) {
          featureRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          featureRef.current.scrollBy({ left: scrollAmount * 0.85, behavior: "smooth" });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    // Unified Background Wrapper - Deep Space Theme
    <div className="flex flex-col min-h-screen bg-[#020617] text-white overflow-hidden">

      <MobileHeroCarousel />



      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-32 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-6 inline-block"
          >
            <span className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium tracking-wider uppercase">
              Excellence in Mathematics
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-8 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 animate-gradient-x">
              Dr Maths Institute
            </span>
            <br />
            <span className="text-3xl sm:text-5xl font-light text-gray-300 mt-4 block">
              <Typewriter text="An Institute of Mathematical Science " />
            </span>
          </h1>

          <p className="hidden md:block max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed">
            Unlock your potential with expert coaching, comprehensive courses, and a learning experience designed for success. Join the league of top rankers today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/courses">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-blue-500/25 flex items-center gap-2 group"
              >
                Explore Courses
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm font-semibold transition-colors"
              >
                Start Learning
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="w-full"
          >
            {/* Mobile View: 3D Carousel */}
            <div className="md:hidden">
              <MobileFeatureCarousel />
            </div>

            {/* Desktop View: Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<BookOpen className="w-10 h-10 text-blue-400" />}
                title="Comprehensive Material"
                description="Access detailed PDF notes and study guides curated by experts."
                delay={0}
                gradient="from-blue-500/20 to-purple-500/20"
              />
              <FeatureCard
                icon={<Video className="w-10 h-10 text-purple-400" />}
                title="Video Lectures"
                description="High-quality video sessions explaining complex concepts simply."
                delay={0.2}
                gradient="from-purple-500/20 to-pink-500/20"
              />
              <FeatureCard
                icon={<Award className="w-10 h-10 text-pink-400" />}
                title="Proven Success"
                description="Join hundreds of students who have achieved top results."
                delay={0.4}
                gradient="from-pink-500/20 to-red-500/20"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Top Ongoing Courses Section */}
      < OngoingCoursesCarousel />

      {/* Top Scholars Section - 3D Sphere/Carousel */}
      <section className="w-full pt-20 pb-32 md:pt-12 md:pb-16 relative overflow-visible" >
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-10 md:mb-8"
          >
            {/* Decorative accent line */}
            <div className="flex justify-center mb-3">
              <div className="w-10 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
            </div>
            {/* Badge */}
            <span className="inline-block px-3 py-1 mb-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] md:text-xs font-semibold tracking-widest uppercase">
              ✨ Top Achievers
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 md:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 drop-shadow-lg">Hall of Fame</h2>
            <p className="hidden md:block text-gray-400 max-w-2xl mx-auto text-base">Meet the brilliant minds who have achieved excellence with Dr Maths Institute.</p>
          </motion.div>

          <div className="w-full flex justify-center">
            <Scholar3DCarousel />
          </div>
        </div>
      </section >

      {/* Testimonials Section - Already Animated */}
      < div className="relative z-10" >
        <TestimonialSection />
      </div >

      {/* Video Section */}
      < VideoSection />

    </div >
  );
}

function FeatureCard({ icon, title, description, delay, className, gradient }: { icon: React.ReactNode; title: string; description: string; delay: number; className?: string; gradient?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, delay, type: "spring" } }
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative p-8 rounded-[2rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md shadow-xl overflow-hidden group ${className || ""}`}
    >
      {/* Glow Effect */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient || "from-blue-500/20 to-purple-500/20"} blur-[50px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10">
        <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit ring-1 ring-white/10 group-hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm shadow-inner">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">{title}</h3>
        <p className="text-gray-300 leading-relaxed font-light">{description}</p>
      </div>
    </motion.div>
  );
}

function Typewriter({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = text;

      setDisplayText(isDeleting
        ? fullText.substring(0, displayText.length - 1)
        : fullText.substring(0, displayText.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 3000);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed, text]);

  return (
    <span className="inline-block relative">
      {displayText}
      <span className="animate-pulse text-blue-500 absolute -right-4 top-0">|</span>
    </span>
  );
}

