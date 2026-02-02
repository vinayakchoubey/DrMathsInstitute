"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2, Bot } from "lucide-react";

export default function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
        { role: 'model', text: "Hello! I am your AI assistant for Dr. Maths Institute. I can answer questions based on the course materials. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput("");
        setLoading(true);

        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/rag/chat`, {
                query: userMessage,
            });

            setMessages(prev => [...prev, { role: 'model', text: data.answer }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I am having trouble connecting to the document base right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end print:hidden">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", bounce: 0.3 }}
                        className="bg-card border border-white/10 rounded-2xl shadow-2xl w-80 sm:w-[400px] overflow-hidden mb-4 flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2 text-white">
                                <Bot size={24} />
                                <div>
                                    <div className="font-bold text-sm">Dr.Bot</div>
                                    <div className="text-[10px] opacity-80">RAG Powered Assistant</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/90 scrollbar-thin scrollbar-thumb-blue-500/30">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-slate-800 text-gray-200 border border-white/10 rounded-tl-none'
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-blue-400" />
                                        <span className="text-xs text-gray-400">Consulting documents...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-white/10 flex items-center gap-2 shrink-0">
                            <input
                                placeholder="Ask about the course..."
                                className="bg-slate-800/50 text-white border border-white/10 rounded-xl px-4 py-3 w-full text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="bg-primary text-white p-4 rounded-full shadow-lg shadow-primary/25 flex items-center justify-center group relative border-4 border-background"
                >
                    <MessageSquare size={28} className="fill-current" />
                </motion.button>
            )}
        </div>
    );
}

