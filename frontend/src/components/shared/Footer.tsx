"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone, ChevronRight, X, Youtube } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface Policy {
    _id: string;
    title: string;
    content: string;
}

export default function Footer() {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const { data } = await axios.get("http://127.0.0.1:5000/api/policies");
                setPolicies(data);
            } catch (error) {
                console.error("Failed to fetch policies", error);
            }
        };
        fetchPolicies();
    }, []);

    return (
        <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-8 text-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Dr Maths Institute
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Empowering students with mathematical excellence through innovative teaching and comprehensive resources.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <SocialLink href="#" icon={<Facebook size={20} />} label="Facebook" color="hover:bg-blue-600" />
                            <SocialLink href="#" icon={<Twitter size={20} />} label="Twitter" color="hover:bg-sky-500" />
                            <SocialLink href="#" icon={<Instagram size={20} />} label="Instagram" color="hover:bg-pink-600" />
                            <SocialLink href="#" icon={<Linkedin size={20} />} label="LinkedIn" color="hover:bg-blue-700" />
                            <SocialLink href="#" icon={<Youtube size={20} />} label="YouTube" color="hover:bg-red-600" />
                        </div>
                    </div>

                    {/* Helpful Links (Dynamic) */}
                    <div>
                        <h4 className="font-bold text-blue-400 mb-6 uppercase tracking-wider">Helpful Links</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <Link href="/courses" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                                    <ChevronRight size={16} /> Courses
                                </Link>
                            </li>
                            {policies.map((policy) => (
                                <li key={policy._id}>
                                    <button
                                        onClick={() => setSelectedPolicy(policy)}
                                        className="flex items-center gap-2 hover:text-blue-400 transition-colors text-left w-full"
                                    >
                                        <ChevronRight size={16} /> {policy.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-wider">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-primary shrink-0" size={18} />
                                <span>K-80A Kalkaji South Delhi<br />New Delhi, 110019</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-primary shrink-0" size={18} />
                                <span>+91-6203898793</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-primary shrink-0" size={18} />
                                <span>vinayakchoubey@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-wider">Join Community</h4>
                        <p className="text-gray-400 text-sm mb-4">Connect with us on social media for updates.</p>

                        <div className="flex gap-4 mb-6">
                            {/* WhatsApp */}
                            <a
                                href="https://chat.whatsapp.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-green-500/50"
                                aria-label="Join WhatsApp Group"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>

                            {/* Instagram */}
                            <a
                                href="https://instagram.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center w-10 h-10 rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-pink-500/50"
                                aria-label="Join Instagram Group"
                            >
                                <Instagram size={20} />
                            </a>
                        </div>

                        {/* Request Call Button */}
                        <Link
                            href="/contact"
                            className="bg-secondary/30 hover:bg-secondary/50 border border-white/10 hover:border-primary/50 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all group flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/10"
                        >
                            <Phone size={18} className="text-primary group-hover:rotate-12 transition-transform" />
                            <span>Request a Call</span>
                        </Link>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Dr Maths Institute. All rights reserved.</p>
                </div>
            </div>

            {/* Policy Modal */}
            <AnimatePresence>
                {selectedPolicy && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedPolicy(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-white/10 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-6 relative shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedPolicy(null)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b border-white/10 pb-4">
                                {selectedPolicy.title}
                            </h2>

                            <div
                                className="prose prose-invert max-w-none text-gray-300"
                                dangerouslySetInnerHTML={{ __html: selectedPolicy.content }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </footer>
    );
}

function SocialLink({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string, color?: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
        >
            <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className={`bg-secondary/20 p-2 rounded-full text-gray-400 transition-colors duration-300 ${color || 'hover:bg-primary'} hover:text-white shadow-lg cursor-pointer`}
                aria-label={label}
            >
                {icon}
            </motion.div>
        </a>
    );
}
