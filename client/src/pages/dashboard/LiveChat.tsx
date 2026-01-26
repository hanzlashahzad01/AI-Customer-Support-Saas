import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useAuthStore } from '../../store/authStore';
import { Send, User as UserIcon, Bot, ExternalLink, Zap, Clock, Shield, Download, PauseCircle, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveChat = () => {
    const socket = useSocket('http://localhost:5000');
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isAiPaused, setIsAiPaused] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!socket || !user) return;

        socket.emit('join_company', user.companyId);


        socket.on('receive_message', (data: any) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on('ai_status_change', (data: any) => {
            setIsAiPaused(data.isPaused);
        });

        return () => {
            socket.off('receive_message');
            socket.off('ai_status_change');
        };
    }, [socket, user]);

    const toggleAi = () => {
        if (!socket || !user) return;
        socket.emit('toggle_ai', { companyId: user.companyId, isPaused: !isAiPaused });
    };

    const exportChat = () => {
        const chatText = messages.map(m => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.sender}: ${m.message}`).join('\n');
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !socket || !user) return;

        const messageData = {
            companyId: user.companyId,
            message: input,
            sender: 'agent',
            userId: user.id
        };

        socket.emit('send_message', messageData);
        setInput('');
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
            {/* Sidebar / Stats */}
            <div className="hidden lg:flex flex-col w-72 gap-6">
                <div className="p-6 rounded-3xl bg-primary shadow-xl shadow-primary/20 text-primary-foreground relative overflow-hidden group">
                    <Zap className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10 group-hover:scale-125 transition-transform duration-500" />
                    <div className="relative z-10">
                        <p className="text-xs uppercase tracking-widest font-bold opacity-70">Real-time Node</p>
                        <h3 className="text-2xl font-black mt-1">Active Feed</h3>
                        <div className="mt-4 flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[10px] font-bold">SERVER CONNECTED</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-6 rounded-3xl bg-card border shadow-sm">
                    <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" /> Active Agents
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                                    {user?.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">{user?.name}</p>
                                <p className="text-[10px] text-muted-foreground">You (Admin)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-card rounded-3xl border shadow-xl overflow-hidden relative">
                {/* Header */}
                <div className="p-5 border-b bg-card/50 backdrop-blur-md flex justify-between items-center relative z-20">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-2xl bg-secondary text-primary">
                            <Zap className="h-5 w-5 fill-primary/20" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-tight tracking-tight">Main Support Channel</h2>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Clock className="h-3 w-3" /> System initialized • Viewing all incoming traffic
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleAi}
                        className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-xl transition-all shadow-sm border ${isAiPaused
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500 hover:text-white'
                            : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                            }`}
                    >
                        {isAiPaused ? (
                            <> <PlayCircle className="h-3.5 w-3.5" /> Resume AI </>
                        ) : (
                            <> <PauseCircle className="h-3.5 w-3.5" /> Take Over </>
                        )}
                    </button>

                    <button
                        onClick={exportChat}
                        className="p-2.5 rounded-xl bg-card border hover:bg-muted transition-all text-muted-foreground hover:text-foreground shadow-sm"
                        title="Export Transcript"
                    >
                        <Download className="h-4 w-4" />
                    </button>

                    <a
                        href={`/widget/${user?.companyId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-4 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all shadow-md active:scale-95"
                    >
                        Open Widget <ExternalLink className="h-3 w-3" />
                    </a>
                </div>
            </div>

            {/* Messages Panel */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-transparent">
                <AnimatePresence>
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center h-full opacity-40 grayscale"
                        >
                            <div className="p-6 rounded-full bg-muted/50 mb-4 ring-8 ring-muted/20">
                                <Zap className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-bold">Waiting for action...</p>
                            <p className="text-xs mt-1">Incoming chats from your widget will appear here in real-time.</p>
                        </motion.div>
                    )}
                    {messages.map((msg, idx) => {
                        const isMe = msg.sender === 'agent' || msg.sender === 'Admin';

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-10 h-10 rounded-2xl flex shadow-sm items-center justify-center shrink-0 border ${msg.sender === 'bot' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                                    msg.sender === 'user' || msg.sender === 'customer' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                        'bg-primary/10 text-primary border-primary/20'
                                    }`}>
                                    {msg.sender === 'bot' ? <Bot size={18} className="fill-current/20" /> : <UserIcon size={18} className="fill-current/20" />}
                                </div>
                                <div className={`max-w-[80%] md:max-w-[60%] space-y-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`flex items-baseline gap-2 mb-1 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">{msg.sender}</span>
                                        <span className="text-[8px] opacity-40 font-bold">{new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className={`rounded-3xl px-5 py-3.5 shadow-sm text-sm leading-relaxed ${isMe
                                        ? 'bg-primary text-primary-foreground rounded-tr-none shadow-primary/20 ring-1 ring-primary/10'
                                        : 'bg-card border border-border/50 rounded-tl-none ring-1 ring-black/5'
                                        }`}>
                                        {msg.message}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t bg-card/30 backdrop-blur-md relative z-10">
                <form onSubmit={sendMessage} className="flex gap-3 relative">
                    <input
                        type="text"
                        placeholder="Shift + Enter for new line..."
                        className="flex-1 pl-5 pr-14 py-4 rounded-2xl border-none bg-secondary/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm placeholder:text-muted-foreground/50 transition-all shadow-inner"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 h-10 w-10 bg-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/30 flex items-center justify-center disabled:opacity-50 disabled:grayscale disabled:scale-100"
                        disabled={!input.trim()}
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
                <div className="mt-3 flex items-center gap-4 px-2">
                    <div className="flex -space-x-2">
                        {[1, 2].map(i => <div key={i} className="h-5 w-5 rounded-full border-2 border-card bg-muted animate-pulse" />)}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold italic opacity-50">Typing simulations active...</p>
                </div>
            </div>
        </div>

    );
};

export default LiveChat;
