"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, Clock, CheckCircle, XCircle, Link2, Copy, Check, Loader2, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Feedback {
    id: string;
    token: string;
    author: string | null;
    company: string | null;
    content: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export default function FeedbacksPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('client_feedbacks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching feedbacks:', error);
        } else {
            setFeedbacks(data || []);
        }
        setLoading(false);
    };

    const generateLink = async () => {
        setGenerating(true);
        const { data, error } = await supabase
            .from('client_feedbacks')
            .insert({ status: 'pending' })
            .select()
            .single();

        if (error) {
            console.error('Error generating link:', error);
        } else if (data) {
            const url = `${window.location.origin}/feedback/${data.token}`;
            await navigator.clipboard.writeText(url);
            setCopiedId('new');
            setTimeout(() => setCopiedId(null), 2500);
            setFeedbacks(prev => [data, ...prev]);
        }
        setGenerating(false);
    };

    const copyLink = async (token: string, id: string) => {
        const url = `${window.location.origin}/feedback/${token}`;
        await navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2500);
    };

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('client_feedbacks')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setFeedbacks(prev =>
                prev.map(f => f.id === id ? { ...f, status: newStatus } : f)
            );
        }
    };

    const deleteFeedback = async (id: string) => {
        const { error } = await supabase
            .from('client_feedbacks')
            .delete()
            .eq('id', id);

        if (!error) {
            setFeedbacks(prev => prev.filter(f => f.id !== id));
        }
    };

    const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
        pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
        approved: { label: 'Approved', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle },
        rejected: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle },
    };

    const pendingCount = feedbacks.filter(f => f.status === 'pending' && f.content).length;
    const approvedCount = feedbacks.filter(f => f.status === 'approved').length;
    const unusedLinks = feedbacks.filter(f => !f.author && !f.content).length;

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0a0a0a]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden relative">
            {/* Header */}
            <div className="px-8 py-8 md:px-12 md:py-10 border-b border-white/10 shrink-0 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Star className="w-8 h-8 text-[#E31E24]" />
                        <h1 className="text-3xl font-bold tracking-tight">Client Feedback</h1>
                    </div>
                    <p className="text-white/50 text-base max-w-2xl">
                        Generate shareable links for clients, manage submissions, and approve feedback for the website.
                    </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    <button
                        onClick={generateLink}
                        disabled={generating}
                        className="flex items-center gap-2 px-5 py-3 bg-[#E31E24] hover:bg-[#c71a1f] text-white rounded-xl font-bold transition-all disabled:opacity-50"
                    >
                        {generating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : copiedId === 'new' ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Link2 className="w-4 h-4" />
                        )}
                        {copiedId === 'new' ? 'Link Copied!' : 'Generate Link'}
                    </button>

                    <div className="hidden md:flex items-center gap-3">
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 flex flex-col items-center">
                            <div className="text-lg font-bold text-amber-400">{pendingCount}</div>
                            <div className="text-[9px] font-bold text-amber-400/70 uppercase tracking-widest">Pending</div>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 flex flex-col items-center">
                            <div className="text-lg font-bold text-emerald-400">{approvedCount}</div>
                            <div className="text-[9px] font-bold text-emerald-400/70 uppercase tracking-widest">Live</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 md:p-8">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-white/50 animate-pulse">Loading feedbacks...</div>
                ) : feedbacks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] backdrop-blur-md">
                        <Star className="w-16 h-16 text-white/20 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">No feedbacks yet</h3>
                        <p className="text-white/40 max-w-sm mb-6">Click "Generate Link" to create a shareable URL you can send to your clients.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {feedbacks.map((fb) => {
                            const cfg = statusConfig[fb.status] || statusConfig.pending;
                            const StatusIcon = cfg.icon;
                            const isUnused = !fb.author && !fb.content;

                            return (
                                <motion.div
                                    key={fb.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all ${isUnused ? 'opacity-60' : ''}`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                {isUnused ? (
                                                    <span className="text-lg font-bold text-white/40 italic">Awaiting submission...</span>
                                                ) : (
                                                    <>
                                                        <h3 className="text-lg font-bold text-white">{fb.author}</h3>
                                                        {fb.company && (
                                                            <span className="text-sm text-[#E31E24] font-medium">— {fb.company}</span>
                                                        )}
                                                    </>
                                                )}
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${cfg.bg} ${cfg.border} border text-xs font-bold uppercase tracking-wider ${cfg.color}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {cfg.label}
                                                </div>
                                            </div>
                                            <div className="text-xs text-white/30 flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                {new Date(fb.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                            <button
                                                onClick={() => copyLink(fb.token, fb.id)}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-xs font-medium text-white/70"
                                                title="Copy shareable link"
                                            >
                                                {copiedId === fb.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                {copiedId === fb.id ? 'Copied!' : 'Copy Link'}
                                            </button>

                                            {fb.content && fb.status !== 'approved' && (
                                                <button
                                                    onClick={() => updateStatus(fb.id, 'approved')}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all text-xs font-bold text-emerald-400"
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Approve
                                                </button>
                                            )}
                                            {fb.content && fb.status !== 'rejected' && (
                                                <button
                                                    onClick={() => updateStatus(fb.id, 'rejected')}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all text-xs font-bold text-red-400"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Reject
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteFeedback(fb.id)}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all text-xs font-medium text-white/40"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Feedback Content */}
                                    {fb.content && (
                                        <div className="bg-black/30 border border-white/5 rounded-xl p-5 mt-4 text-white/70 text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                                            {fb.content}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
