import React from 'react';
import { supabase } from '@/lib/supabase';
import { Users, MousePointerClick, TrendingUp, BarChart3, KanbanSquare } from 'lucide-react';

export default async function AdminDashboardOverview() {
    // Note: Since this is purely a server-side read for layout visualization,
    // we fetch server-side or we could make it a client component. 
    // Usually admin dashboards benefit from client component fetching for real-time reactivity,
    // but a mix is fine. Let's make it a clean static-like view for demonstration.

    let totalLeads = 0;
    let totalPipelines = 0;

    try {
        const [{ count: leadsCount }, { count: pipelinesCount }] = await Promise.all([
            supabase.from('leads').select('*', { count: 'exact', head: true }),
            supabase.from('pipelines').select('*', { count: 'exact', head: true }),
        ]);
        totalLeads = leadsCount || 0;
        totalPipelines = pipelinesCount || 0;
    } catch (e) {
        console.error("Dashboard overview error", e);
    }

    const cards = [
        { title: 'Total Active Leads', value: totalLeads.toString(), icon: Users, color: 'text-blue-500' },
        { title: 'Pipelines Configured', value: totalPipelines.toString(), icon: KanbanSquareIcon, color: 'text-purple-500' },
        { title: 'Website Visitors', value: '4,289', icon: MousePointerClick, color: 'text-emerald-500', note: '+12% this week' },
        { title: 'Conversion Rate', value: '3.4%', icon: TrendingUp, color: 'text-[#E31E24]', note: 'Industry leading' },
    ];

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative">

            {/* Ambient Background Glow */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#E31E24]/5 to-transparent pointer-events-none" />

            <div className="flex-1 overflow-y-auto p-8 lg:p-12 z-10 space-y-12">

                <header>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back.</h1>
                    <p className="text-white/50 text-lg">Here's what's happening across Sponge Global today.</p>
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

                {/* Activity Feed / Graph Placeholders */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                    <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-2xl p-8 min-h-[400px] flex flex-col flex-1">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-lg">Engagement Overview</h3>
                            <div className="text-xs font-bold px-3 py-1 bg-white/5 text-white/60 rounded-full">Last 30 Days</div>
                        </div>
                        <div className="flex-1 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-white/20">
                            [ Chart Visualization Placeholder ]
                        </div>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-2xl p-8 min-h-[400px] flex flex-col flex-1">
                        <h3 className="font-bold text-lg mb-8">Recent Activity</h3>
                        <div className="space-y-6 flex-1">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-[#E31E24]" />
                                    <div>
                                        <p className="text-sm font-medium mb-1">New Contact Lead</p>
                                        <p className="text-xs text-white/40">A new lead entered the default pipeline from the website form.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Just a quick wrapper for icon passing
function KanbanSquareIcon(props: any) {
    return <KanbanSquare {...props} />;
}