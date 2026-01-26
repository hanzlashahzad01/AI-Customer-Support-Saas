import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    Plus,
    Mail,
    User,
    MoreVertical,
    CheckCircle2,
    Loader2,
    X,
    Trash2,
    Edit2,
    Search,
    RefreshCw,
    ShieldCheck,
    ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import { cn } from '../../utils/cn';

const Agents = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'support_agent' });
    const [editingAgent, setEditingAgent] = useState<any>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    const fetchAgents = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users/agents');
            setAgents(res.data);
        } catch (error) {
            console.error(error);
            showNotification('error', 'Failed to load agents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleEdit = (agent: any) => {
        setEditingAgent(agent);
        setFormData({
            name: agent.name,
            email: agent.email,
            password: '', // Password optional on update
            role: agent.role
        });
        setIsModalOpen(true);
        setActiveMenuId(null);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this team member?')) return;
        try {
            await api.delete(`/users/agents/${id}`);
            showNotification('success', 'Team member removed');
            fetchAgents();
        } catch (error) {
            console.error(error);
            showNotification('error', 'Failed to remove agent');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (editingAgent) {
                await api.put(`/users/agents/${editingAgent._id}`, formData);
                showNotification('success', 'Agent updated successfully');
            } else {
                await api.post('/users/agents', formData);
                showNotification('success', 'Agent added successfully');
            }
            setIsModalOpen(false);
            setEditingAgent(null);
            setFormData({ name: '', email: '', password: '', role: 'support_agent' });
            fetchAgents();
        } catch (error: any) {
            console.error(error);
            showNotification('error', error.response?.data?.message || 'Failed to save agent');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredAgents = agents.filter((agent: any) =>
        agent.name.toLowerCase().includes(search.toLowerCase()) ||
        agent.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={cn(
                            "fixed top-6 right-6 z-[100] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-md",
                            notification.type === 'success' ? "bg-emerald-500/90 text-white border-emerald-400" : "bg-rose-500/90 text-white border-rose-400"
                        )}
                    >
                        {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
                        <span className="font-medium">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                        Team Members
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage your support agents and their access levels.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchAgents}
                        className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted transition-all active:scale-95 text-muted-foreground"
                    >
                        <RefreshCw className={cn("h-5 w-5", loading && "animate-spin")} />
                    </button>
                    <button
                        onClick={() => { setIsModalOpen(true); setEditingAgent(null); setFormData({ name: '', email: '', password: '', role: 'support_agent' }); }}
                        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95 font-bold"
                    >
                        <Plus className="h-5 w-5" />
                        Add Agent
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search agents by name or email..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-card shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredAgents.map((agent: any, idx) => (
                        <motion.div
                            key={agent._id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className="p-8 flex flex-col items-center text-center relative group hover:border-primary/20 transition-all hover:shadow-xl">
                                <div className="absolute top-4 right-4">
                                    <button
                                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors md:invisible group-hover:visible"
                                        onClick={() => setActiveMenuId(activeMenuId === agent._id ? null : agent._id)}
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </button>

                                    {/* Mobile/Quick Actions Menu */}
                                    <AnimatePresence>
                                        {activeMenuId === agent._id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                className="absolute right-0 top-10 bg-card border rounded-xl shadow-xl p-1.5 z-10 flex flex-col gap-1 min-w-[120px]"
                                            >
                                                <button onClick={() => handleEdit(agent)} className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg text-sm text-left">
                                                    <Edit2 className="h-3.5 w-3.5" /> Edit
                                                </button>
                                                <button onClick={() => handleDelete(agent._id)} className="flex items-center gap-2 px-3 py-2 hover:bg-rose-50/50 hover:text-rose-600 rounded-lg text-sm text-left text-rose-500">
                                                    <Trash2 className="h-3.5 w-3.5" /> Remove
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center border-4 border-background shadow-inner">
                                        <span className="text-3xl font-black text-primary">{agent.name.charAt(0)}</span>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-background border-4 border-card flex items-center justify-center shadow-lg">
                                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-black tracking-tight">{agent.name}</h3>
                                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1 mb-6">
                                    <Mail className="h-3.5 w-3.5" />
                                    {agent.email}
                                </div>

                                <div className="w-full flex items-center justify-center gap-2">
                                    <div className={cn(
                                        "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border",
                                        agent.role === 'company_admin'
                                            ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
                                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    )}>
                                        {agent.role === 'company_admin' ? <ShieldCheck className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                                        {agent.role === 'company_admin' ? 'Administrator' : 'Support Agent'}
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t w-full flex items-center justify-around opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(agent)}
                                        className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-primary/5 rounded-xl"
                                        title="Edit Agent"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(agent._id)}
                                        className="p-2 text-muted-foreground hover:text-rose-500 transition-colors hover:bg-rose-500/5 rounded-xl"
                                        title="Remove Agent"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredAgents.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted">
                    <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold">No agents found</h3>
                    <p className="text-muted-foreground mt-1 max-w-xs text-center">Try adjusting your search or add a new team member to get started.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-6 text-primary font-bold hover:underline"
                    >
                        Add your first agent
                    </button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => { setIsModalOpen(false); setEditingAgent(null); }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-card w-full max-w-md rounded-[2.5rem] shadow-2xl border border-primary/10 overflow-hidden relative z-[120]"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black tracking-tight">{editingAgent ? 'Edit Member' : 'Add New Member'}</h2>
                                <button onClick={() => { setIsModalOpen(false); setEditingAgent(null); }} className="p-2 hover:bg-muted rounded-xl transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-muted/20 border-border focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none border"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Jane Cooper"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-muted/20 border-border focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none border"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="jane@example.com"
                                        />
                                    </div>
                                </div>
                                {!editingAgent && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Secure Password</label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full px-5 py-3.5 rounded-2xl bg-muted/20 border-border focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none border"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                )}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Role & Access</label>
                                    <select
                                        className="w-full px-5 py-3.5 rounded-2xl bg-muted/20 border-border focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none border cursor-pointer"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="support_agent">Support Agent (Limited)</option>
                                        <option value="company_admin">Company Admin (Full)</option>
                                    </select>
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest hover:opacity-90 shadow-xl shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (editingAgent ? "Update Member" : "Invite Member")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Agents;

