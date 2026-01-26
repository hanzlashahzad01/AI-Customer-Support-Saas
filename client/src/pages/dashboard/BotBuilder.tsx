import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash, Loader2, Sparkles, BookOpen, Settings2, HelpCircle, MessageCircleCode } from 'lucide-react';

const BotBuilder = () => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'settings' | 'training'>('settings');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState({
        name: 'Support Bot',
        welcomeMessage: 'Hello! How can I help you today?',
        tone: 'professional',
        language: 'English',
        confidenceThreshold: 0.7,
        trainingData: '',
        productDescriptions: '',
        primaryColor: '#4f46e5',
        isActive: true
    });
    const [faqs, setFaqs] = useState<{ question: string, answer: string }[]>([]);

    useEffect(() => {
        const fetchBot = async () => {
            if (!user?.companyId) return;
            try {
                setIsLoading(true);
                const res = await api.get(`/bot/${user.companyId}`);
                if (res.data) {
                    setSettings({
                        name: res.data.name || 'Support Bot',
                        welcomeMessage: res.data.welcomeMessage || 'Hello! How can I help you today?',
                        tone: res.data.tone || 'professional',
                        language: res.data.language || 'English',
                        confidenceThreshold: res.data.confidenceThreshold || 0.7,
                        trainingData: res.data.trainingData || '',
                        productDescriptions: res.data.productDescriptions || '',
                        primaryColor: res.data.primaryColor || '#4f46e5',
                        isActive: res.data.isActive !== undefined ? res.data.isActive : true
                    });
                    setFaqs(res.data.faqs || []);
                }
            } catch (error) {
                console.error("Failed to fetch bot settings", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBot();
    }, [user?.companyId]);

    const handleSaveSettings = async () => {
        if (!user?.companyId) return;
        setIsSaving(true);
        try {
            await api.post('/bot', {
                companyId: user.companyId,
                ...settings,
                faqs
            });
            alert('Bot configuration synchronized!');
        } catch (error) {
            console.error('Failed to save settings', error);
            alert('Failed to save configuration');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddFaq = () => {
        setFaqs([{ question: '', answer: '' }, ...faqs]);
    };

    const handleRemoveFaq = (index: number) => {
        setFaqs(faqs.filter((_, i) => i !== index));
    };

    const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
        const newFaqs = [...faqs];
        newFaqs[index][field] = value;
        setFaqs(newFaqs);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <Loader2 className="animate-spin h-10 w-10 text-primary opacity-50" />
                <p className="text-sm text-muted-foreground animate-pulse">Initializing AI brain...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        Bot Builder <Sparkles className="h-6 w-6 text-yellow-500 fill-yellow-500/20" />
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">Design your AI's personality and define its knowledge base.</p>
                </div>
                <Button onClick={handleSaveSettings} disabled={isSaving} className="px-6 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Sync Configuration
                </Button>
            </div>

            <div className="flex p-1.5 bg-muted/50 backdrop-blur-sm rounded-2xl w-fit border border-border/50">
                {[
                    { id: 'settings', label: 'Personality', icon: Settings2 },
                    { id: 'training', label: 'Knowledge Base', icon: BookOpen }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                            ? 'bg-background text-primary shadow-sm border border-border/50'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'settings' ? (
                    <motion.div
                        key="settings"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid md:grid-cols-5 gap-8"
                    >
                        <div className="md:col-span-3 space-y-6">
                            <Card className="p-8 space-y-8 border-none shadow-xl bg-card/50">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        label="Custom Bot Name"
                                        value={settings.name}
                                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                                        placeholder="e.g. Maverick"
                                    />
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold">Base Language</label>
                                        <select
                                            className="w-full flex h-10 rounded-2xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background outline-none transition-all focus:ring-2 focus:ring-primary"
                                            value={settings.language}
                                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                        >
                                            <option className="bg-card text-foreground" value="English">English</option>
                                            <option className="bg-card text-foreground" value="Spanish">Spanish</option>
                                            <option className="bg-card text-foreground" value="French">French</option>
                                            <option className="bg-card text-foreground" value="German">German</option>
                                            <option className="bg-card text-foreground" value="Urdu">Urdu / Hindi</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-semibold flex items-center gap-2">
                                        Greeting Message
                                        <div className="px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] uppercase font-bold">First impression</div>
                                    </label>
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-2xl border border-input bg-background/50 backdrop-blur px-4 py-3 text-sm ring-offset-background transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={settings.welcomeMessage}
                                        onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                                        placeholder="How should your bot greet customers?"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-semibold">Communication Tone</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {[
                                            { id: 'professional', label: 'Professional', desc: 'Formal' },
                                            { id: 'friendly', label: 'Friendly', desc: 'Warm' },
                                            { id: 'humorous', label: 'Playful', desc: 'Funny' },
                                            { id: 'empathetic', label: 'Empathetic', desc: 'Caring' }
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setSettings({ ...settings, tone: t.id })}
                                                className={`flex flex-col items-start p-3 rounded-2xl border-2 text-left transition-all ${settings.tone === t.id
                                                    ? 'bg-primary/5 border-primary ring-4 ring-primary/5 shadow-inner'
                                                    : 'bg-card border-border hover:border-primary/50 grayscale opacity-60'
                                                    }`}
                                            >
                                                <span className="text-xs font-bold block">{t.label}</span>
                                                <span className="text-[10px] mt-0.5 opacity-70 leading-tight">{t.desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-semibold">Auto-Escalation Threshold</label>
                                        <span className="text-xs font-black text-primary">{Math.round(settings.confidenceThreshold * 100)}% Confidence</span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">If AI's confidence in an answer falls below this, it will automatically create a human support ticket.</p>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="0.9"
                                        step="0.05"
                                        className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                                        value={settings.confidenceThreshold}
                                        onChange={(e) => setSettings({ ...settings, confidenceThreshold: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </Card>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            <Card className="p-6 border-none shadow-lg bg-primary/5 ring-1 ring-primary/20">
                                <h3 className="font-bold flex items-center gap-2 text-primary mb-3">
                                    <Sparkles className="h-4 w-4" /> Smart Personality
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Your bot's tone dictates how it generates responses. <b>Empathetic</b> bots are great for sensitive support, while <b>Professional</b> bots are best for SaaS/B2B.
                                </p>
                            </Card>
                            <Card className="p-6 border-none shadow-lg">
                                <h3 className="font-bold text-sm mb-4">Widget Branding</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Brand Color</span>
                                            <div className="h-6 w-6 rounded-md border" style={{ backgroundColor: settings.primaryColor }} />
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={settings.primaryColor}
                                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                                className="h-10 w-12 rounded-xl bg-muted/50 border p-1 cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.primaryColor}
                                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                                className="flex-1 px-4 rounded-xl bg-muted/50 border text-xs font-mono uppercase"
                                                placeholder="#000000"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border">
                                        <div className="space-y-0.5">
                                            <span className="text-xs font-bold block">Status</span>
                                            <span className="text-[10px] text-muted-foreground">{settings.isActive ? 'Online' : 'Offline'}</span>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, isActive: !settings.isActive })}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.isActive ? 'bg-primary' : 'bg-muted'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="training"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-10"
                    >
                        {/* Custom Context Sections */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="p-8 border-none shadow-xl bg-card space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-black tracking-tight">System Knowledge</h3>
                                </div>
                                <p className="text-xs text-muted-foreground">Provide direct text about your service, policy, or business. The AI uses this as its primary brain.</p>
                                <textarea
                                    className="w-full min-h-[200px] rounded-2xl border border-input bg-muted/20 p-4 text-sm outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                                    placeholder="Paste your business description, refund policy, etc..."
                                    value={settings.trainingData}
                                    onChange={(e) => setSettings({ ...settings, trainingData: e.target.value })}
                                />
                            </Card>

                            <Card className="p-8 border-none shadow-xl bg-card space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                                        <HelpCircle className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-black tracking-tight">Product Descriptions</h3>
                                </div>
                                <p className="text-xs text-muted-foreground">List your products or services here. Include features, pricing, and unique selling points.</p>
                                <textarea
                                    className="w-full min-h-[200px] rounded-2xl border border-input bg-muted/20 p-4 text-sm outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                                    placeholder="Product A: $20, Features: Fast delivery... Product B: ..."
                                    value={settings.productDescriptions}
                                    onChange={(e) => setSettings({ ...settings, productDescriptions: e.target.value })}
                                />
                            </Card>
                        </div>

                        {/* FAQ Section */}
                        <Card className="p-8 border-none shadow-2xl bg-card/70">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                                        <MessageCircleCode className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold tracking-tight">Instant-Response FAQs</h3>
                                        <p className="text-sm text-muted-foreground">Explicit Question-Answer pairs for high precision.</p>
                                    </div>
                                </div>
                                <Button onClick={handleAddFaq} className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 px-6 gap-2 border-none">
                                    <Plus className="h-4 w-4 font-bold" /> New FAQ
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {faqs.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border/50">
                                        <div className="p-4 rounded-full bg-muted/50 mb-4">
                                            <HelpCircle className="h-10 w-10 text-muted-foreground opacity-30" />
                                        </div>
                                        <p className="text-muted-foreground font-medium">No knowledge entries found.</p>
                                        <p className="text-xs text-muted-foreground mt-1">Start by adding your first FAQ question.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-6">
                                        {faqs.map((faq, index) => (
                                            <motion.div
                                                key={index}
                                                layout
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="group relative flex gap-4 p-6 rounded-3xl bg-muted/20 border border-transparent hover:border-primary/20 hover:bg-background transition-all hover:shadow-xl hover:shadow-primary/5"
                                            >
                                                <div className="flex flex-col items-center pt-2">
                                                    <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                                    <div className="w-0.5 flex-1 bg-border/40 my-2" />
                                                </div>

                                                <div className="flex-1 grid gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Question</label>
                                                        <input
                                                            placeholder="e.g. What is your refund policy?"
                                                            value={faq.question}
                                                            onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                                            className="w-full bg-transparent border-none shadow-none text-base font-bold px-1 h-auto focus:ring-0 outline-none placeholder:text-muted-foreground/30"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">AI Answer</label>
                                                        <textarea
                                                            placeholder="Provide a detailed answer for the AI to learn..."
                                                            className="flex min-h-[80px] w-full bg-transparent border-none px-1 py-0 text-sm ring-0 focus:ring-0 focus:outline-none resize-none placeholder:text-muted-foreground/30 text-muted-foreground"
                                                            value={faq.answer}
                                                            onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveFaq(index)}
                                                    className="shrink-0 p-2 h-fit text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BotBuilder;
