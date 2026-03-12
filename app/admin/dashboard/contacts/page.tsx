"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Phone, Clock, FileText, User as UserIcon, Building2, CheckCircle2, History } from 'lucide-react';


// Define locally for strict boundaries
interface ArchivalContact {
    id: string;
    original_lead_id: string;
    email: string;
    full_name: string;
    phone: string;
    company: string;
    subject: string;
    message: string;
    source: string;
    is_deleted_from_crm: boolean;
    created_at: string;
    deleted_at: string;
}

export default function ContactsArchivePage() {
    const [contacts, setContacts] = useState<ArchivalContact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('contacts_archive')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching contacts archive:', error);
        } else {
            setContacts(data || []);
        }
        setLoading(false);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0a0a0a]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden relative">
            {/* Header section */}
            <div className="px-8 py-8 md:px-12 md:py-10 border-b border-white/10 shrink-0 bg-white/[0.02]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <History className="w-8 h-8 text-[#E31E24]" />
                            <h1 className="text-3xl font-bold tracking-tight">Contacts Archive</h1>
                        </div>
                        <p className="text-white/50 text-base max-w-2xl">
                            A permanent, immutable record of every lead that has ever interacted with your platform.
                            Even if deleted from the active pipeline, their data remains safely stored here.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 shrink-0">
                        <div className="text-3xl font-bold text-white">{contacts.length}</div>
                        <div className="text-xs font-semibold text-white/40 uppercase tracking-widest leading-tight">Total<br />Records</div>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto p-4 md:p-8">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-white/50 animate-pulse">Loading secure archives...</div>
                ) : contacts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] backdrop-blur-md">
                        <UserIcon className="w-16 h-16 text-white/20 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">No contacts yet</h3>
                        <p className="text-white/40 max-w-sm">When a user submits the contact form on your website, their record will permanently appear here.</p>
                    </div>
                ) : (
                    <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.2)]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.04] border-b border-white/10 uppercase text-xs font-bold tracking-wider text-white/40">
                                        <th className="p-5 font-semibold">Contact Info</th>
                                        <th className="p-5 font-semibold">Source & Submission</th>
                                        <th className="p-5 font-semibold">Message Overview</th>
                                        <th className="p-5 font-semibold text-center mt-2">CRM Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {contacts.map((contact) => (
                                        <tr key={contact.id} className="hover:bg-white/[0.02] transition-colors group">

                                            {/* Column 1: Identity */}
                                            <td className="p-5 align-top w-[300px]">
                                                <div className="font-bold text-base text-white mb-1">{contact.full_name || 'Anonymous'}</div>
                                                <div className="space-y-1.5 mt-3">
                                                    <div className="flex items-center gap-2 text-sm text-white/60">
                                                        <Mail className="w-3.5 h-3.5 text-[#E31E24]" />
                                                        <span className="truncate">{contact.email}</span>
                                                    </div>
                                                    {contact.phone && (
                                                        <div className="flex items-center gap-2 text-sm text-white/60">
                                                            <Phone className="w-3.5 h-3.5 text-white/40" />
                                                            <span className="truncate">{contact.phone}</span>
                                                        </div>
                                                    )}
                                                    {contact.company && (
                                                        <div className="flex items-center gap-2 text-sm text-white/60">
                                                            <Building2 className="w-3.5 h-3.5 text-white/40" />
                                                            <span className="truncate">{contact.company}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Column 2: Origin & Time */}
                                            <td className="p-5 align-top w-[220px]">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-white/70 tracking-wide capitalize mb-3 border border-white/10">
                                                    {contact.source}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-white/40">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>{new Date(contact.created_at).toLocaleString()}</span>
                                                </div>
                                            </td>

                                            {/* Column 3: Message Text */}
                                            <td className="p-5 align-top min-w-[300px]">
                                                {contact.subject && (
                                                    <div className="text-sm font-semibold text-white/80 mb-2 truncate">
                                                        {contact.subject}
                                                    </div>
                                                )}
                                                {contact.message ? (
                                                    <div className="text-sm text-white/50 leading-relaxed line-clamp-3 bg-white/[0.03] p-4 rounded-2xl border border-white/5 italic shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                                                        "{contact.message}"
                                                    </div>
                                                ) : (
                                                    <span className="text-white/20 text-sm italic">No message provided.</span>
                                                )}
                                            </td>

                                            {/* Column 4: CRM State */}
                                            <td className="p-5 align-middle text-center w-[160px]">
                                                {contact.is_deleted_from_crm ? (
                                                    <div className="inline-flex flex-col items-center gap-1.5 p-3 bg-white/5 rounded-xl border border-white/10 w-full group-hover:border-white/20 transition-colors">
                                                        <div className="flex items-center gap-1.5 text-white/40 text-xs font-bold uppercase tracking-wider">
                                                            Archived
                                                        </div>
                                                        <div className="text-[10px] text-white/30 truncate w-full">
                                                            Since {new Date(contact.deleted_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex flex-col items-center gap-1.5 p-3 bg-[#E31E24]/10 rounded-xl border border-[#E31E24]/20 w-full group-hover:bg-[#E31E24]/20 transition-colors">
                                                        <div className="flex items-center gap-1.5 text-[#E31E24] text-xs font-bold uppercase tracking-wider">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Active Lead
                                                        </div>
                                                    </div>
                                                )}
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
