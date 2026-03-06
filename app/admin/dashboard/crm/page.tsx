import React from 'react';
import KanbanBoard from '@/components/admin/KanbanBoard';
import { KanbanSquare } from 'lucide-react';

export const metadata = {
    title: 'CRM Pipeline - Admin',
};

export default function CRMDashboardPage() {
    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-80px)] md:h-full bg-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative">
            <div className="px-8 py-8 md:px-12 md:py-10 border-b border-white/5 shrink-0 bg-[#0c0c0c]/50">
                <div className="flex items-center gap-3 mb-2">
                    <KanbanSquare className="w-8 h-8 text-[#E31E24]" />
                    <h1 className="text-3xl font-bold tracking-tight">CRM Pipeline</h1>
                </div>
                <p className="text-white/50 text-base max-w-2xl">
                    Drag and drop incoming leads across different stages of your pipeline.
                </p>
            </div>

            <div className="flex-1 min-h-0 bg-[#111]/50 p-6 overflow-hidden flex flex-col">
                <KanbanBoard />
            </div>
        </div>
    );
}
