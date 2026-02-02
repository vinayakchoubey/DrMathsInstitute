"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, BookOpen, Video, Award } from "lucide-react";

import TestimonialSection from "@/components/testimonials/TestimonialSection";
import Scholar3DCarousel from "@/components/scholars/Scholar3DCarousel";
import OngoingCoursesCarousel from "@/components/home/OngoingCoursesCarousel";
import VideoSection from "@/components/home/VideoSection";

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
  return (
    // Unified Background Wrapper - Deep Space Theme
    <div className="flex flex-col min-h-screen bg-[#020617] text-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative w-full py-32 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
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

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed">
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
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon={<BookOpen className="w-10 h-10 text-blue-400" />}
              title="Comprehensive Material"
              description="Access detailed PDF notes and study guides curated by experts."
              delay={0}
            />
            <FeatureCard
              icon={<Video className="w-10 h-10 text-purple-400" />}
              title="Video Lectures"
              description="High-quality video sessions explaining complex concepts simply."
              delay={0.2}
            />
            <FeatureCard
              icon={<Award className="w-10 h-10 text-pink-400" />}
              title="Proven Success"
              description="Join hundreds of students who have achieved top results."
              delay={0.4}
            />
          </motion.div>
        </div>
      </section>

      {/* Top Ongoing Courses Section */}
      <OngoingCoursesCarousel />

      {/* Top Scholars Section - 3D Sphere/Carousel */}
      <section className="w-full py-32 relative overflow-visible">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Hall of Fame</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Meet the brilliant minds who have achieved excellence with Dr Maths Institute.</p>
          </motion.div>

          <div className="w-full flex justify-center">
            <Scholar3DCarousel />
          </div>
        </div>
      </section>

      {/* Testimonials Section - Already Animated */}
      <div className="relative z-10">
        <TestimonialSection />
      </div>

      {/* Video Section */}
      <VideoSection />

    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } }
      }}
      whileHover={{ y: -10, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" }}
      className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-sm group hover:bg-white/[0.05] transition-all duration-300"
    >
      <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10 group-hover:ring-blue-500/50">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-gray-100">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
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

