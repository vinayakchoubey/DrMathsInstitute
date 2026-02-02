"use client";

import { MapPin, Phone, Mail, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export default function ContactPage() {
    const [formState, setFormState] = useState({ name: "", email: "", contactNumber: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const user = localStorage.getItem("user");
            const userId = user ? JSON.parse(user)._id : null;

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/messages`, {
                ...formState,
                userId
            });

            alert("Message sent successfully!");
            setFormState({ name: "", email: "", contactNumber: "", message: "" });
        } catch (error) {
            console.error("Failed to send message", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-400 mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Contact Info & Map */}
                    <div className="space-y-12">
                        <div className="grid gap-8">
                            <ContactCard
                                icon={<MapPin className="w-6 h-6" />}
                                title="Visit Us"
                                content="K-80A Kalkaji New Delhi , Pincode 110019"
                                color="bg-blue-500/10 text-blue-500"
                            />
                            <ContactCard
                                icon={<Phone className="w-6 h-6" />}
                                title="Call Us"
                                content="+91-6203898793"
                                color="bg-green-500/10 text-green-500"
                            />
                            <ContactCard
                                icon={<Mail className="w-6 h-6" />}
                                title="Email Us"
                                content="vinayakchoubey123@gmail.com"
                                color="bg-purple-500/10 text-purple-500"
                            />
                        </div>

                        {/* Map Placeholder or Actual Map link */}
                        {/* Map Embed */}
                        <div className="w-full h-80 bg-secondary/30 rounded-2xl border border-white/10 overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.603378546949!2d77.2536893!3d28.5290666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce1707018d96d%3A0x673f8a02c914619a!2sK-80A%2C%20Kalkaji%2C%20New%20Delhi%2C%20Delhi%20110019!5e0!3m2!1sen!2sin!4v1715000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-card border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <MessageSquare className="text-primary" />
                                <h2 className="text-2xl font-bold">Send Message</h2>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="Vinayak Choubey"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="vinayakchoubey123@gmail.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Contact Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={formState.contactNumber}
                                    onChange={(e) => setFormState({ ...formState, contactNumber: e.target.value })}
                                    className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="+91-1234567890"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formState.message}
                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                    className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 group"
                            >
                                {isSubmitting ? "Sending..." : (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactCard({ icon, title, content, color }: { icon: React.ReactNode, title: string, content: string, color: string }) {
    return (
        <div className="flex items-center gap-6 p-6 rounded-2xl bg-card border border-white/5 hover:border-white/10 transition-colors">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-lg mb-1">{title}</h3>
                <p className="text-gray-400 font-medium">{content}</p>
            </div>
        </div>
    );
}

