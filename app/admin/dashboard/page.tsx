'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, MousePointerClick, KanbanSquare, BarChart3, Plus, Trash2, StickyNote, FileText, Mail } from 'lucide-react';

interface TopPage {
    page_path: string;
    visit_count: number;
}

interface DailyVisit {
    date: string;
    count: number;
}

interface Note {
    id: string;
    content: string;
    created_at: string;
}

export default function AdminDashboardOverview() {
    const [totalLeads, setTotalLeads] = useState(0);
    const [totalPipelines, setTotalPipelines] = useState(0);
    const [uniqueVisitors, setUniqueVisitors] = useState(0);
    const [totalSubscribers, setTotalSubscribers] = useState(0);
    const [topPages, setTopPages] = useState<TopPage[]>([]);
    const [dailyVisits, setDailyVisits] = useState<DailyVisit[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState('');
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
                // Count unique visitors per page (distinct visitor_id per page_path)
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

            // Fetch daily visits for last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const { data: dailyData } = await supabase
                .from('page_visits')
                .select('created_at')
                .gte('created_at', thirtyDaysAgo.toISOString());
            if (dailyData) {
                const dayCounts: Record<string, number> = {};
                // Initialize all 30 days
                for (let i = 29; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const key = d.toISOString().split('T')[0];
                    dayCounts[key] = 0;
                }
                dailyData.forEach((v: { created_at: string }) => {
                    const key = v.created_at.split('T')[0];
                    if (dayCounts[key] !== undefined) {
                        dayCounts[key]++;
                    }
                });
                setDailyVisits(Object.entries(dayCounts).map(([date, count]) => ({ date, count })));
            }

            // Fetch admin notes
            const { data: notesData } = await supabase
                .from('admin_notes')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);
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

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        const { data, error } = await supabase
            .from('admin_notes')
            .insert({ content: newNote.trim() })
            .select()
            .single();
        if (!error && data) {
            setNotes([data, ...notes]);
            setNewNote('');
        }
    };

    const handleDeleteNote = async (id: string) => {
        setNotes(notes.filter(n => n.id !== id));
        await supabase.from('admin_notes').delete().eq('id', id);
    };

    const maxDailyCount = Math.max(...dailyVisits.map(d => d.count), 1);

    const cards = [
        { title: 'Total Active Leads', value: totalLeads.toString(), icon: Users, color: 'text-blue-500' },
        { title: 'Pipelines Configured', value: totalPipelines.toString(), icon: KanbanSquare, color: 'text-purple-500' },
        { title: 'Unique Visitors', value: uniqueVisitors.toLocaleString(), icon: MousePointerClick, color: 'text-emerald-500', note: 'All time' },
        { title: 'Email Subscribers', value: totalSubscribers.toLocaleString(), icon: Mail, color: 'text-[#E31E24]', note: 'Newsletter signups' },
    ];

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#0a0a0a] rounded-3xl border border-white/5">
                <div className="text-white/40 text-lg">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative">

            {/* Ambient Background Glow */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#E31E24]/5 to-transparent pointer-events-none" />

            <div className="flex-1 overflow-y-auto p-8 lg:p-12 z-10 space-y-12">

                <header>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back.</h1>
                    <p className="text-white/50 text-lg">Here&apos;s what&apos;s happening across Sponge Global today.</p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 tracking-tight">
                    {cards.map((c, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
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
                <div className="bg-[#111] border border-white/5 rounded-2xl p-8">
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

                {/* Main Content Grid: Chart + Notes */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">

                    {/* Engagement Overview Chart */}
                    <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-2xl p-8 min-h-[400px] flex flex-col flex-1">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-lg">Engagement Overview</h3>
                            <div className="text-xs font-bold px-3 py-1 bg-white/5 text-white/60 rounded-full">Last 30 Days</div>
                        </div>
                        <div className="flex-1 flex items-end gap-[3px] min-h-[250px]">
                            {dailyVisits.map((day, i) => {
                                const height = maxDailyCount > 0 ? (day.count / maxDailyCount) * 100 : 0;
                                const dateObj = new Date(day.date + 'T00:00:00');
                                const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                return (
                                    <div
                                        key={i}
                                        className="flex-1 flex flex-col items-center justify-end group relative"
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                            {label}: {day.count}
                                        </div>
                                        <div
                                            className="w-full bg-gradient-to-t from-[#E31E24] to-[#E31E24]/40 rounded-t-sm transition-all duration-300 hover:from-[#E31E24] hover:to-[#E31E24]/70 cursor-pointer"
                                            style={{ height: `${Math.max(height, 2)}%` }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-3 text-[10px] text-white/30">
                            <span>{dailyVisits.length > 0 ? new Date(dailyVisits[0].date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
                            <span>Today</span>
                        </div>
                    </div>

                    {/* Quick Notes */}
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-8 min-h-[400px] flex flex-col flex-1">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <StickyNote className="w-5 h-5 text-amber-500" />
                            Quick Notes
                        </h3>

                        {/* Add Note Form */}
                        <form onSubmit={handleAddNote} className="flex gap-2 mb-6">
                            <input
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add a note..."
                                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E31E24] placeholder:text-white/30 transition-colors"
                            />
                            <button
                                type="submit"
                                className="bg-[#E31E24] hover:bg-red-600 text-white p-2.5 rounded-lg transition-colors shrink-0"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </form>

                        {/* Notes List */}
                        <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-white/10">
                            {notes.length === 0 && (
                                <div className="flex-1 flex items-center justify-center text-white/20 text-sm py-10">
                                    No notes yet. Add one above!
                                </div>
                            )}
                            {notes.map(note => (
                                <div key={note.id} className="flex gap-3 items-start group bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-amber-500 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white/70 leading-relaxed">{note.content}</p>
                                        <p className="text-[11px] text-white/30 mt-1.5">
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

                </div>
            </div>
        </div>
    );
}