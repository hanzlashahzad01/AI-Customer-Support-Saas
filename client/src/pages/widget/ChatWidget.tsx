import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../../services/api';
import { Send, Smile, User, Bot, Loader2, Minus, Zap, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = () => {
    const { companyId } = useParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [botInfo, setBotInfo] = useState<any>(null);
    const [isTyping, setIsTyping] = useState(false);
    const socketRef = useRef<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBot = async () => {
            try {
                const res = await api.get(`/bot/${companyId}`);
                if (res.data) {
                    setBotInfo(res.data);
                    setMessages([{
                        sender: 'bot',
                        message: res.data.welcomeMessage || 'Hello! How can I help you today?',
                        timestamp: new Date()
                    }]);
                }
            } catch (err) {
                console.error("Widget: Failed to load bot", err);
            }
        };
        fetchBot();

        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('join_company', companyId);

        socketRef.current.on('receive_message', (data: any) => {
            // Only add if it's NOT from the current user (since user adds locally for instant feedback)
            // Or better: Let server handle it and don't add locally. 
            // In this specific setup, the server broadcasts to EVERYONE in the room.
            setMessages((prev) => {
                // Check if message already exists (simple deduplication by content and time if needed, 
                // but usually better to let server be source of truth)
                return [...prev, data];
            });
            if (data.sender === 'bot') setIsTyping(false);
        });

        return () => socketRef.current.disconnect();
    }, [companyId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const messageData = {
            companyId,
            message: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        // We emit to server. Server will broadcast it back.
        // To avoid double messages, we DON'T add locally here.
        // We wait for the 'receive_message' from server.
        socketRef.current.emit('send_message', messageData);
        setInputText('');
        setIsTyping(true);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 h-[700px] flex flex-col overflow-hidden border border-white/20"
            >
                {/* Header */}
                <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <Zap className="h-64 w-64 absolute -right-16 -top-16 rotate-12" />
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                                    <Bot className="h-8 w-8 text-white fill-white/20" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-4 border-indigo-700 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-lg tracking-tight">{botInfo?.name || 'Assistance Bot'}</h3>
                                <p className="text-white/70 text-xs font-semibold flex items-center gap-1.5">
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Always Online
                                </p>
                            </div>
                        </div>
                        <button className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                            <Minus className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Chat Panel */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/20">
                    <AnimatePresence>
                        {messages.map((msg, idx) => {
                            const isBot = msg.sender === 'bot';
                            const isDiagnostic = msg.message.includes('diagnostic mode');

                            if (isDiagnostic) {
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-center my-4"
                                    >
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 max-w-[90%]">
                                            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">System Notice</p>
                                                <p className="text-[13px] text-amber-900/80 dark:text-amber-100/80 leading-relaxed font-medium">
                                                    AI in diagnostic mode. Responses are simulated.
                                                    <span className="block mt-1 opacity-70 italic text-[11px]">Reason: Missing OPENAI_API_KEY</span>
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            }

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: isBot ? -10 : 10, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    className={`flex gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}
                                >
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${isBot ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                        }`}>
                                        {isBot ? <Zap size={14} className="fill-current" /> : <User size={14} />}
                                    </div>
                                    <div className={`max-w-[80%] flex flex-col ${isBot ? 'items-start' : 'items-end'} gap-1`}>
                                        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${isBot
                                                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-700'
                                                : 'bg-indigo-600 text-white rounded-tr-none'
                                            }`}>
                                            {msg.message}
                                        </div>
                                        <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase px-1">
                                            {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-2 p-2 ml-10"
                            >
                                <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={scrollRef} />
                </div>

                {/* Input Panel */}
                <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <form onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-5 pr-14 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-400 font-medium"
                            placeholder="Type a message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <div className="absolute right-3 flex items-center gap-1">
                            <button
                                type="button"
                                className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"
                            >
                                <Smile className="h-5 w-5" />
                            </button>
                            <button
                                type="submit"
                                disabled={!inputText.trim()}
                                className="h-10 w-10 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                            >
                                {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-4 w-4 rotate-12" />}
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-[10px] text-slate-400 font-bold tracking-tight mt-4 uppercase">
                        Powered by <span className="text-blue-500">Perfect Pick AI</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ChatWidget;
