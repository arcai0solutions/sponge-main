"use client";

import { motion } from 'framer-motion';
import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactForm() {
    const form = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        company: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        // TODO: Replace with your actual EmailJS credentials
        // You can find these in your EmailJS dashboard: https://dashboard.emailjs.com/admin
        const SERVICE_ID = 'service_xikrthn';
        const TEMPLATE_ID = 'template_en0xkze';
        const PUBLIC_KEY = 'I3owt6y6776PbjgUy';

        try {
            // Mapping form state to EmailJS variables
            // Ensure your EmailJS template uses these variable names:
            // {{from_name}}, {{from_email}}, {{company}}, {{message}}
            const templateParams = {
                from_name: formState.name,
                from_email: formState.email,
                company: formState.company,
                message: formState.message,
            };

            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

            setStatus('success');
            setFormState({
                name: '',
                email: '',
                company: '',
                message: ''
            });
            setTimeout(() => setStatus('idle'), 5000); // Reset success message after 5 seconds
        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-black text-white pb-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col gap-12"
                >
                    <div className="space-y-6">
                        <h3 className="text-2xl font-medium">Contact Information</h3>
                        <p className="text-white/60 text-lg leading-relaxed max-w-md">
                            Ready to transform your organization? Reach out to us for a consultation or to discuss your specific needs.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <span className="block text-sm text-[#E31E24] font-bold uppercase tracking-wider mb-2">Email</span>
                            <a href="mailto:info@spongeglobal.com" className="text-2xl md:text-3xl hover:text-[#E31E24] transition-colors">info@spongeglobal.com</a>
                        </div>
                        <div>
                            <span className="block text-sm text-[#E31E24] font-bold uppercase tracking-wider mb-2">Office</span>
                            <p className="text-xl text-white/80">
                                Colombo 5, Sri Lanka
                            </p>
                        </div>
                        <div>
                            <span className="block text-sm text-[#E31E24] font-bold uppercase tracking-wider mb-2">Phone</span>
                            <a href="tel:0112408671" className="text-xl text-white/80 hover:text-[#E31E24] transition-colors">0112408671</a>
                        </div>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <form ref={form} onSubmit={handleSubmit} className="flex flex-col gap-10">
                        <div className="group relative">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formState.name}
                                onChange={handleChange}
                                required
                                className="peer w-full bg-transparent border-b border-white/20 py-4 text-xl outline-none focus:border-[#E31E24] transition-all duration-300 placeholder-transparent"
                                placeholder="Your Name"
                            />
                            <label
                                htmlFor="name"
                                className="absolute left-0 top-4 text-white/50 text-xl transition-all duration-300 -translate-y-8 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-75 cursor-text"
                            >
                                Your Name
                            </label>
                        </div>
                        <div className="group relative">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formState.email}
                                onChange={handleChange}
                                required
                                className="peer w-full bg-transparent border-b border-white/20 py-4 text-xl outline-none focus:border-[#E31E24] transition-all duration-300 placeholder-transparent"
                                placeholder="Email Address"
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-0 top-4 text-white/50 text-xl transition-all duration-300 -translate-y-8 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-75 cursor-text"
                            >
                                Email Address
                            </label>
                        </div>
                        <div className="group relative">
                            <input
                                type="text"
                                name="company"
                                id="company"
                                value={formState.company}
                                onChange={handleChange}
                                className="peer w-full bg-transparent border-b border-white/20 py-4 text-xl outline-none focus:border-[#E31E24] transition-all duration-300 placeholder-transparent"
                                placeholder="Company (Optional)"
                            />
                            <label
                                htmlFor="company"
                                className="absolute left-0 top-4 text-white/50 text-xl transition-all duration-300 -translate-y-8 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-75 cursor-text"
                            >
                                Company (Optional)
                            </label>
                        </div>
                        <div className="group relative">
                            <textarea
                                name="message"
                                id="message"
                                value={formState.message}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="peer w-full bg-transparent border-b border-white/20 py-4 text-xl outline-none focus:border-[#E31E24] transition-all duration-300 placeholder-transparent resize-none"
                                placeholder="Tell us about your project"
                            />
                            <label
                                htmlFor="message"
                                className="absolute left-0 top-4 text-white/50 text-xl transition-all duration-300 -translate-y-8 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-75 cursor-text"
                            >
                                Tell us about your project
                            </label>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group mt-8 self-start px-12 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-[#E31E24] hover:text-white transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{loading ? 'Sending...' : 'Send Message'}</span>
                                {!loading && (
                                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                )}
                            </button>

                            {status === 'success' && (
                                <p className="text-green-500 font-medium animate-fade-in">It has been sent, thank you!</p>
                            )}
                            {status === 'error' && (
                                <p className="text-red-500 font-medium animate-fade-in">Something went wrong. Please try again.</p>
                            )}
                        </div>
                    </form>
                </motion.div>

            </div>
        </section>
    );
}
