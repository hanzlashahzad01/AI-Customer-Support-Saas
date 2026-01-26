import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    Plus,
    Search,
    X,
    Filter,
    MoreVertical,
    ChevronRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    Inbox,
    Tag,
    User,
    Mail,
    MessageSquare,
    Loader2,
    RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import { cn } from '../../utils/cn';

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [reply, setReply] = useState('');
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [agents, setAgents] = useState([]);

    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        priority: 'medium',
        customerName: '',
        customerEmail: ''
    });

    const fetchAgents = async () => {
        try {
            const res = await api.get('/users/agents');
            setAgents(res.data);
        } catch (error) {
            console.error("Failed to fetch agents", error);
        }
    };

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const res = await api.get('/tickets', {
                params: { search, status: statusFilter, priority: priorityFilter }
            });
            setTickets(res.data);
        } catch (error) {
            console.error(error);
            showNotification('error', 'Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
        fetchAgents();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchTickets();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [search, statusFilter, priorityFilter]);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const response = await api.post('/tickets', formData);
            if (response.data) {
                showNotification('success', 'Ticket created successfully!');
                setIsModalOpen(false);
                setFormData({
                    subject: '',
                    description: '',
                    priority: 'medium',
                    customerName: '',
                    customerEmail: ''
                });
                fetchTickets();
            }
        } catch (error: any) {
            console.error("Creation Error:", error);
            const errorMsg = error.response?.data?.message || 'Failed to create ticket';
            showNotification('error', errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            await api.put(`/tickets/${id}`, { status: newStatus });
            showNotification('success', `Ticket status updated to ${newStatus}`);
            fetchTickets();
            if (selectedTicket?._id === id) {
                setSelectedTicket({ ...selectedTicket, status: newStatus });
            }
        } catch (error) {
            showNotification('error', 'Failed to update status');
        }
    };

    const [isInternal, setIsInternal] = useState(false);
    const quickReplies = [
        { label: 'Solved', text: 'I have resolved this issue for you. Please let us know if you need further assistance.' },
        { label: 'Wait', text: 'I am looking into this for you. Please bear with me for a few moments.' },
        { label: 'Refund', text: 'I have initiated your refund request. It should reflect in 3-5 business days.' },
    ];

    const handleAddMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim() || !selectedTicket) return;

        try {
            const res = await api.post(`/tickets/${selectedTicket._id}/messages`, {
                message: reply,
                isInternal: isInternal
            });
            setSelectedTicket(res.data);
            setReply('');
            setIsInternal(false);
            showNotification('success', isInternal ? 'Internal note added' : 'Reply sent');
        } catch (error) {
            showNotification('error', 'Failed to send reply');
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'open': return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200 dark:border-sky-800';
            case 'in_progress': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800';
            case 'resolved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            case 'closed': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'text-rose-600 bg-rose-100 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300';
            case 'high': return 'text-orange-600 bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300';
            case 'medium': return 'text-indigo-600 bg-indigo-100 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300';
            default: return 'text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
        }
    };

    const stats = [
        { label: 'Total Tickets', count: tickets.length, icon: Inbox, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Open', count: tickets.filter((t: any) => t.status === 'open').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Resolved', count: tickets.filter((t: any) => t.status === 'resolved').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Urgent', count: tickets.filter((t: any) => t.priority === 'urgent').length, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    ];

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
                        {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        <span className="font-medium">{notification.message}</span>
                        <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80">
                            <X className="h-4 w-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                        Support Center
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage and respond to customer inquiries efficiently.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchTickets()}
                        className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted transition-all active:scale-95 text-muted-foreground"
                        title="Refresh"
                    >
                        <RefreshCw className={cn("h-5 w-5 transition-all", loading && "animate-spin")} />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95 font-bold"
                    >
                        <Plus className="h-5 w-5" />
                        New Ticket
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6 transition-all hover:translate-y-[-4px] hover:shadow-lg border-primary/5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <h3 className="text-3xl font-black mt-2">{stat.count}</h3>
                            </div>
                            <div className={cn("p-3 rounded-2xl", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Filter Bar */}
            <Card className="p-4 flex flex-col lg:flex-row gap-4 bg-muted/30 border-none shadow-none">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search tickets by ID, subject or customer..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-background shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-background rounded-2xl border shadow-sm">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Status</span>
                        <select
                            className="bg-transparent border-none focus:ring-0 text-sm font-bold cursor-pointer outline-none pl-2"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-background rounded-2xl border shadow-sm">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Priority</span>
                        <select
                            className="bg-transparent border-none focus:ring-0 text-sm font-bold cursor-pointer outline-none pl-2"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Tickets Table/List */}
            <Card className="overflow-hidden border-primary/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 text-muted-foreground text-xs font-black uppercase tracking-wider border-b">
                            <tr>
                                <th className="px-6 py-4">Ticket</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Assigned To</th>
                                <th className="px-6 py-4">Last Updated</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {tickets.map((ticket: any) => (
                                <tr
                                    key={ticket._id}
                                    className="group hover:bg-muted/30 transition-all cursor-pointer"
                                    onClick={() => setSelectedTicket(ticket)}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {ticket.ticketId.split('-')[1]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-foreground group-hover:text-primary transition-colors">{ticket.subject}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-mono text-muted-foreground">{ticket.ticketId}</span>
                                                    <span className="text-[10px] text-muted-foreground">•</span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {ticket.customerName || 'Anonymous'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn("px-3 py-1 rounded-full text-xs font-black uppercase tracking-tight border", getStatusStyle(ticket.status))}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-tight border w-fit", getPriorityStyle(ticket.priority))}>
                                            <span className={cn("h-2 w-2 rounded-full",
                                                ticket.priority === 'urgent' ? 'bg-rose-500' :
                                                    ticket.priority === 'high' ? 'bg-orange-500' : 'bg-indigo-500'
                                            )} />
                                            {ticket.priority}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                                                <User className="h-3 w-3" />
                                            </div>
                                            {ticket.assignedAgent?.name || 'Unassigned'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-muted-foreground">
                                        {new Date(ticket.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Delete this ticket?')) {
                                                        api.delete(`/tickets/${ticket._id}`).then(() => {
                                                            showNotification('success', 'Ticket deleted');
                                                            fetchTickets();
                                                        });
                                                    }
                                                }}
                                                className="p-2 rounded-lg hover:bg-rose-50 text-muted-foreground hover:text-rose-600 transition-colors"
                                                title="Delete Ticket"
                                            >
                                                <div className="h-5 w-5 flex items-center justify-center">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                </div>
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tickets.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center grayscale opacity-50">
                                            <Inbox className="h-16 w-16 mb-4 text-muted-foreground" />
                                            <h3 className="text-xl font-bold">No tickets found</h3>
                                            <p className="max-w-[200px] text-sm mt-2">Try adjusting your filters or search terms.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                                            <p className="text-muted-foreground font-medium">Fetching support tickets...</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create Ticket Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-card w-full max-w-xl rounded-3xl shadow-2xl border border-primary/10 overflow-hidden relative z-[120]"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-black">Create New Ticket</h2>
                                        <p className="text-muted-foreground text-sm">Fill in the details for the support request.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 rounded-xl hover:bg-muted transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold uppercase tracking-tight text-muted-foreground ml-1">Subject</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-5 py-3 rounded-2xl border border-border bg-muted/20 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all font-medium"
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                            placeholder="What is this issue about?"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold uppercase tracking-tight text-muted-foreground ml-1">Customer Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-muted/20 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all font-medium text-sm"
                                                    value={formData.customerName}
                                                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold uppercase tracking-tight text-muted-foreground ml-1">Customer Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <input
                                                    type="email"
                                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-muted/20 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all font-medium text-sm"
                                                    value={formData.customerEmail}
                                                    onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                                                    placeholder="hello@example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold uppercase tracking-tight text-muted-foreground ml-1">Priority Level</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['low', 'medium', 'high', 'urgent'].map((p) => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, priority: p })}
                                                    className={cn(
                                                        "py-2 rounded-xl text-xs font-black uppercase tracking-tighter border transition-all",
                                                        formData.priority === p
                                                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                                                            : "bg-muted/10 border-border hover:border-primary/30"
                                                    )}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold uppercase tracking-tight text-muted-foreground ml-1">Message Description</label>
                                        <textarea
                                            required
                                            className="w-full px-5 py-4 rounded-2xl border border-border bg-muted/20 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none min-h-[120px] transition-all font-medium resize-none shadow-inner"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Detailed description of the problem..."
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 px-6 py-3.5 rounded-2xl border border-border hover:bg-muted transition-all font-bold text-muted-foreground"
                                        >
                                            Discard
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xl shadow-primary/20 font-bold flex items-center justify-center gap-2"
                                        >
                                            {submitting ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                "Create Ticket"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Ticket Details Side Panel/Slide-over */}
            <AnimatePresence>
                {selectedTicket && (
                    <div className="fixed inset-0 z-[110] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTicket(null)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-card w-full max-w-2xl h-full shadow-2xl border-l border-primary/10 relative z-[120] flex flex-col"
                        >
                            {/* Panel Header */}
                            <div className="p-6 border-b flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedTicket(null)}
                                        className="p-2 rounded-xl border hover:bg-muted transition-colors"
                                    >
                                        <ChevronRight className="h-5 w-5 rotate-180" />
                                    </button>
                                    <div>
                                        <h2 className="text-xl font-black">{selectedTicket.ticketId}</h2>
                                        <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">ID: {selectedTicket._id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        className={cn("text-xs font-black uppercase tracking-tight px-3 py-1.5 rounded-full border cursor-pointer outline-none transition-all shadow-sm", getStatusStyle(selectedTicket.status))}
                                        value={selectedTicket.status}
                                        onChange={(e) => handleUpdateStatus(selectedTicket._id, e.target.value)}
                                    >
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>

                                    {/* Assign Agent Dropdown */}
                                    <div className="relative">
                                        <select
                                            className="text-xs font-bold text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border cursor-pointer outline-none hover:bg-muted/50 transition-colors appearance-none pr-8"
                                            value={selectedTicket.assignedAgent?._id || selectedTicket.assignedAgent || ''}
                                            onChange={async (e) => {
                                                const agentId = e.target.value;
                                                try {
                                                    await api.put(`/tickets/${selectedTicket._id}`, { assignedAgent: agentId || null });
                                                    showNotification('success', agentId ? 'Agent assigned' : 'Ticket unassigned');
                                                    fetchTickets();
                                                    // Update local state to reflect change immediately in UI
                                                    const assignedAgentObj = agents.find((a: any) => a._id === agentId);
                                                    setSelectedTicket({
                                                        ...selectedTicket,
                                                        assignedAgent: assignedAgentObj || (agentId ? { _id: agentId, name: 'Loading...' } : null)
                                                    });
                                                } catch (err) {
                                                    showNotification('error', 'Failed to assign agent');
                                                }
                                            }}
                                        >
                                            <option value="">Unassigned</option>
                                            {agents.map((agent: any) => (
                                                <option key={agent._id} value={agent._id}>
                                                    {agent.name}
                                                </option>
                                            ))}
                                        </select>
                                        <User className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                                    </div>

                                    <button className="p-2 rounded-xl border hover:bg-muted transition-colors">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Panel Body */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 w-fit text-primary font-bold text-xs">
                                        <Tag className="h-3.5 w-3.5" />
                                        {selectedTicket.priority} Priority
                                    </div>
                                    <h1 className="text-3xl font-black tracking-tight">{selectedTicket.subject}</h1>
                                    <div className="flex flex-wrap gap-4 p-4 rounded-2xl bg-muted/30 border">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-background border flex items-center justify-center">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-muted-foreground uppercase">Customer</p>
                                                <p className="font-bold">{selectedTicket.customerName || 'Anonymous'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 border-l pl-4">
                                            <div className="h-10 w-10 rounded-full bg-background border flex items-center justify-center">
                                                <Mail className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-muted-foreground uppercase">Email</p>
                                                <p className="font-bold">{selectedTicket.customerEmail || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-black flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5 text-primary" />
                                        Conversation History
                                    </h3>
                                    <div className="space-y-6">
                                        {selectedTicket.messages.map((msg: any, i: number) => (
                                            <div key={i} className={cn(
                                                "flex flex-col gap-2 max-w-[85%]",
                                                msg.sender === 'agent' ? "ml-auto items-end" : "items-start",
                                                msg.isInternal && "!max-w-[70%] ml-auto items-end"
                                            )}>
                                                <div className={cn(
                                                    "px-5 py-3 rounded-2xl shadow-sm border font-medium text-sm leading-relaxed relative",
                                                    msg.sender === 'agent'
                                                        ? "bg-primary text-primary-foreground border-primary shadow-primary/10 rounded-br-none"
                                                        : "bg-card border-border rounded-bl-none",
                                                    msg.isInternal && "!bg-amber-100 !text-amber-900 !border-amber-200 italic"
                                                )}>
                                                    {msg.isInternal && <span className="absolute -top-2.5 right-2 bg-amber-500 text-[8px] font-black uppercase text-white px-1.5 py-0.5 rounded-full border border-white">Internal Note</span>}
                                                    {msg.message}
                                                </div>
                                                <div className="flex items-center gap-2 px-1">
                                                    <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                                                        {msg.sender === 'agent' ? (msg.isInternal ? 'Internal Note' : 'Support Agent') : (msg.sender === 'bot' ? 'AI Assistant' : 'Customer')}
                                                    </span>
                                                    <span className="text-muted-foreground text-[10px]">•</span>
                                                    <span className="text-muted-foreground text-[10px]">
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Reply Box */}
                            <div className="p-6 border-t bg-card">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {quickReplies.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setReply(q.text)}
                                            className="px-3 py-1.5 rounded-xl border border-dashed border-primary/30 text-[10px] font-black uppercase text-primary hover:bg-primary/5 transition-all"
                                        >
                                            {q.label}
                                        </button>
                                    ))}
                                </div>
                                <form onSubmit={handleAddMessage} className="space-y-4">
                                    <div className="relative group">
                                        <textarea
                                            placeholder={isInternal ? "Write an internal note for the team..." : "Type your reply to the customer..."}
                                            className={cn(
                                                "w-full px-5 py-4 rounded-2xl border bg-muted/20 outline-none min-h-[100px] transition-all font-medium resize-none shadow-inner",
                                                isInternal
                                                    ? "border-amber-400 focus:ring-4 focus:ring-amber-500/10 focus:bg-amber-500/5 placeholder:text-amber-500/40"
                                                    : "border-border focus:ring-4 focus:ring-primary/10 focus:border-primary/50"
                                            )}
                                            value={reply}
                                            onChange={(e) => setReply(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsInternal(!isInternal)}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight border transition-all",
                                                    isInternal ? "bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-500/20" : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                                                )}
                                            >
                                                {isInternal ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border-2 border-current" />}
                                                Internal Note
                                            </button>
                                            {isInternal && (
                                                <p className="text-[10px] text-amber-600 font-bold italic animate-pulse">Customers won't see this.</p>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!reply.trim()}
                                            className={cn(
                                                "px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95 shadow-xl",
                                                isInternal
                                                    ? "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20"
                                                    : "bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20"
                                            )}
                                        >
                                            {isInternal ? "Add Note" : "Send Reply"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tickets;

