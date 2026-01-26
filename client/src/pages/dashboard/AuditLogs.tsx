import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/ui/Card';
import { Activity, Download, Filter, Search, Clock, User, FileText, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AuditLog {
    _id: string;
    userId: string;
    userName: string;
    action: string;
    resource: string;
    details: string;
    timestamp: string;
    ipAddress?: string;
    status: 'success' | 'failed';
}

const AuditLogs = () => {
    const { user } = useAuthStore();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed'>('all');

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    const fetchAuditLogs = async () => {
        try {
            setIsLoading(true);
            // For now, we'll create mock data since backend might not have audit logs endpoint
            // You can replace this with actual API call when backend is ready
            const mockLogs: AuditLog[] = [
                {
                    _id: '1',
                    userId: user?.id || '',
                    userName: user?.name || 'User',
                    action: 'LOGIN',
                    resource: 'Authentication',
                    details: 'User logged in successfully',
                    timestamp: new Date().toISOString(),
                    ipAddress: '192.168.1.1',
                    status: 'success'
                },
                {
                    _id: '2',
                    userId: user?.id || '',
                    userName: user?.name || 'User',
                    action: 'CREATE_BOT',
                    resource: 'AI Bot',
                    details: 'Created new AI bot configuration',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    ipAddress: '192.168.1.1',
                    status: 'success'
                },
                {
                    _id: '3',
                    userId: user?.id || '',
                    userName: user?.name || 'User',
                    action: 'UPDATE_SETTINGS',
                    resource: 'Profile Settings',
                    details: 'Updated profile information',
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    ipAddress: '192.168.1.1',
                    status: 'success'
                },
                {
                    _id: '4',
                    userId: user?.id || '',
                    userName: user?.name || 'User',
                    action: 'DELETE_TICKET',
                    resource: 'Support Ticket',
                    details: 'Attempted to delete ticket #1234',
                    timestamp: new Date(Date.now() - 10800000).toISOString(),
                    ipAddress: '192.168.1.1',
                    status: 'failed'
                }
            ];
            setLogs(mockLogs);
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportLogs = () => {
        const csvContent = [
            ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'Status', 'IP Address'],
            ...filteredLogs.map(log => [
                new Date(log.timestamp).toLocaleString(),
                log.userName,
                log.action,
                log.resource,
                log.details,
                log.status,
                log.ipAddress || 'N/A'
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.details.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || log.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getActionIcon = (action: string) => {
        if (action.includes('LOGIN')) return <User className="h-4 w-4" />;
        if (action.includes('CREATE') || action.includes('UPDATE')) return <FileText className="h-4 w-4" />;
        if (action.includes('DELETE')) return <AlertCircle className="h-4 w-4" />;
        return <Activity className="h-4 w-4" />;
    };


    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <Activity className="h-6 w-6" />
                        </div>
                        Audit Logs
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Track all system activities and user actions
                    </p>
                </div>
                <button
                    onClick={handleExportLogs}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                    <Download className="h-4 w-4" />
                    Export Logs
                </button>
            </div>

            <Card className="p-6 border-none shadow-xl bg-card/50">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="px-4 py-3 rounded-xl bg-muted/50 border text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="all">All Status</option>
                            <option value="success">Success</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="text-center py-20">
                        <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">No audit logs found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredLogs.map((log) => (
                            <div
                                key={log._id}
                                className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={cn(
                                            "p-2 rounded-lg",
                                            log.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                        )}>
                                            {getActionIcon(log.action)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-sm">{log.action.replace(/_/g, ' ')}</h3>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                                    log.status === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                                                )}>
                                                    {log.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-2">{log.details}</p>
                                            <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium">
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {log.userName}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FileText className="h-3 w-3" />
                                                    {log.resource}
                                                </span>
                                                {log.ipAddress && (
                                                    <span className="flex items-center gap-1">
                                                        <Activity className="h-3 w-3" />
                                                        {log.ipAddress}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium whitespace-nowrap">
                                        <Clock className="h-3 w-3" />
                                        {new Date(log.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AuditLogs;
