"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Quote } from 'lucide-react';

interface FeedbackCardProps {
    author: string;
    designation: string;
    company: string;
    content: React.ReactNode;
}

export default function FeedbackCard({ author, designation, company, content }: FeedbackCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="group relative bg-[#111]/80 border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:border-[#E31E24]/50 transition-colors duration-500 overflow-hidden flex flex-col h-full">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                <Quote size={120} />
            </div>

            <div className="flex flex-col flex-grow relative z-10">
                <div className="mb-6">
                    <Quote className="text-[#E31E24] w-8 h-8 opacity-80" />
                </div>

                <div className={`text-white/80 whitespace-pre-wrap leading-relaxed text-base ${!isExpanded ? 'line-clamp-6' : ''}`}>
                    {content}
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 flex items-center gap-2 text-[#E31E24] hover:text-white transition-colors text-sm font-bold uppercase tracking-wider self-start group/btn"
                >
                    {isExpanded ? 'Read Less' : 'Read More'}
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 group-hover/btn:-translate-y-1 transition-transform" />
                    ) : (
                        <ChevronDown className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform" />
                    )}
                </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-1 relative z-10">
                <h4 className="text-white font-bold text-lg">{author}</h4>
                <p className="text-white/60 text-sm">{designation}</p>
                <p className="text-[#E31E24] text-sm font-medium">{company}</p>
            </div>
        </div>
    );
}
