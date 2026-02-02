"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, MessageSquare, Reply } from "lucide-react";
import Link from "next/link";

interface Message {
    _id: string;
    name: string;
    email: string;
    message: string;
    reply: string;
    status: string;
    createdAt: string;
}

export default function UserMessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) return;

                const token = localStorage.getItem("token");

                const { data } = await axios.get("http://127.0.0.1:5000/api/messages/my-messages", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <MessageSquare className="text-primary" />
                Messages & Support
            </h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin w-10 h-10 text-primary" />
                </div>
            ) : (
                <div className="space-y-6">
                    {messages.length === 0 ? (
                        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-white/10">
                            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
                            <p className="text-gray-400 mb-6">Have a question? Send us a message and we'll get back to you.</p>
                            <Link
                                href="/contact"
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-medium transition-colors"
                            >
                                Contact Support
                            </Link>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg._id} className="bg-card border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-lg text-white">Your Inquiry</h3>
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${msg.status === 'replied' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {msg.status === 'replied' ? 'Replied' : 'Pending'}
                                    </span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg mb-4">
                                    <p className="text-gray-300">{msg.message}</p>
                                </div>

                                {msg.reply && (
                                    <div className="ml-4 md:ml-8 border-l-2 border-green-500 pl-4 mt-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Reply className="w-4 h-4 text-green-500" />
                                            <p className="text-sm text-green-400 font-bold uppercase tracking-wider">Admin Response</p>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed">{msg.reply}</p>
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-white/5 text-right w-full">
                                    Sent on {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
