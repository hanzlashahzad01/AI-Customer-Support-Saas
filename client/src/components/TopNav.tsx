import { useState, useEffect } from 'react';
import { Bell, Search, CheckCircle2, AlertCircle, Info, Clock, Sun, Moon } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const TopNav = () => {
    const { user } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
            setUnreadCount(res.data.filter((n: any) => !n.isRead).length);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const markAllRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'new_ticket': return <AlertCircle className="h-4 w-4 text-rose-500" />;
            case 'agent_assigned': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <header className="h-20 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="relative max-w-md w-full hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search for tickets, agents..."
                    className="w-full bg-secondary/50 border-none rounded-xl py-2 pl-10 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
            </div>

            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary transition-all group"
                >
                    {theme === 'light' ? (
                        <Moon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    ) : (
                        <Sun className="h-5 w-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                    )}
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary transition-all relative group"
                    >
                        <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-background animate-pulse" />
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <>
                                <div className="fixed inset-0 z-[-1]" onClick={() => setShowNotifications(false)} />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 mt-3 w-80 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
                                >
                                    <div className="p-4 border-b border-border flex justify-between items-center">
                                        <h3 className="font-bold text-sm">Notifications</h3>
                                        <button
                                            onClick={markAllRead}
                                            className="text-[10px] uppercase font-black tracking-widest text-primary hover:underline"
                                        >
                                            Mark all read
                                        </button>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-10 text-center">
                                                <p className="text-xs text-muted-foreground">All clear!</p>
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n._id}
                                                    className={cn(
                                                        "p-4 border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3",
                                                        !n.isRead && "bg-primary/5 border-l-2 border-l-primary"
                                                    )}
                                                >
                                                    <div className="shrink-0 mt-1">{getIcon(n.type)}</div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold leading-tight">{n.title}</p>
                                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
                                                        <div className="flex items-center gap-1 mt-2 text-[9px] text-muted-foreground font-medium">
                                                            <Clock className="h-3 w-3" />
                                                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-3 bg-muted/30 text-center">
                                        <button className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">View All Activities</button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-8 w-[1px] bg-border mx-2" />

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold">{user?.name}</p>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">{user?.role?.replace('_', ' ')}</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black shadow-lg shadow-primary/20">
                        {user?.name?.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNav;
