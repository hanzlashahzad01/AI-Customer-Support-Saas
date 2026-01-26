import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import BotBuilder from './pages/dashboard/BotBuilder';
import ChatWidget from './pages/widget/ChatWidget';
import Tickets from './pages/dashboard/Tickets';
import LiveChat from './pages/dashboard/LiveChat';
import Agents from './pages/dashboard/Agents';
import Settings from './pages/dashboard/Settings';
import AuditLogs from './pages/dashboard/AuditLogs';

const Home = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    if (isAuthenticated) return <Navigate to="/dashboard" />;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="glass p-8 rounded-2xl max-w-2xl w-full text-center">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
                    Perfect Pick AI
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    The Ultimate AI Customer Support & Ticketing Platform.
                </p>
                <div className="flex gap-4 justify-center">
                    <a href="/login" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg shadow-primary/30">
                        Get Started
                    </a>
                </div>
            </div>
        </div>
    );
}

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const user = useAuthStore(state => state.user);
    const location = useLocation();

    console.log('🔒 PrivateRoute check:', { isAuthenticated, hasUser: !!user, path: location.pathname });

    if (!isAuthenticated) {
        console.log('❌ Not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log('✅ Authenticated, rendering protected route');
    return <>{children}</>;
};

function App() {
    const checkAuth = useAuthStore(state => state.checkAuth);
    const isLoading = useAuthStore(state => state.isLoading);
    const { theme } = useThemeStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <p className="text-muted-foreground font-medium">Loading session...</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<DashboardHome />} />
                    <Route path="tickets" element={<Tickets />} />
                    <Route path="chat" element={<LiveChat />} />
                    <Route path="bot" element={<BotBuilder />} />
                    <Route path="agents" element={<Agents />} />
                    <Route path="activity" element={<AuditLogs />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<div className="text-center mt-20 text-muted-foreground">Page Under Construction</div>} />
                </Route>

                <Route path="/widget/:companyId" element={<ChatWidget />} />
            </Routes>
        </Router>
    );
}

export default App;
