"use client";

import React, { useEffect, useState, useRef } from 'react';
import NextImage from 'next/image';
import { supabase } from '@/lib/supabase';
import { 
    Users, 
    Plus, 
    Trash2, 
    Edit2, 
    Image as ImageIcon, 
    Tag, 
    Loader2, 
    Check, 
    X, 
    Upload, 
    Sparkles, 
    AlertCircle,
    Search,
    ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    description: string;
    image_url?: string | null;
    tag: string;
    sort_order: number;
    created_at?: string;
}

const COMMON_TAGS = [
    'Communication',
    'Leadership',
    'Strategy',
    'Tech & Innovation',
    'Operations',
    'Marketing',
    'Human Resources'
];

export default function AdminTeamPage() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTag, setFilterTag] = useState('All');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Form fields
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [tag, setTag] = useState('Communication');
    const [customTag, setCustomTag] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [sortOrder, setSortOrder] = useState<number>(0);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching team members:', error);
            } else {
                setTeamMembers(data || []);
            }
        } catch (err) {
            console.error('Fetch exception:', err);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingMember(null);
        setName('');
        setRole('');
        setTag('Communication');
        setCustomTag('');
        setDescription('');
        setImageUrl('');
        setSortOrder(teamMembers.length + 1);
        setErrorMsg(null);
        setIsModalOpen(true);
    };

    const openEditModal = (member: TeamMember) => {
        setEditingMember(member);
        setName(member.name);
        setRole(member.role || '');
        if (COMMON_TAGS.includes(member.tag)) {
            setTag(member.tag);
            setCustomTag('');
        } else {
            setTag('Custom');
            setCustomTag(member.tag);
        }
        setDescription(member.description || '');
        setImageUrl(member.image_url || '');
        setSortOrder(member.sort_order || 0);
        setErrorMsg(null);
        setIsModalOpen(true);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            setErrorMsg('Please upload a valid image file (PNG, JPEG, WEBP).');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrorMsg('Image size must be less than 5MB.');
            return;
        }

        setUploadingImage(true);
        setErrorMsg(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `team_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage 'team-members' bucket
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('team-members')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                console.error('Storage upload error:', uploadError);
                // Fallback: upload failed, notify user to check storage bucket policies
                setErrorMsg(`Storage Upload Error: ${uploadError.message}. Make sure the 'team-members' bucket is created.`);
            } else if (uploadData) {
                const { data: publicUrlData } = supabase.storage
                    .from('team-members')
                    .getPublicUrl(filePath);

                if (publicUrlData?.publicUrl) {
                    setImageUrl(publicUrlData.publicUrl);
                    setSuccessMsg('Image uploaded successfully!');
                    setTimeout(() => setSuccessMsg(null), 3000);
                }
            }
        } catch (err: any) {
            console.error('File upload exception:', err);
            setErrorMsg(err.message || 'Failed to upload image.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalTag = tag === 'Custom' ? customTag.trim() : tag;

        if (!name.trim()) {
            setErrorMsg('Name is required.');
            return;
        }

        if (!finalTag.trim()) {
            setErrorMsg('Tag / Niche is required.');
            return;
        }

        setSaving(true);
        setErrorMsg(null);

        const memberData = {
            name: name.trim(),
            role: role.trim() || 'Team Member',
            tag: finalTag,
            description: description.trim(),
            image_url: imageUrl.trim() || null,
            sort_order: sortOrder,
            updated_at: new Date().toISOString()
        };

        try {
            if (editingMember) {
                // Update
                const { error } = await supabase
                    .from('team_members')
                    .update(memberData)
                    .eq('id', editingMember.id);

                if (error) {
                    setErrorMsg(error.message);
                } else {
                    setSuccessMsg('Team member updated successfully!');
                    setIsModalOpen(false);
                    fetchTeamMembers();
                }
            } else {
                // Insert
                const { error } = await supabase
                    .from('team_members')
                    .insert([memberData]);

                if (error) {
                    setErrorMsg(error.message);
                } else {
                    setSuccessMsg('Team member added successfully!');
                    setIsModalOpen(false);
                    fetchTeamMembers();
                }
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Error saving team member.');
        } finally {
            setSaving(false);
            setTimeout(() => setSuccessMsg(null), 3000);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;

        try {
            const { error } = await supabase
                .from('team_members')
                .delete()
                .eq('id', id);

            if (error) {
                alert(`Error deleting: ${error.message}`);
            } else {
                setTeamMembers(prev => prev.filter(m => m.id !== id));
            }
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    };

    // Filtered members list
    const filteredMembers = teamMembers.filter(member => {
        const matchesTag = filterTag === 'All' || member.tag?.toLowerCase() === filterTag.toLowerCase();
        const matchesSearch = searchQuery === '' ||
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.tag.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTag && matchesSearch;
    });

    const uniqueTags = Array.from(new Set(['All', ...teamMembers.map(m => m.tag).filter(Boolean)]));

    return (
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-8 text-white">

            {/* Top Bar Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#E31E24] uppercase tracking-wider mb-1">
                        <Users className="w-4 h-4" /> Admin Management
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Our Team Members</h1>
                    <p className="text-sm text-white/50 mt-1">
                        Manage your team roster, uploaded photos, roles, bios, and niche filter tags.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-5 py-3 bg-[#E31E24] hover:bg-[#c9181d] text-white font-semibold rounded-2xl transition-all shadow-lg shadow-[#E31E24]/20 hover:shadow-[#E31E24]/40 w-fit"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Team Member</span>
                </button>
            </div>

            {/* Toast Notification */}
            {successMsg && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{successMsg}</span>
                </div>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <span className="text-xs text-white/40 font-semibold uppercase tracking-wider mr-2 shrink-0">Tags:</span>
                    {uniqueTags.map(t => (
                        <button
                            key={t}
                            onClick={() => setFilterTag(t)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                                filterTag === t
                                    ? 'bg-[#E31E24] text-white'
                                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E31E24]"
                    />
                </div>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#E31E24] animate-spin" />
                    <span className="text-xs text-white/50 uppercase tracking-widest">Loading Team Data...</span>
                </div>
            ) : filteredMembers.length === 0 ? (
                <div className="p-16 border border-white/5 rounded-3xl text-center bg-[#0a0a0a] flex flex-col items-center gap-3">
                    <Users className="w-12 h-12 text-white/20" />
                    <h3 className="text-lg font-semibold text-white/80">No Team Members Registered</h3>
                    <p className="text-sm text-white/40 max-w-sm">
                        Get started by adding your first team member with an image, role, tag, and bio description.
                    </p>
                    <button
                        onClick={openAddModal}
                        className="mt-2 px-4 py-2 bg-[#E31E24] text-white text-sm font-semibold rounded-xl"
                    >
                        + Add Team Member
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map((member) => (
                        <div
                            key={member.id}
                            className="bg-[#0a0a0a] border border-white/10 hover:border-white/20 rounded-2xl p-6 flex flex-col justify-between gap-4 relative group"
                        >
                            {/* Member Top Header */}
                            <div className="flex items-start gap-4">
                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center">
                                    {member.image_url ? (
                                        <NextImage
                                            src={member.image_url}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#E31E24]/20 flex items-center justify-center text-lg font-bold text-[#E31E24]">
                                            {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-[10px] font-semibold uppercase tracking-wider">
                                            {member.tag}
                                        </span>
                                        <span className="text-[10px] text-white/40">Sort: #{member.sort_order}</span>
                                    </div>
                                    <h3 className="text-lg font-bold truncate mt-1">{member.name}</h3>
                                    <p className="text-xs text-[#E31E24] font-medium truncate">{member.role}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-white/60 line-clamp-3 leading-relaxed">
                                {member.description || 'No description provided.'}
                            </p>

                            {/* Action Buttons */}
                            <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                                <button
                                    onClick={() => openEditModal(member)}
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id, member.name)}
                                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Dialog for Create / Edit */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 md:p-8 max-w-xl w-full text-white shadow-2xl relative my-8"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-2xl font-bold mb-1">
                                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                            </h2>
                            <p className="text-xs text-white/50 mb-6">
                                Upload image, specify role, set niche category tag, and describe their experience.
                            </p>

                            {errorMsg && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <form onSubmit={handleSave} className="space-y-5">
                                {/* Image Upload & URL Section */}
                                <div>
                                    <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">
                                        Team Member Photo
                                    </label>

                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center">
                                            {imageUrl ? (
                                                <NextImage
                                                    src={imageUrl}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <ImageIcon className="w-8 h-8 text-white/20" />
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-2 w-full">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploadingImage}
                                                className="w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                            >
                                                {uploadingImage ? (
                                                    <>
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading to Supabase...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-3.5 h-3.5" /> Upload Photo from Computer
                                                    </>
                                                )}
                                            </button>

                                            <input
                                                type="text"
                                                placeholder="Or paste image URL (e.g. https://...)"
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#E31E24]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Name & Role */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-white/70 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Dr. Amila Jayasinghe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E31E24]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-white/70 mb-1">
                                            Role / Title
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Lead Training Strategist"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E31E24]"
                                        />
                                    </div>
                                </div>

                                {/* Tag / Niche & Sort Order */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-white/70 mb-1">
                                            Niche Tag (For Filter System) *
                                        </label>
                                        <select
                                            value={tag}
                                            onChange={(e) => setTag(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E31E24]"
                                        >
                                            {COMMON_TAGS.map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                            <option value="Custom">+ Add Custom Tag</option>
                                        </select>

                                        {tag === 'Custom' && (
                                            <input
                                                type="text"
                                                placeholder="Enter custom tag..."
                                                value={customTag}
                                                onChange={(e) => setCustomTag(e.target.value)}
                                                className="w-full mt-2 px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#E31E24]"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-white/70 mb-1">
                                            Sort Order
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E31E24]"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-semibold text-white/70 mb-1">
                                        Bio / Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="Brief bio describing expertise, experience, or achievements..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E31E24]"
                                    />
                                </div>

                                {/* Submit & Cancel Buttons */}
                                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2.5 bg-[#E31E24] hover:bg-[#c9181d] text-white font-semibold rounded-xl text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4" /> Save Team Member
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
