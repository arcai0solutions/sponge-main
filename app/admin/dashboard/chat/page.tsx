"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface ChatMessage {
    id: string;
    session_id: string;
    role: "user" | "assistant";
    content: string;
    created_at: string;
}

export default function AdminDashboard() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState<string[]>([]);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchChatData();
    }, []);

    const fetchChatData = async () => {
        setLoading(true);
        // Fetch all chat messages ordered by creation time
        const { data, error } = await supabase
            .from("chat_messages")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching chats:", error);
            setLoading(false);
            return;
        }

        if (data) {
            setMessages(data);

            // Extract unique sessions sorted roughly by the time of their first message (newest first)
            // Reverse engineering: The newest messages are at the end of the array, so we reverse it to capture the most recent sessions first.
            const uniqueSessions = Array.from(new Set(data.map((m: ChatMessage) => m.session_id))).reverse();
            setSessions(uniqueSessions);
            if (uniqueSessions.length > 0 && !selectedSession) {
                setSelectedSession(uniqueSessions[0]);
            }
        }
        setLoading(false);
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl animate-pulse">Loading secure dashboard...</div>
            </div>
        );
    }

    const filteredMessages = messages.filter(m => m.session_id === selectedSession);

    return (
        <div className="flex-1 flex flex-col md:flex-row h-full bg-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative">
            {/* Sidebar / Session List */}
            <div className="w-full md:w-80 bg-[#0c0c0c]/50 border-r border-white/5 h-full flex flex-col shrink-0">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
                    <span className="text-sm font-bold text-white/50 uppercase tracking-widest">
                        Sessions ({sessions.length})
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-white/20">
                    {sessions.map((session_id, i) => {
                        const sessionMsgs = messages.filter(m => m.session_id === session_id);
                        const firstMsg = sessionMsgs[0];
                        const date = firstMsg ? new Date(firstMsg.created_at).toLocaleString() : '';

                        return (
                            <button
                                key={session_id}
                                onClick={() => setSelectedSession(session_id)}
                                className={`w-full text-left p-4 rounded-xl transition-all border ${selectedSession === session_id
                                    ? 'bg-[#E31E24]/10 border-[#E31E24]/50 text-white'
                                    : 'bg-black/50 border-white/5 text-white/70 hover:bg-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className="text-xs text-white/40 mb-1">{date}</div>
                                <div className="font-mono text-xs opacity-60 truncate">{session_id}</div>
                                <div className="mt-2 text-sm truncate opacity-80">
                                    {sessionMsgs.find(m => m.role === 'user')?.content || "No user input"}
                                </div>
                            </button>
                        );
                    })}
                    {sessions.length === 0 && (
                        <div className="text-white/30 text-center p-4">No chat sessions found.</div>
                    )}
                </div>
            </div>

            {/* Main Chat View */}
            <div className="flex-1 h-full flex flex-col bg-transparent">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-lg">Conversation History</h2>
                        <span className="text-white/40 font-mono text-xs">{selectedSession || 'No session selected'}</span>
                    </div>
                    <button
                        onClick={fetchChatData}
                        className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                        Refresh Logs
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6 scrollbar-thin scrollbar-thumb-white/20">
                    {filteredMessages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col max-w-3xl ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                            <span className="text-xs text-white/30 mb-2 font-medium uppercase tracking-wider px-2">
                                {msg.role === 'user' ? 'Visitor' : 'Sponge AI'} • {new Date(msg.created_at).toLocaleTimeString()}
                            </span>
                            <div className={`p-5 rounded-2xl text-base leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                ? 'bg-white/10 text-white border border-white/10 rounded-tr-none'
                                : 'bg-[#E31E24]/10 border border-[#E31E24]/20 text-white/90 rounded-tl-none'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {!selectedSession && (
                        <div className="h-full flex items-center justify-center text-white/30">
                            Select a session from the sidebar to view logs.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
