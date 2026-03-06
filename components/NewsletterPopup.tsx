"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [topic, setTopic] = useState('tech'); // default to 'tech'
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        // Do not show popup on admin routes
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
            return;
        }

        // Show after 10 seconds
        const timer = setTimeout(() => {
            // Check if user has already dismissed or subscribed (simple localStorage check)
            const hasSeenPopup = localStorage.getItem('hasSeenNewsletterPopup');
            if (!hasSeenPopup) {
                setIsOpen(true);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('hasSeenNewsletterPopup', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return;

        setStatus('loading');

        try {
            const { error } = await supabase.rpc('subscribe_email_list', {
                p_email: email,
                p_topic_interest: topic,
                p_source: 'newsletter popup',
                p_source_page: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
            });

            if (error) throw error;

            setStatus('success');
            localStorage.setItem('hasSeenNewsletterPopup', 'true');

            // Auto close after 3 seconds on success
            setTimeout(() => {
                setIsOpen(false);
            }, 3000);

        } catch (err) {
            console.error('Newsletter Subscription Error:', err);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Popup Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-[#111111] border border-white/10 p-8 rounded-2xl shadow-2xl"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                            aria-label="Close"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Stay Ahead of the Curve</h2>
                            <p className="text-white/60">
                                Do you want to learn about the latest tech updates or Learning Management Systems? Join our newsletter!
                            </p>
                        </div>

                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl text-center font-medium"
                            >
                                Thank you for subscribing! Keep an eye on your inbox.
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-white/80">
                                        Choose your main interest:
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setTopic('tech')}
                                            className={`p-3 rounded-xl border text-sm font-medium transition-all duration-300 ${topic === 'tech'
                                                ? 'bg-[#E31E24] border-[#E31E24] text-white'
                                                : 'bg-transparent border-white/20 text-white/60 hover:border-white/40'
                                                }`}
                                        >
                                            Tech Updates
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setTopic('lms')}
                                            className={`p-3 rounded-xl border text-sm font-medium transition-all duration-300 ${topic === 'lms'
                                                ? 'bg-[#E31E24] border-[#E31E24] text-white'
                                                : 'bg-transparent border-white/20 text-white/60 hover:border-white/40'
                                                }`}
                                        >
                                            LMS Insights
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-[#E31E24] transition-colors"
                                    />
                                </div>

                                {status === 'error' && (
                                    <p className="text-red-500 text-sm text-center">Failed to subscribe. Please try again later.</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-[#E31E24] hover:text-white transition-all duration-300 disabled:opacity-50"
                                >
                                    {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
