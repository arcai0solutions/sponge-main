"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from 'next/link';
import {
    LayoutDashboard,
    KanbanSquare,
    Users,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Settings,
    Bell,
    Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSidebarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push("/admin/login");
        } else {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[#E31E24] animate-spin" />
                    <div className="text-white/50 text-sm tracking-wider uppercase font-medium">Securing connection...</div>
                </div>
            </div>
        );
    }

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'CRM Pipeline', path: '/admin/dashboard/crm', icon: KanbanSquare },
        { name: 'Contacts Archive', path: '/admin/dashboard/contacts', icon: Users },
        { name: 'Email Newsletter', path: '/admin/dashboard/subscribers', icon: Mail },
        { name: 'AI Chat History', path: '/admin/dashboard/chat', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex select-none">

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-72 bg-[#0a0a0a] border-r border-white/5 fixed inset-y-0 left-0 z-50">
                {/* Logo Area */}
                <div className="h-24 flex items-center px-8 shrink-0 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#E31E24] rounded-lg shadow-[0_0_20px_rgba(227,30,36,0.3)] flex items-center justify-center">
                            <span className="font-bold text-white text-lg">S</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">SPONGE<span className="text-white/40 font-medium">ADMIN</span></span>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                    <div className="px-4 mb-4 text-xs font-semibold uppercase tracking-wider text-white/30">Menu</div>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path || (item.path !== '/admin/dashboard' && pathname.startsWith(item.path + '/'));

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative overflow-hidden ${isActive
                                    ? 'text-white'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav"
                                        className="absolute inset-0 bg-[#E31E24]/10 border border-[#E31E24]/20 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <Icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-[#E31E24]' : 'group-hover:text-white/80'}`} />
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Area */}
                <div className="p-4 shrink-0 border-t border-white/5">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                    <div className="mt-4 px-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E31E24] to-orange-500 p-0.5">
                            <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center">
                                <span className="font-bold text-xs">AD</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-medium truncate">System Admin</div>
                            <div className="text-xs text-white/40 truncate">admin@spongeglobal.com</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#E31E24] rounded flex items-center justify-center">
                        <span className="font-bold text-white text-xs">S</span>
                    </div>
                    <span className="font-bold text-sm tracking-tight">SPONGE</span>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 -mr-2 text-white/70 hover:text-white"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-72 bg-[#0a0a0a] border-l border-white/5 z-[100] flex flex-col md:hidden"
                        >
                            <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                                <span className="font-bold tracking-widest text-[#E31E24] text-xs">MENU</span>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 -mr-2 text-white/50 hover:text-white bg-white/5 rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.path || (item.path !== '/admin/dashboard' && pathname.startsWith(item.path + '/'));
                                    return (
                                        <Link
                                            key={item.path}
                                            href={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive
                                                ? 'bg-[#E31E24]/10 text-white border border-[#E31E24]/20'
                                                : 'text-white/60 active:bg-white/5'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-[#E31E24]' : ''}`} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="p-6 border-t border-white/5">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl text-sm font-bold transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content wrapper */}
            <main className="flex-1 flex flex-col md:pl-72 min-w-0 pt-16 md:pt-0">
                {/* Topbar inside main area (optional, for contextual actions/branding spacing) */}
                <header className="hidden md:flex h-24 items-center justify-end px-10 shrink-0 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all">
                            <Bell className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all">
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* Content itself */}
                <div className="flex-1 p-4 md:p-10 flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-96px)] overflow-hidden">
                    {children}
                </div>
            </main>

        </div>
    );
}
