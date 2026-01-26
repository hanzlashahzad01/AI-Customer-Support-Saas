import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Loader2, Mail, User, ShieldCheck, Code, Globe, Layout, Copy } from 'lucide-react';
import api from '../../services/api';
import { cn } from '../../utils/cn';

const Settings = () => {
    const { user } = useAuthStore();
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'integration'>('profile');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        companyId: user?.companyId || ''
    });

    const [botSettings, setBotSettings] = useState({
        primaryColor: '#6366f1',
        widgetPosition: 'bottom-right',
        widgetCss: ''
    });

    const [isLoadingBot, setIsLoadingBot] = useState(false);
    const [isSavingBot, setIsSavingBot] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                companyId: user.companyId || ''
            });

            const fetchBotSettings = async () => {
                try {
                    setIsLoadingBot(true);
                    const res = await api.get(`/bot/${user.companyId}`);
                    if (res.data) {
                        setBotSettings({
                            primaryColor: res.data.primaryColor || '#6366f1',
                            widgetPosition: res.data.widgetPosition || 'bottom-right',
                            widgetCss: res.data.widgetCss || ''
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch bot settings", error);
                } finally {
                    setIsLoadingBot(false);
                }
            };
            if (user.companyId) fetchBotSettings();
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await api.put('/users/me', {
                name: formData.name,
                email: formData.email.trim().toLowerCase()
            });
            useAuthStore.setState(state => ({
                user: { ...state.user, ...res.data }
            }));
            alert('Profile updated successfully!');
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveBotSettings = async () => {
        setIsSavingBot(true);
        try {
            await api.post('/bot', {
                companyId: user?.companyId,
                ...botSettings
            });
            alert('Widget settings saved successfully!');
        } catch (error: any) {
            console.error(error);
            alert('Failed to save widget settings');
        } finally {
            setIsSavingBot(false);
        }
    };

    const integrationScript = `<script src="http://localhost:5000/widget/script.js?id=${user?.companyId}" async></script>`;

    if (!user) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Settings & Integration</h1>
                    <p className="text-muted-foreground mt-2 font-medium">Manage your personal profile and website integration.</p>
                </div>
            </div>

            <div className="flex gap-2 p-1.5 bg-muted/50 rounded-2xl w-fit border">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all", activeTab === 'profile' ? "bg-background shadow-sm" : "hover:bg-muted text-muted-foreground")}
                >
                    Account
                </button>
                <button
                    onClick={() => setActiveTab('integration')}
                    className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all", activeTab === 'integration' ? "bg-background shadow-sm" : "hover:bg-muted text-muted-foreground")}
                >
                    Widget Integration
                </button>
            </div>

            <div className="grid gap-8">
                {activeTab === 'profile' ? (
                    /* Profile Section */
                    <Card className="p-0 overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm">
                        <div className="p-6 border-b bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <User className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold">Profile Details</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        label="Full Name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your full name"
                                        icon={<User className="h-4 w-4" />}
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="your@email.com"
                                        icon={<Mail className="h-4 w-4" />}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="font-semibold text-sm">Account Type</p>
                                            <p className="text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                                        Active
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button type="submit" disabled={isSaving} className="px-8 flex items-center gap-2 shadow-lg shadow-primary/20">
                                        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                                        Update Profile
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                ) : (
                    /* Integration Section */
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <Card className="p-8 border-none shadow-xl bg-card/50 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Web SDK</h2>
                                    <p className="text-xs text-muted-foreground font-medium">Connect PerfectPick to your website with a single line of code.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    Widget Installation Code
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full">Copy & Paste</span>
                                </label>
                                <div className="relative group">
                                    <pre className="p-6 rounded-2xl bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-zinc-800 shadow-inner whitespace-pre">
                                        <code>{integrationScript}</code>
                                    </pre>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(integrationScript);
                                            alert('✅ Widget code copied to clipboard!');
                                        }}
                                        className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed font-medium">
                                        📋 <strong>Installation Instructions:</strong> Copy the code above and paste it at the bottom of your website's HTML file, just before the closing <code className="px-1.5 py-0.5 bg-blue-500/20 rounded">&lt;/body&gt;</code> tag.
                                    </p>
                                </div>
                            </div>

                            <hr className="border-border/50" />

                            <div className="grid md:grid-cols-2 gap-8 pt-2">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Layout className="h-4 w-4 text-primary" />
                                        <h3 className="font-bold text-sm">Visual Settings</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Button Position</label>
                                            <select
                                                value={botSettings.widgetPosition}
                                                onChange={(e) => setBotSettings({ ...botSettings, widgetPosition: e.target.value })}
                                                className="w-full p-3 rounded-xl bg-muted/50 border text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                            >
                                                <option className="bg-card text-foreground" value="bottom-right">Bottom Right</option>
                                                <option className="bg-card text-foreground" value="bottom-left">Bottom Left</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Brand Color</label>
                                            <div className="flex gap-3">
                                                <input
                                                    type="color"
                                                    value={botSettings.primaryColor}
                                                    onChange={(e) => setBotSettings({ ...botSettings, primaryColor: e.target.value })}
                                                    className="h-10 w-14 rounded-lg bg-muted/50 border p-1 cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={botSettings.primaryColor}
                                                    onChange={(e) => setBotSettings({ ...botSettings, primaryColor: e.target.value })}
                                                    className="flex-1 px-4 rounded-xl bg-muted/50 border text-sm font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Code className="h-4 w-4 text-rose-500" />
                                        <h3 className="font-bold text-sm">Custom CSS (Overwrite)</h3>
                                    </div>
                                    <textarea
                                        className="w-full h-32 p-4 rounded-2xl bg-muted/50 border font-mono text-[10px] outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                        placeholder="#pp-widget-bubble { border-radius: 5px; }"
                                        value={botSettings.widgetCss}
                                        onChange={(e) => setBotSettings({ ...botSettings, widgetCss: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end border-t pt-6">
                                <Button
                                    onClick={handleSaveBotSettings}
                                    disabled={isSavingBot}
                                    className="px-8 shadow-lg shadow-primary/20"
                                >
                                    {isSavingBot && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                    Save Widget Settings
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-8 border-none shadow-xl bg-primary/5 ring-1 ring-primary/20">
                            <div className="flex gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm h-fit">
                                    <ShieldCheck className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-black text-primary">Domain Whitelisting</h4>
                                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                        For enhanced security, your widget will only load on approved domains.
                                        You can manage your whitelisted domains in the <b>Security Center</b> (Coming Soon).
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
