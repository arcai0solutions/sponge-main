"use client";

import { motion } from 'framer-motion';
import React, { useState } from 'react';

export default function ContactForm() {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formState);
        alert('Thank you for your message. We will get back to you shortly.');
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
                            <a href="mailto:hello@sponge-global.com" className="text-2xl md:text-3xl hover:text-[#E31E24] transition-colors">hello@sponge-global.com</a>
                        </div>
                        <div>
                            <span className="block text-sm text-[#E31E24] font-bold uppercase tracking-wider mb-2">Office</span>
                            <p className="text-xl text-white/80">
                                123 Business Avenue, <br />
                                Colombo 03, Sri Lanka
                            </p>
                        </div>
                        <div>
                            <span className="block text-sm text-[#E31E24] font-bold uppercase tracking-wider mb-2">Phone</span>
                            <a href="tel:+94112345678" className="text-xl text-white/80 hover:text-[#E31E24] transition-colors">+94 11 234 5678</a>
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
                    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
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

                        <button
                            type="submit"
                            className="group mt-8 self-start px-12 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-[#E31E24] hover:text-white transition-all duration-300 flex items-center gap-3"
                        >
                            <span>Send Message</span>
                            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </button>
                    </form>
                </motion.div>

            </div>
        </section>
    );
}
