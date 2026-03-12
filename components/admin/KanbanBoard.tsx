"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, GripVertical, Mail, Phone, Building2, Plus, X, Settings2, MoreHorizontal, StickyNote, Eye, Calendar, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types exactly matching our database
interface Pipeline {
    id: string;
    name: string;
    sort_order: number;
}

interface Stage {
    id: string;
    pipeline_id: string;
    name: string;
    sort_order: number;
}

interface Lead {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    company: string;
    subject: string;
    message: string;
    notes: string;
    source: string;
    stage_id: string;
    pipeline_id: string;
    sort_order: number;
    created_at: string;
}

export default function KanbanBoard() {
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);
    const [stages, setStages] = useState<Stage[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [activePipeline, setActivePipeline] = useState<string | null>(null);

    // Modals state
    const [isAddingPipeline, setIsAddingPipeline] = useState(false);
    const [isAddingStage, setIsAddingStage] = useState(false);
    const [isAddingLead, setIsAddingLead] = useState<string | null>(null); // holds stage_id
    const [viewingLead, setViewingLead] = useState<Lead | null>(null);

    // Form states
    const [newPipelineName, setNewPipelineName] = useState('');
    const [newStageName, setNewStageName] = useState('');
    const [newLeadForm, setNewLeadForm] = useState({
        full_name: '', email: '', phone: '', company: '', message: ''
    });

    useEffect(() => {
        fetchBoardData();
    }, []);

    const fetchBoardData = async () => {
        setLoading(true);
        try {
            const [pRes, sRes, lRes] = await Promise.all([
                supabase.from('pipelines').select('*').order('sort_order'),
                supabase.from('stages').select('*').order('sort_order'),
                supabase.from('leads').select('*').order('sort_order')
            ]);

            if (pRes.error) throw pRes.error;
            if (sRes.error) throw sRes.error;
            if (lRes.error) throw lRes.error;

            const fetchedPipelines = pRes.data || [];
            setPipelines(fetchedPipelines);
            setStages(sRes.data || []);
            setLeads(lRes.data || []);

            if (fetchedPipelines.length > 0 && !activePipeline) {
                setActivePipeline(fetchedPipelines[0].id);
            } else if (fetchedPipelines.length === 0) {
                setActivePipeline(null);
            }
        } catch (error) {
            console.error('Error fetching CRM data:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Pipeline CRUD ---
    const handleAddPipeline = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPipelineName.trim()) return;

        const { data, error } = await supabase.from('pipelines')
            .insert({ name: newPipelineName, sort_order: pipelines.length })
            .select().single();

        if (!error && data) {
            setPipelines([...pipelines, data]);
            setActivePipeline(data.id);
            setIsAddingPipeline(false);
            setNewPipelineName('');
        } else {
            console.error("Error adding pipeline", error);
        }
    };

    const handleDeletePipeline = async (id: string) => {
        // Prevent deleting the default (first) pipeline
        const sorted = [...pipelines].sort((a, b) => a.sort_order - b.sort_order);
        if (sorted.length > 0 && sorted[0].id === id) {
            alert('The default pipeline cannot be deleted.');
            return;
        }
        if (!confirm("Delete this entire pipeline? All stages and leads within it will be deleted. (Leads will still exist in contacts archive).")) return;

        const { error } = await supabase.from('pipelines').delete().eq('id', id);
        if (!error) {
            setPipelines(pipelines.filter(p => p.id !== id));
            if (activePipeline === id) setActivePipeline(pipelines[0]?.id || null);
            fetchBoardData();
        }
    };

    // --- Stage CRUD ---
    const handleAddStage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStageName.trim() || !activePipeline) return;

        const activeStages = stages.filter(s => s.pipeline_id === activePipeline);
        const { data, error } = await supabase.from('stages')
            .insert({ name: newStageName, pipeline_id: activePipeline, sort_order: activeStages.length })
            .select().single();

        if (!error && data) {
            setStages([...stages, data]);
            setIsAddingStage(false);
            setNewStageName('');
        }
    };

    const handleDeleteStage = async (id: string) => {
        if (!confirm("Delete this stage? All leads within it will be deleted from active CRM.")) return;
        const { error } = await supabase.from('stages').delete().eq('id', id);
        if (!error) {
            setStages(stages.filter(s => s.id !== id));
            fetchBoardData();
        }
    };

    // --- Lead CRUD ---
    const handleAddLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLeadForm.full_name || !newLeadForm.email || !activePipeline || !isAddingLead) return;

        const stageLeads = leads.filter(l => l.stage_id === isAddingLead);
        const maxSort = stageLeads.length > 0 ? Math.max(...stageLeads.map(l => l.sort_order)) + 10 : 0;

        const { data, error } = await supabase.from('leads').insert({
            ...newLeadForm,
            pipeline_id: activePipeline,
            stage_id: isAddingLead,
            sort_order: maxSort,
            source: 'manual_entry'
        }).select().single();

        if (!error && data) {
            setLeads([...leads, data]);
            setIsAddingLead(null);
            setNewLeadForm({ full_name: '', email: '', phone: '', company: '', message: '' });
        }
    };

    const handleDeleteLead = async (leadId: string) => {
        if (!confirm('Are you sure you want to delete this lead? It will still be preserved in the Contacts Archive.')) return;

        // Optimistic UI update
        setLeads(prev => prev.filter(l => l.id !== leadId));

        const { error } = await supabase.from('leads').delete().eq('id', leadId);
        if (error) {
            console.error('Error deleting lead:', error);
            fetchBoardData(); // Revert
        }
    };

    // --- Drag and Drop Logic ---
    const handleDragStart = (e: React.DragEvent, leadId: string) => {
        e.dataTransfer.setData('leadId', leadId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, destStageId: string) => {
        e.preventDefault();
        const leadId = e.dataTransfer.getData('leadId');
        if (!leadId) return;

        const currentLead = leads.find(l => l.id === leadId);
        if (!currentLead || currentLead.stage_id === destStageId) return;

        const stageLeads = leads.filter(l => l.stage_id === destStageId);
        const newSortOrder = stageLeads.length > 0 ? Math.max(...stageLeads.map(l => l.sort_order)) + 100 : 0;

        setLeads(prev => prev.map(l =>
            l.id === leadId ? { ...l, stage_id: destStageId, sort_order: newSortOrder } : l
        ));

        const { error } = await supabase.rpc('move_lead', {
            p_lead_id: leadId, p_new_stage_id: destStageId, p_new_sort_order: newSortOrder
        });

        if (error) {
            console.error('Error moving lead:', error);
            fetchBoardData(); // Revert
        }
    };


    if (loading) {
        return <div className="flex items-center justify-center p-20 text-white/50">Loading CRM data...</div>;
    }

    const activeStages = stages.filter(s => s.pipeline_id === activePipeline);

    return (
        <>
        <div className="w-full h-full flex flex-col relative">

            {/* Top Header: Pipelines Menu */}
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {pipelines.map(p => (
                        <div key={p.id} className="relative group flex items-center shrink-0">
                            <button
                                onClick={() => setActivePipeline(p.id)}
                                className={`px-6 py-2 rounded-full font-medium transition-colors ${activePipeline === p.id
                                    ? 'bg-[#E31E24] text-white shadow-[0_5px_15px_rgba(227,30,36,0.3)]'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/5'
                                    }`}
                            >
                                {p.name}
                            </button>
                            {activePipeline === p.id && p.sort_order !== [...pipelines].sort((a, b) => a.sort_order - b.sort_order)[0]?.sort_order && (
                                <button onClick={() => handleDeletePipeline(p.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity transform scale-75">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}

                    {isAddingPipeline ? (
                        <form onSubmit={handleAddPipeline} className="flex flex-shrink-0 items-center gap-2">
                            <input autoFocus value={newPipelineName} onChange={e => setNewPipelineName(e.target.value)} placeholder="Pipeline Name" className="px-4 py-2 bg-white/5 border border-white/20 rounded-full text-sm outline-none w-40" />
                            <button type="submit" className="text-green-500 hover:bg-green-500/10 p-2 rounded-full"><Plus className="w-4 h-4" /></button>
                            <button type="button" onClick={() => setIsAddingPipeline(false)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-full"><X className="w-4 h-4" /></button>
                        </form>
                    ) : (
                        <button onClick={() => setIsAddingPipeline(true)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white shrink-0 border border-dashed border-white/20 transition-all font-medium">
                            <Plus className="w-4 h-4" />
                            <span>New Pipeline</span>
                        </button>
                    )}
                </div>
            </div>

            {pipelines.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-white/40">
                    <Settings2 className="w-16 h-16 mb-4 opacity-50" />
                    <p>No pipelines found. Please create one to start managing leads.</p>
                </div>
            )}

            {/* Kanban Board Area */}
            {activePipeline && (
                <div className="flex-1 flex items-start gap-6 min-w-0 overflow-x-auto pb-8 no-scrollbar">
                    {activeStages.map(stage => {
                        const stageLeads = leads
                            .filter(l => l.stage_id === stage.id && l.pipeline_id === activePipeline)
                            .sort((a, b) => a.sort_order - b.sort_order);

                        return (
                            <div
                                key={stage.id}
                                className="w-[350px] shrink-0 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.2)] flex flex-col max-h-full overflow-hidden"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, stage.id)}
                            >
                                {/* Stage Header */}
                                <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02] group">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-white text-base">{stage.name}</h3>
                                        <span className="bg-white/10 text-white/60 text-xs py-0.5 px-2 rounded-full font-bold">
                                            {stageLeads.length}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setIsAddingLead(stage.id)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors" title="Add Lead">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteStage(stage.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-500 transition-colors" title="Delete Stage">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Stage Column Body */}
                                <div className="p-4 flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10 min-h-[150px]">
                                    <AnimatePresence>
                                        {stageLeads.map(lead => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                key={lead.id}
                                                draggable
                                                onDragStart={(e: any) => handleDragStart(e, lead.id)}
                                                className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-3xl p-5 cursor-grab active:cursor-grabbing hover:border-white/20 hover:bg-white/[0.06] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_5px_15px_rgba(0,0,0,0.2)] transition-all group relative overflow-hidden"
                                            >
                                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                                                    <button
                                                        onClick={() => setViewingLead(lead)}
                                                        className="bg-white/10 text-white p-1.5 rounded-md hover:bg-white/20 transition-colors shadow-lg backdrop-blur-sm"
                                                        title="View Lead"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLead(lead.id)}
                                                        className="bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 transition-colors shadow-lg"
                                                        title="Delete Lead"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <div className="flex items-start gap-3 mb-4">
                                                    <div className="mt-1.5 text-white/20 cursor-grab active:cursor-grabbing">
                                                        <GripVertical className="w-4 h-4" />
                                                    </div>
                                                    <div className="pr-8">
                                                        <h4 className="font-bold text-white leading-tight">{lead.full_name || 'Anonymous'}</h4>
                                                        {lead.company && (
                                                            <div className="flex items-center gap-1.5 text-white/40 text-[13px] mt-1.5 font-medium">
                                                                <Building2 className="w-3.5 h-3.5" />
                                                                <span>{lead.company}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-white/60 text-[13px] bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                                                        <Mail className="w-3.5 h-3.5 text-[#E31E24]" />
                                                        <span className="truncate">{lead.email}</span>
                                                    </div>
                                                    {lead.phone && (
                                                        <div className="flex items-center gap-2 text-white/60 text-[13px] bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                                                            <Phone className="w-3.5 h-3.5 text-[#E31E24]" />
                                                            <span className="truncate">{lead.phone}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {lead.message && (
                                                    <div className="text-[13px] text-white/50 line-clamp-2 bg-black/20 p-3 rounded-lg flex gap-2">
                                                        <span className="opacity-50 font-serif">"</span>
                                                        {lead.message}
                                                    </div>
                                                )}

                                                {lead.notes && (
                                                    <div className="text-[13px] text-white/50 line-clamp-3 bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg flex gap-2 mt-2">
                                                        <StickyNote className="w-3.5 h-3.5 text-amber-500/60 shrink-0 mt-0.5" />
                                                        <span>{lead.notes}</span>
                                                    </div>
                                                )}

                                                <div className="mt-4 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-white/30 pt-4 border-t border-white/5">
                                                    <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                                                    <div className="px-2 py-0.5 rounded-sm bg-white/5 border border-white/5">{lead.source}</div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {/* Inline "Add Lead" form if this stage is active */}
                                    {isAddingLead === stage.id && (
                                        <motion.form
                                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                            onSubmit={handleAddLeadSubmit}
                                            className="bg-[#2a2a2a] p-4 rounded-xl space-y-3 border border-white/10"
                                        >
                                            <input autoFocus required value={newLeadForm.full_name} onChange={e => setNewLeadForm({ ...newLeadForm, full_name: e.target.value })} placeholder="Full Name *" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E31E24]" />
                                            <input required type="email" value={newLeadForm.email} onChange={e => setNewLeadForm({ ...newLeadForm, email: e.target.value })} placeholder="Email *" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E31E24]" />
                                            <input value={newLeadForm.company} onChange={e => setNewLeadForm({ ...newLeadForm, company: e.target.value })} placeholder="Company Name" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E31E24]" />
                                            <div className="flex gap-2 pt-2">
                                                <button type="submit" className="flex-1 bg-[#E31E24] hover:bg-red-600 text-white font-bold text-xs py-2 rounded-lg transition-colors">Add</button>
                                                <button type="button" onClick={() => setIsAddingLead(null)} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 rounded-lg transition-colors">Cancel</button>
                                            </div>
                                        </motion.form>
                                    )}

                                    {stageLeads.length === 0 && isAddingLead !== stage.id && (
                                        <div className="h-full flex items-center justify-center text-white/20 text-sm border-2 border-dashed border-white/5 rounded-xl py-10 opacity-50">
                                            Drop leads here
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Add Stage Column Placeholder */}
                    <div className="w-[300px] shrink-0 h-full flex items-start">
                        {isAddingStage ? (
                            <form onSubmit={handleAddStage} className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 w-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.2)]">
                                <input autoFocus required value={newStageName} onChange={e => setNewStageName(e.target.value)} placeholder="Stage Name" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 mb-3 text-sm outline-none focus:border-white/30 backdrop-blur-sm" />
                                <div className="flex gap-2">
                                    <button type="submit" className="bg-white text-black font-bold text-xs py-2 px-4 rounded-xl transition-colors">Create</button>
                                    <button type="button" onClick={() => setIsAddingStage(false)} className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-2 px-4 rounded-xl transition-colors">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <button onClick={() => setIsAddingStage(true)} className="flex items-center gap-3 w-full p-4 rounded-[2rem] bg-white/[0.02] backdrop-blur-xl border border-dashed border-white/10 text-white/40 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all group">
                                <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-[#E31E24] group-hover:text-white transition-colors">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <span className="font-semibold text-sm">Add New Stage</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>

            {/* ── Lead Detail Modal ── */}
            <AnimatePresence>
                {viewingLead && ((): React.ReactNode => {
                    const lead = viewingLead;
                    return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        onClick={() => setViewingLead(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-[#111]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.5)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <div>
                                    <h2 className="text-xl font-bold text-white">{lead.full_name || 'Anonymous'}</h2>
                                    {lead.company && (
                                        <div className="flex items-center gap-1.5 text-white/50 text-sm mt-1">
                                            <Building2 className="w-4 h-4" />
                                            <span>{lead.company}</span>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setViewingLead(null)} className="text-white/40 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-4">
                                {/* Contact Info */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white/30">Contact Info</h3>
                                    <div className="flex items-center gap-3 text-white/70 text-sm bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                                        <Mail className="w-4 h-4 text-[#E31E24]" />
                                        <span>{lead.email}</span>
                                    </div>
                                    {lead.phone && (
                                        <div className="flex items-center gap-3 text-white/70 text-sm bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                                            <Phone className="w-4 h-4 text-[#E31E24]" />
                                            <span>{lead.phone}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Message */}
                                {lead.message && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/30">Message</h3>
                                        <div className="text-sm text-white/60 bg-white/5 px-4 py-3 rounded-xl border border-white/5 leading-relaxed">
                                            {lead.message}
                                        </div>
                                    </div>
                                )}

                                {/* AI Notes */}
                                {lead.notes && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500/60">AI Notes</h3>
                                        <div className="text-sm text-white/60 bg-amber-500/5 px-4 py-3 rounded-xl border border-amber-500/10 leading-relaxed flex gap-2">
                                            <StickyNote className="w-4 h-4 text-amber-500/60 shrink-0 mt-0.5" />
                                            <span>{lead.notes}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Meta Info */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white/30">Details</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                                            <div className="text-[11px] uppercase tracking-wider text-white/30 font-medium mb-1">Source</div>
                                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                                <Globe className="w-3.5 h-3.5" />
                                                <span>{lead.source}</span>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                                            <div className="text-[11px] uppercase tracking-wider text-white/30 font-medium mb-1">Date Added</div>
                                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{new Date(lead.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-white/10 flex justify-between">
                                <button
                                    onClick={() => { handleDeleteLead(lead.id); setViewingLead(null); }}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Lead
                                </button>
                                <button
                                    onClick={() => setViewingLead(null)}
                                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                    );
                })()}
            </AnimatePresence>
        </>
    );
}
