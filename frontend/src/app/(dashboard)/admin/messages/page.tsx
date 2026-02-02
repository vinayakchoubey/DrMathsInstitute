"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Mail, MessageSquare, Reply, CheckCircle, Phone, Trash2 } from "lucide-react";

interface Message {
    _id: string;
    name: string;
    email: string;
    message: string;
    reply: string;
    status: string;
    contactNumber?: string;
    createdAt: string;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyingId, setReplyingId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [sendingReply, setSendingReply] = useState(false);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleReply = async (id: string) => {
        setSendingReply(true);
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/messages/${id}/reply`,
                { reply: replyText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Reply sent successfully!");
            setReplyingId(null);
            setReplyText("");
            fetchMessages(); // Refresh list to show updated status
        } catch (error) {
            console.error("Failed to send reply", error);
            alert("Failed to send reply");
        } finally {
            setSendingReply(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(messages.filter(m => m._id !== id));
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Failed to delete message");
        }
    };

    return (
        <div className="p-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
                    Messages & Inquiries
                </h1>
                <p className="text-gray-400 max-w-xl mx-auto">
                    Manage incoming user questions, support requests, and feedback.
                </p>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto mt-6 rounded-full shadow-lg shadow-blue-500/20" />
            </div>

            {loading ? (
                <Loader2 className="animate-spin w-8 h-8 mx-auto" />
            ) : (
                <div className="space-y-6">
                    {messages.length === 0 ? (
                        <p className="text-gray-500">No messages found.</p>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg._id} className="bg-card border border-white/10 rounded-xl p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{msg.name}</h3>
                                            <p className="text-sm text-gray-400">{msg.email}</p>
                                            {msg.contactNumber && (
                                                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                                                    <Phone size={12} /> {msg.contactNumber}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${msg.status === 'replied' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            {msg.status === 'replied' ? 'Replied' : 'Pending'}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(msg._id)}
                                            className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                            title="Delete Message"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="ml-13 pl-13 bg-white/5 rounded-lg p-4 mb-4">
                                    <p className="text-gray-300">{msg.message}</p>
                                    <p className="text-xs text-gray-500 mt-2 text-right">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                {msg.reply && (
                                    <div className="ml-13 pl-13 border-l-2 border-green-500/50 pl-4 mb-4">
                                        <p className="text-xs text-green-500 font-bold mb-1 flex items-center gap-2">
                                            <CheckCircle size={12} /> Admin Reply
                                        </p>
                                        <p className="text-gray-400 text-sm">{msg.reply}</p>
                                    </div>
                                )}

                                {msg.status !== 'replied' && (
                                    <div className="mt-4">
                                        {replyingId === msg._id ? (
                                            <div className="space-y-3">
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    className="w-full bg-background border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"
                                                    placeholder="Type your reply here..."
                                                    rows={3}
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleReply(msg._id)}
                                                        disabled={sendingReply || !replyText.trim()}
                                                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                                                    >
                                                        {sendingReply ? <Loader2 className="animate-spin w-4 h-4" /> : <SendIcon />}
                                                        Send Reply
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setReplyingId(null);
                                                            setReplyText("");
                                                        }}
                                                        className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setReplyingId(msg._id)}
                                                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 font-medium"
                                            >
                                                <Reply size={16} /> Reply
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function SendIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
    )
}

