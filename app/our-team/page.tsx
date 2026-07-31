"use client";

import React, { useEffect, useState, useMemo } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Filter, Sparkles, ArrowUpRight, Search, ShieldCheck, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    description: string;
    image_url?: string | null;
    tag: string;
    sort_order?: number;
}

// Fallback initial team members displayed if database table is empty or offline
const FALLBACK_TEAM_MEMBERS: TeamMember[] = [
    {
        id: '1',
        name: 'Dr. Amila Jayasinghe',
        role: 'Lead Training Strategist',
        tag: 'Communication',
        description: 'Specializing in corporate communication architecture, executive leadership capability building, and high-impact organizational performance transformation.',
        image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '2',
        name: 'Kavinda Senanayake',
        role: 'Head of Executive Coaching',
        tag: 'Leadership',
        description: 'Over 15 years of experience scaling high-performing enterprise teams, cross-cultural management, and C-suite mentorship across South Asia.',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '3',
        name: 'Nimesha Perera',
        role: 'Senior Talent Architect',
        tag: 'Strategy',
        description: 'Expert in custom competency framework design, capability assessments, and workforce optimization for global organizations.',
        image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '4',
        name: 'Tharindu Fernando',
        role: 'Digital Experience Lead',
        tag: 'Tech & Innovation',
        description: 'Leading digital learning platforms, AI-driven learning widgets, and interactive capability simulation modules for modern enterprise workforce development.',
        image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '5',
        name: 'Dilhara Wickramasinghe',
        role: 'Corporate Relations Specialist',
        tag: 'Communication',
        description: 'Fostering strategic partnerships and aligning corporate learning initiatives with measurable business metrics and ROI.',
        image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '6',
        name: 'Sanjeewa Rajapaksha',
        role: 'Operations & Quality Lead',
        tag: 'Operations',
        description: 'Ensuring seamless global delivery of training workshops, learning management systems, and client satisfaction excellence.',
        image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800'
    }
];

