"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Clock, Download, Users, Lightbulb, GraduationCap } from 'lucide-react';

interface EmailSubscription {
    id: string;
    email: string;
    topic_interest: string;
    source: string;
    source_page: string;
    subscribed_at: string;
}

export default function SubscribersArchivePage() {
    const [subscribers, setSubscribers] = useState<EmailSubscription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('email_subscriptions')
            .select('*')
            .order('subscribed_at', { ascending: false });

        if (error) {
            console.error('Error fetching subscribers:', error);
        } else {
            setSubscribers(data || []);
        }
        setLoading(false);
    };

    // Helper: download CSV function
    const downloadCSV = () => {
        if (subscribers.length === 0) return;

        const headers = ['Email', 'Topic', 'Source', 'Page', 'Subscribed At'];
        const csvRows = [headers.join(',')];

        subscribers.forEach(sub => {
            csvRows.push([
                sub.email,
                sub.topic_interest,
                sub.source,
                sub.source_page || 'N/A',
                new Date(sub.subscribed_at).toISOString()
            ].join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `SpongeGlobal_Subscribers_${new Date().toISOString().split('T')[0]}.csv`);
        a.click();
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0a0a0a]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden relative">
            {/* Header section */}
            <div className="px-8 py-8 md:px-12 md:py-10 border-b border-white/10 shrink-0 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-8 h-8 text-[#E31E24]" />
                        <h1 className="text-3xl font-bold tracking-tight">Email Newsletter</h1>
                    </div>
                    <p className="text-white/50 text-base max-w-2xl">
                        A list of all users who subscribed via the frontend newsletter popup.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={downloadCSV}
                        disabled={subscribers.length === 0}
                        className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all font-medium disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                    <div className="bg-[#E31E24]/10 border border-[#E31E24]/20 rounded-xl px-6 py-3 flex flex-col items-center shrink-0">
                        <div className="text-2xl font-bold text-[#E31E24]">{subscribers.length}</div>
                        <div className="text-[10px] font-bold text-[#E31E24]/70 uppercase tracking-widest leading-tight">Total</div>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto p-4 md:p-8">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-white/50 animate-pulse">Loading subscriber list...</div>
                ) : subscribers.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] backdrop-blur-md">
                        <Users className="w-16 h-16 text-white/20 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">No subscribers yet</h3>
                        <p className="text-white/40 max-w-sm">When users subscribe via the frontend newsletter popup, they will appear here.</p>
                    </div>
                ) : (
                    <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.2)]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.04] border-b border-white/10 uppercase text-xs font-bold tracking-wider text-white/40">
                                        <th className="p-5">Subscriber Email</th>
                                        <th className="p-5">Selected Interest</th>
                                        <th className="p-5">Acquisition Source</th>
                                        <th className="p-5 text-right w-40">Date Subscribed</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {subscribers.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">

                                            {/* Column 1: Email */}
                                            <td className="p-5 align-middle">
                                                <div className="font-medium text-base text-white flex items-center gap-3">
                                                    <Mail className="w-4 h-4 text-white/30 group-hover:text-[#E31E24] transition-colors" />
                                                    {sub.email}
                                                </div>
                                            </td>

                                            {/* Column 2: Topic */}
                                            <td className="p-5 align-middle">
                                                {sub.topic_interest === 'tech' ? (
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
                                                        <Lightbulb className="w-3.5 h-3.5" />
                                                        Tech Updates
                                                    </div>
                                                ) : sub.topic_interest === 'lms' ? (
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                                                        <GraduationCap className="w-3.5 h-3.5" />
                                                        LMS Insights
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-white/60 border border-white/10 text-xs font-bold uppercase tracking-wider capitalize">
                                                        {sub.topic_interest}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Column 3: Source */}
                                            <td className="p-5 align-middle">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-white/70 capitalize font-medium">{sub.source}</span>
                                                    {sub.source_page && sub.source_page !== 'unknown' && (
                                                        <span className="text-[11px] text-white/30 font-mono bg-black/50 px-2 py-0.5 rounded w-fit border border-white/5">
                                                            {sub.source_page}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Column 4: Time */}
                                            <td className="p-5 align-middle text-right">
                                                <div className="flex items-center justify-end gap-2 text-xs text-white/50 font-medium">
                                                    <Clock className="w-3.5 h-3.5 opacity-50" />
                                                    <span>{new Date(sub.subscribed_at).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
