import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
    LayoutDashboard,
    MessageSquare,
    Bot,
    Users,
    Settings,
    LogOut,
    Ticket,
    Activity,
    Sparkles
} from 'lucide-react';
import { cn } from '../utils/cn';

const Sidebar = () => {
    const logout = useAuthStore((state: any) => state.logout);
    const user = useAuthStore((state: any) => state.user);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Analytics', path: '/dashboard' },
        { icon: Ticket, label: 'Support Center', path: '/dashboard/tickets' },
        { icon: MessageSquare, label: 'Live Sessions', path: '/dashboard/chat' },
        { icon: Bot, label: 'AI Brain', path: '/dashboard/bot' },
        { icon: Users, label: 'Team', path: '/dashboard/agents' },
        { icon: Activity, label: 'Audit Logs', path: '/dashboard/activity' },
    ];

    return (
        <div className="h-screen w-64 bg-card/50 backdrop-blur-xl border-r border-border/50 flex flex-col p-6 fixed left-0 top-0 z-50">
            <div className="flex items-center gap-3 px-2 mb-10 group cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-all">
                    <Sparkles className="text-white h-5 w-5" />
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-lg tracking-tighter leading-none">Perfect Pick</span>
                    <span className="text-[10px] font-black uppercase text-primary/60 tracking-[0.2em] mt-1">Enterprise</span>
                </div>
            </div>

            <div className="flex-1 space-y-8">
                <div className="space-y-1">
                    <p className="px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-4">Main Navigation</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all relative group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="space-y-1">
                    <p className="px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-4">System</p>
                    <NavLink
                        to="/dashboard/settings"
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all relative group",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                    >
                        <Settings className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                        Management
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all group"
                    >
                        <LogOut className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                        Secure Logout
                    </button>
                </div>
            </div>

            <div className="mt-auto p-4 rounded-3xl bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black text-xs">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-black truncate">{user?.name}</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold truncate tracking-widest">{user?.role?.replace('_', ' ')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
