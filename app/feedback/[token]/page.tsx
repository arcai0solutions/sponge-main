"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function FeedbackSubmissionPage() {
    const params = useParams();
    const token = params.token as string;

    const [author, setAuthor] = useState('');
    const [company, setCompany] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!author.trim() || !content.trim()) return;

        setStatus('submitting');
        setErrorMsg('');

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, author: author.trim(), company: company.trim(), content: content.trim() }),
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                setErrorMsg(data.error || data.message || 'Something went wrong.');
                setStatus('error');
            } else {
                setStatus('success');
            }
        } catch {
            setErrorMsg('Network error. Please try again.');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#E31E24]/5 rounded-full blur-[150px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-2xl relative z-10"
            >
                {/* Logo & Title */}
                <div className="text-center mb-10">
                    <img
                        src="/new-logo.jpeg"
                        alt="Sponge Global"
                        className="w-16 h-16 rounded-2xl mx-auto mb-6 shadow-lg"
                    />
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                        Share Your <span className="text-[#E31E24]">Feedback</span>
                    </h1>
                    <p className="text-white/50 text-base max-w-md mx-auto">
                        We'd love to hear about your experience working with Sponge Global. Your feedback helps us grow.
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {status === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#111]/80 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-xl"
                        >
                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3">Thank You!</h2>
                            <p className="text-white/50 max-w-sm mx-auto">
                                Your feedback has been submitted successfully. We truly appreciate you taking the time to share your experience.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            onSubmit={handleSubmit}
                            className="bg-[#111]/80 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-xl space-y-6"
                        >
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wider">
                                    Your Name <span className="text-[#E31E24]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="e.g. John Smith"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-[#E31E24]/50 focus:ring-1 focus:ring-[#E31E24]/30 transition-all"
                                />
                            </div>

                            {/* Company Field */}
                            <div>
                                <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wider">
                                    Company / Organization
                                </label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    placeholder="e.g. Acme Corporation"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-[#E31E24]/50 focus:ring-1 focus:ring-[#E31E24]/30 transition-all"
                                />
                            </div>

                            {/* Feedback Content */}
                            <div>
                                <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wider">
                                    Your Feedback <span className="text-[#E31E24]">*</span>
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Tell us about your experience..."
                                    required
                                    rows={8}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-[#E31E24]/50 focus:ring-1 focus:ring-[#E31E24]/30 transition-all resize-none"
                                />
                            </div>

                            {/* Error Message */}
                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                    <span className="text-red-400 text-sm">{errorMsg}</span>
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={status === 'submitting' || !author.trim() || !content.trim()}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#E31E24] hover:bg-[#c71a1f] text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base tracking-wide"
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
