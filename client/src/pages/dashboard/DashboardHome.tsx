import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/ui/Card';
import api from '../../services/api';
import {
    MessageSquare,
    Ticket,
    Clock,
    User,
    ChevronRight,
    ArrowUpRight,
    Zap,
    Users,
    Activity,
    Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const DashboardHome = () => {
    const user = useAuthStore(state => state.user);
    const [statsData, setStatsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/stats/dashboard');
                setStatsData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: 'Total Tickets', value: statsData?.stats.totalTickets || '0', change: '+12.5%', icon: Ticket, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Open Tickets', value: statsData?.stats.openTickets || '0', change: '+5.2%', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Urgent Help', value: statsData?.stats.urgentTickets || '0', change: 'Live', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Active Agents', value: statsData?.stats.activeAgents || '0', change: 'Online', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <Loader2 className="animate-spin h-8 w-8 text-primary opacity-50" />
                <p className="text-sm text-muted-foreground">Gathering business intelligence...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                        Good Afternoon, {user?.name.split(' ')[0] || 'Admin'}!
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Your support team has resolved <span className="text-foreground font-black">{statsData?.stats.resolvedTickets || 0} tickets</span> total.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-600 rounded-2xl border border-indigo-500/20 font-bold text-sm">
                    <Zap className="h-4 w-4 fill-current" />
                    Pro Plan Active
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="p-6 relative overflow-hidden group hover:translate-y-[-4px] transition-all hover:shadow-xl border-primary/5">
                            <div className="flex justify-between items-start mb-6">
                                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter",
                                    stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600' :
                                        stat.change.startsWith('-') ? 'bg-rose-500/10 text-rose-600' : 'bg-muted text-muted-foreground'
                                )}>
                                    {stat.change}
                                    {stat.change.includes('%') && <ArrowUpRight className={cn("h-2.5 w-2.5", stat.change.startsWith('-') && "rotate-90")} />}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
                                <p className="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</p>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.05] transition-all">
                                <stat.icon className="h-24 w-24" />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="p-8 h-full border-primary/5 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Performance Analytics</h3>
                                <p className="text-sm text-muted-foreground">Ticket volume vs resolution rate</p>
                            </div>
                            <select className="bg-muted/50 dark:bg-card border-none text-xs font-bold px-4 py-2 rounded-xl outline-none cursor-pointer">
                                <option className="bg-card">Last 7 Days</option>
                                <option className="bg-card">Last 30 Days</option>
                            </select>
                        </div>
                        <div className="h-[350px] w-full min-h-[350px] min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={statsData?.chartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.1} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-card/90 backdrop-blur-md border border-border/50 p-4 rounded-2xl shadow-xl space-y-2">
                                                        <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
                                                        {payload.map((entry: any, index: number) => (
                                                            <div key={index} className="flex items-center gap-3">
                                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                                <span className="text-sm font-bold text-foreground">{entry.name === 'tickets' ? 'Total Tickets' : 'Resolved'}</span>
                                                                <span className="text-sm font-black ml-auto tabular-nums">{entry.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                        cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '4 4', opacity: 0.5 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="tickets"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorTickets)"
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="resolved"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRes)"
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="p-8 h-full border-primary/5 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black tracking-tight">Recent Activity</h3>
                            <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-6">
                            {(statsData?.recentActivity || [1, 2, 3, 4, 5]).map((_: any, i: number) => (
                                <div key={i} className="flex items-start gap-4 group cursor-pointer transition-all">
                                    <div className="relative">
                                        <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center font-black text-primary overflow-hidden">
                                            <User className="h-5 w-5 opacity-50" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-card" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors truncate">New activity logged</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">Updates to company profile...</p>
                                        <p className="text-[10px] text-muted-foreground mt-1 uppercase font-black tracking-wider">{i + 1}h ago</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 rounded-xl border border-dashed border-muted-foreground/20 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted/30 transition-all">
                            View All Activity
                        </button>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardHome;

