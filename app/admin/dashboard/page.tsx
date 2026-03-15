'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, MousePointerClick, KanbanSquare, BarChart3, Plus, Trash2, StickyNote, FileText, Mail, DollarSign, Briefcase, UserCheck } from 'lucide-react';

interface TopPage {
    page_path: string;
    visit_count: number;
}

interface Note {
    id: string;
    content: string;
    category: string;
    created_at: string;
}

export default function AdminDashboardOverview() {
    const [totalLeads, setTotalLeads] = useState(0);
    const [totalPipelines, setTotalPipelines] = useState(0);
    const [uniqueVisitors, setUniqueVisitors] = useState(0);
    const [totalSubscribers, setTotalSubscribers] = useState(0);
    const [topPages, setTopPages] = useState<TopPage[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNotes, setNewNotes] = useState<Record<string, string>>({ finance: '', general: '', client: '' });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        try {
            // Fetch leads count, pipelines count
            const [leadsRes, pipelinesRes] = await Promise.all([
                supabase.from('leads').select('*', { count: 'exact', head: true }),
                supabase.from('pipelines').select('*', { count: 'exact', head: true }),
            ]);
            setTotalLeads(leadsRes.count || 0);
            setTotalPipelines(pipelinesRes.count || 0);

            // Fetch email subscribers count
            const { count: subsCount } = await supabase
                .from('email_subscriptions')
                .select('*', { count: 'exact', head: true });
            setTotalSubscribers(subsCount || 0);

            // Fetch unique visitors (distinct visitor_id count)
            const { data: visitorsData } = await supabase
                .from('page_visits')
                .select('visitor_id');
            if (visitorsData) {
                const unique = new Set(visitorsData.map((v: { visitor_id: string }) => v.visitor_id));
                setUniqueVisitors(unique.size);
            }

            // Fetch top pages
            const { data: pagesData } = await supabase
                .from('page_visits')
                .select('page_path, visitor_id');
            if (pagesData) {
                const pageVisitors: Record<string, Set<string>> = {};
                pagesData.forEach((p: { page_path: string; visitor_id: string }) => {
                    if (!pageVisitors[p.page_path]) pageVisitors[p.page_path] = new Set();
                    pageVisitors[p.page_path].add(p.visitor_id);
                });
                const sorted = Object.entries(pageVisitors)
                    .map(([page_path, visitors]) => ({ page_path, visit_count: visitors.size }))
                    .sort((a, b) => b.visit_count - a.visit_count);
                setTopPages(sorted);
            }

            // Fetch admin notes (all categories)
            const { data: notesData } = await supabase
                .from('admin_notes')
                .select('*')
                .order('created_at', { ascending: false });
            setNotes(notesData || []);

        } catch (e) {
            console.error("Dashboard fetch error:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleAddNote = async (category: string, e: React.FormEvent) => {
        e.preventDefault();
        const content = newNotes[category]?.trim();
        if (!content) return;
        const { data, error } = await supabase
            .from('admin_notes')
            .insert({ content, category })
            .select()
            .single();
        if (!error && data) {
            setNotes([data, ...notes]);
            setNewNotes(prev => ({ ...prev, [category]: '' }));
        }
    };

    const handleDeleteNote = async (id: string) => {
        setNotes(notes.filter(n => n.id !== id));
        await supabase.from('admin_notes').delete().eq('id', id);
    };

    const cards = [
        { title: 'Total Active Leads', value: totalLeads.toString(), icon: Users, color: 'text-blue-500' },
        { title: 'Pipelines Configured', value: totalPipelines.toString(), icon: KanbanSquare, color: 'text-purple-500' },
        { title: 'Unique Visitors', value: uniqueVisitors.toLocaleString(), icon: MousePointerClick, color: 'text-emerald-500', note: 'All time' },
        { title: 'Email Subscribers', value: totalSubscribers.toLocaleString(), icon: Mail, color: 'text-[#E31E24]', note: 'Newsletter signups' },
    ];

    const noteColumns = [
        { key: 'finance', label: 'Finance', icon: DollarSign, color: 'text-emerald-400', dotColor: 'bg-emerald-400', borderColor: 'border-emerald-500/20' },
        { key: 'general', label: 'General', icon: StickyNote, color: 'text-amber-400', dotColor: 'bg-amber-400', borderColor: 'border-amber-500/20' },
        { key: 'client', label: 'Client', icon: UserCheck, color: 'text-blue-400', dotColor: 'bg-blue-400', borderColor: 'border-blue-500/20' },
    ];

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#0a0a0a] rounded-3xl border border-white/5">
                <div className="text-white/40 text-lg">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0a0a0a]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden relative">

            {/* Ambient Background Glow */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#E31E24]/10 to-transparent pointer-events-none" />

            <div className="flex-1 overflow-y-auto p-8 lg:p-12 z-10 space-y-12">

                <header>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back.</h1>
                    <p className="text-white/50 text-lg">Here&apos;s what&apos;s happening across Sponge Global today.</p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 tracking-tight">
                    {cards.map((c, i) => (
                        <div key={i} className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.2)] hover:bg-white/[0.05] transition-colors">
                            <div className={`absolute top-0 right-0 p-6 opacity-20 transition-transform group-hover:scale-110 group-hover:opacity-40 ${c.color}`}>
                                <c.icon className="w-16 h-16 -mr-4 -mt-4" />
                            </div>

                            <h3 className="text-sm font-semibold text-white/50 mb-4">{c.title}</h3>
                            <div className="text-4xl font-bold mb-2">{c.value}</div>
                            {c.note && (
                                <div className="text-xs text-white/40 flex items-center gap-1.5 mt-auto">
                                    <BarChart3 className="w-3 h-3" />
                                    <span>{c.note}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Page Views — Unique Visitors Per Page */}
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.2)]">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#E31E24]" />
                        Page Views
                        <span className="text-xs font-normal text-white/40 ml-2">Unique visitors per page</span>
                    </h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Home', path: '/' },
                            { name: 'About', path: '/about' },
                            { name: 'Services', path: '/services' },
                            { name: 'Our Clients', path: '/clients' },
                            { name: 'Contact', path: '/contact' },
                        ].map((page) => {
                            const match = topPages.find(tp => tp.page_path === page.path);
                            const count = match?.visit_count || 0;
                            const maxCount = Math.max(...topPages.map(tp => tp.visit_count), 1);
                            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                            return (
                                <div key={page.path} className="flex items-center gap-4">
                                    <div className="w-28 shrink-0 text-sm text-white/70 font-medium">{page.name}</div>
                                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#E31E24] to-[#E31E24]/50 rounded-full transition-all duration-700"
                                            style={{ width: `${Math.max(pct, count > 0 ? 3 : 0)}%` }}
                                        />
                                    </div>
                                    <div className="w-16 text-right text-sm font-bold text-white/50">{count}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Notes — 3 Columns: Finance, General, Client */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
                    {noteColumns.map((col) => {
                        const colNotes = notes.filter(n => n.category === col.key);
                        const Icon = col.icon;
                        return (
                            <div
                                key={col.key}
                                className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.2)]"
                                style={{ maxHeight: '500px' }}
                            >
                                <h3 className="font-bold text-base mb-4 flex items-center gap-2 shrink-0">
                                    <Icon className={`w-5 h-5 ${col.color}`} />
                                    {col.label}
                                    <span className="ml-auto text-xs font-medium text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{colNotes.length}</span>
                                </h3>

                                {/* Add Note Form */}
                                <form onSubmit={(e) => handleAddNote(col.key, e)} className="flex gap-2 mb-4 shrink-0">
                                    <input
                                        value={newNotes[col.key] || ''}
                                        onChange={(e) => setNewNotes(prev => ({ ...prev, [col.key]: e.target.value }))}
                                        placeholder={`Add ${col.label.toLowerCase()} note...`}
                                        className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E31E24] placeholder:text-white/30 transition-colors min-w-0"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[#E31E24] hover:bg-red-600 text-white p-2 rounded-lg transition-colors shrink-0"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </form>

                                {/* Notes List — Scrollable */}
                                <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                                    {colNotes.length === 0 && (
                                        <div className="flex items-center justify-center text-white/20 text-sm py-8">
                                            No {col.label.toLowerCase()} notes yet
                                        </div>
                                    )}
                                    {colNotes.map(note => (
                                        <div key={note.id} className="flex gap-2.5 items-start group bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                            <div className={`w-1.5 h-1.5 mt-2 rounded-full ${col.dotColor} shrink-0`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white/70 leading-relaxed break-words">{note.content}</p>
                                                <p className="text-[10px] text-white/30 mt-1">
                                                    {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteNote(note.id)}
                                                className="p-1 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}