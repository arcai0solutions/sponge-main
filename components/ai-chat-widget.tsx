"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

// We now use react-markdown for rich text parsing instead of regex matching

export function AiChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Auto-open on desktop devices after a short delay
        if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm the Sponge Global AI. How can I help you transform your workforce today?",
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [sessionId] = useState(() => {
        // Generate a simple unique ID for the session when the component mounts
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic
    useEffect(() => {
        if (messages.length === 0) return;
        const lastMsg = messages[messages.length - 1];

        if (isLoading) {
            // Scroll to the loading indicator
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (lastMsg.role === "assistant" && messages.length > 1) {
            // Scroll to the top of the new assistant message to start reading
            const element = document.getElementById(`message-${lastMsg.id}`);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        } else {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isLoading) return;

        setError(null);

        // Add user message
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: trimmedInput,
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            // Prepare API payload (exclude the welcome message to save tokens if desired, but including it helps set context)
            const apiMessages = [...messages, userMessage].map(msg => ({
                role: msg.role,
                content: msg.content,
            }));

            // Call API
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: apiMessages, sessionId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            // Add assistant message
            setMessages(prev => [...prev, {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: data.content,
            }]);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] flex flex-col overflow-hidden rounded-2xl
                       bg-black/70 backdrop-blur-2xl border border-white/20 
                       shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20 p-1">
                                    <NextImage src="/sponge-favicon.png" alt="Sponge AI" width={32} height={32} className="object-contain" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm tracking-wide">Sponge AI</h3>
                                    <p className="text-white/60 text-xs">Learning Development Partner</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div
                            className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                            data-lenis-prevent="true"
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                        >
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    id={`message-${msg.id}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${msg.role === "user"
                                            ? "bg-[#E31E24] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
                                            : "bg-white text-black shadow-[0_4px_15px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.8)]"
                                            }`}
                                    >
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                a: ({ node, ...props }) => (
                                                    <a {...props} target="_blank" rel="noopener noreferrer" className={`font-medium hover:underline break-all ${msg.role === "user" ? "text-[#FFD700]" : "text-[#E31E24]"}`} />
                                                ),
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 last:mb-0" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2 last:mb-0" {...props} />,
                                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl px-5 py-4 flex gap-2 items-center">
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-white/60" />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-white/60" />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-white/60" />
                                    </div>
                                </motion.div>
                            )}

                            {error && (
                                <div className="text-[#E31E24] text-xs text-center p-2 bg-red-900/20 rounded-lg border border-red-500/30">
                                    {error}
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-black/40">
                            <form onSubmit={handleSubmit} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 pr-12 text-white text-sm focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/40"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#E31E24] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </form>

                            {/* ARC AI Branding */}
                            <div className="mt-2 text-center">
                                <span className="text-white/40 text-[10px] uppercase font-medium tracking-wider">
                                    Powered by <a href="https://www.arcai.agency" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors underline decoration-white/20 hover:decoration-white/60">ARC AI</a>
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button Container for Pulse Effect */}
            <div className="relative">
                {/* Pulsing ring behind the button (only pulsing when closed) */}
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.4, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 rounded-full bg-[#E31E24]"
                        />
                    )}
                </AnimatePresence>

                {/* Main Toggle Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center overflow-hidden
                       transition-all duration-300 z-10
                       ${isOpen
                            ? 'bg-[#111] rotate-90 scale-90 border border-white/20 shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                            : 'bg-[radial-gradient(circle_at_center,_#000000_25%,_#E31E24_90%)] shadow-[0_10px_25px_rgba(227,30,36,0.6),inset_0_2px_10px_rgba(255,255,255,0.2),inset_0_-6px_12px_rgba(255,0,0,0.5)] border border-[#ff474d]/30 hover:shadow-[0_15px_30px_rgba(227,30,36,0.7),inset_0_2px_10px_rgba(255,255,255,0.3),inset_0_-6px_12px_rgba(255,0,0,0.6)]'
                        }`}
                >
                    {/* Inner highlight for 3D glassy effect on the red button */}
                    {!isOpen && (
                        <div className="absolute top-0 left-[15%] right-[15%] h-[35%] bg-gradient-to-b from-white/40 to-transparent rounded-[100%] pointer-events-none opacity-60" />
                    )}

                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.svg
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <path d="M18 6L6 18M6 6l12 12" />
                            </motion.svg>
                        ) : (
                            <motion.div
                                key="icon"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                className="w-8 h-8 flex items-center justify-center p-1 relative z-10"
                            >
                                <NextImage src="/sponge-favicon.png" alt="Chat" width={28} height={28} className="object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
                                {/* Red notification dot on the icon itself */}
                                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#ff474d] border-2 border-[#b31419] rounded-full shadow-[0_0_5px_rgba(255,0,0,0.5)]" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </div>
    );
}