export default function OurTeamPage() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: true });

            if (error || !data || data.length === 0) {
                // Use fallback dataset if table isn't created or empty
                setTeamMembers(FALLBACK_TEAM_MEMBERS);
            } else {
                setTeamMembers(data);
            }
        } catch {
            setTeamMembers(FALLBACK_TEAM_MEMBERS);
        } finally {
            setLoading(false);
        }
    };

    // Extract all unique tags dynamically
    const allTags = useMemo(() => {
        const tagsSet = new Set<string>();
        tagsSet.add('All');
        teamMembers.forEach(member => {
            if (member.tag && member.tag.trim() !== '') {
                tagsSet.add(member.tag.trim());
            }
        });
        return Array.from(tagsSet);
    }, [teamMembers]);

    // Filter members according to tag selection and search query
    const filteredMembers = useMemo(() => {
        return teamMembers.filter(member => {
            const matchesTag = selectedTag === 'All' || member.tag?.toLowerCase() === selectedTag.toLowerCase();
            const matchesSearch = searchQuery === '' || 
                member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.tag.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTag && matchesSearch;
        });
    }, [teamMembers, selectedTag, searchQuery]);

    const handleImageError = (id: string) => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white pt-28 pb-24 px-6 md:px-12 lg:px-24 overflow-hidden relative selection:bg-[#E31E24] selection:text-white">
            {/* Background Ambient Glows */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#E31E24]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />

            <div className="max-w-[1400px] mx-auto space-y-16">

                {/* Hero Header */}
                <div className="flex flex-col gap-6 max-w-4xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#E31E24] text-xs font-semibold uppercase tracking-widest w-fit backdrop-blur-md"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>The Minds Behind Sponge Global</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
                    >
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60">Team</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-white/70 leading-relaxed font-normal"
                    >
                        Meet our accomplished team of capability architects, leadership strategists, and domain specialists dedicated to transforming organizational performance and talent growth.
                    </motion.p>
                </div>

                {/* Filter Bar & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-y border-white/10 py-6">
                    {/* Tags Filter Buttons */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        <span className="text-white/40 text-xs font-semibold uppercase tracking-wider mr-2 hidden sm:inline-flex items-center gap-1.5 shrink-0">
                            <Filter className="w-3.5 h-3.5" /> Filter by Niche:
                        </span>
                        {allTags.map((tag) => {
                            const isSelected = selectedTag === tag;
                            return (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                                        isSelected 
                                            ? 'text-white font-semibold' 
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {isSelected && (
                                        <motion.div
                                            layoutId="active-team-tag"
                                            className="absolute inset-0 bg-[#E31E24] rounded-xl shadow-lg shadow-[#E31E24]/30"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{tag}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Input */}
                    <div className="relative min-w-[240px] md:w-72">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search by name, role or tag..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24] transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Team Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-96 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : filteredMembers.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-white/[0.02] border border-white/5 rounded-3xl">
                        <Users className="w-12 h-12 text-white/20" />
                        <h3 className="text-xl font-semibold text-white/80">No team members found</h3>
                        <p className="text-sm text-white/50 max-w-md">
                            No team members match the filter "{selectedTag}"{searchQuery ? ` and search query "${searchQuery}"` : ''}.
                        </p>
                        <button
                            onClick={() => { setSelectedTag('All'); setSearchQuery(''); }}
                            className="mt-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredMembers.map((member, index) => {
                                const hasImage = member.image_url && !imageErrors[member.id];
                                return (
                                    <motion.div
                                        key={member.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        className="group relative bg-[#0a0a0a] border border-white/10 hover:border-[#E31E24]/50 rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-[#E31E24]/10"
                                    >
                                        {/* Image Header Container */}
                                        <div className="relative w-full h-72 overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-950 flex items-center justify-center">
                                            {hasImage ? (
                                                <NextImage
                                                    src={member.image_url!}
                                                    alt={member.name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                                                    onError={() => handleImageError(member.id)}
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#111111] to-[#E31E24]/20 p-6 text-center">
                                                    <div className="w-20 h-20 rounded-2xl bg-[#E31E24]/20 border border-[#E31E24]/30 flex items-center justify-center text-2xl font-bold text-[#E31E24] shadow-inner mb-3">
                                                        {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                                    </div>
                                                    <span className="text-xs text-white/40 uppercase tracking-widest">Sponge Global</span>
                                                </div>
                                            )}

                                            {/* Gradient overlay for text readability at bottom of photo */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />

                                            {/* Tag Badge */}
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium tracking-wide">
                                                    {member.tag}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
                                            <div className="space-y-2">
                                                <div className="text-xs font-semibold uppercase tracking-wider text-[#E31E24]">
                                                    {member.role}
                                                </div>
                                                <h3 className="text-2xl font-bold text-white group-hover:text-white transition-colors">
                                                    {member.name}
                                                </h3>
                                                <p className="text-sm text-white/70 leading-relaxed font-normal pt-1">
                                                    {member.description}
                                                </p>
                                            </div>

                                            {/* Bottom accent border/action */}
                                            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                                                <span className="flex items-center gap-1.5">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-[#E31E24]" /> Verified Expert
                                                </span>
                                                <Link 
                                                    href="/contact" 
                                                    className="inline-flex items-center gap-1 text-white/60 group-hover:text-[#E31E24] transition-colors font-medium"
                                                >
                                                    Connect <ArrowUpRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Bottom Call to Action */}
                <div className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-white/[0.03] via-white/[0.06] to-white/[0.02] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="space-y-3 text-center md:text-left z-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Looking to empower your corporate team?</h2>
                        <p className="text-sm md:text-base text-white/60 max-w-xl">
                            Our team of domain experts can customize capability frameworks, workshops, and transformation programs tailored to your organization.
                        </p>
                    </div>
                    <Link
                        href="/contact"
                        className="px-8 py-4 bg-[#E31E24] hover:bg-[#c9181d] text-white font-semibold rounded-2xl transition-all shadow-lg shadow-[#E31E24]/25 hover:shadow-[#E31E24]/40 shrink-0 z-10 flex items-center gap-2"
                    >
                        <Mail className="w-4 h-4" />
                        <span>Get in Touch</span>
                    </Link>
                    <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#E31E24]/10 rounded-full blur-[100px] pointer-events-none" />
                </div>

            </div>
        </main>
    );
}
