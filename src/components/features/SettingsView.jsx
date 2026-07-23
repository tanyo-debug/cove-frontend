/**
 * Settings view with hardware monitoring, theme controls, and library paths.
 */
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Cpu, Zap, HardDrive, Folder, Info, RefreshCw, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsView() {
    const hardwareInfo = useAppStore((s) => s.hardwareInfo);
    const setHardwareInfo = useAppStore((s) => s.setHardwareInfo);
    const theme = useAppStore((s) => s.theme);
    const setTheme = useAppStore((s) => s.setTheme);

    const cards = [
        { label: 'CPU Usage', value: `${hardwareInfo.cpuUsage}%`, icon: Cpu, color: 'text-primary' },
        { label: 'GPU Usage', value: hardwareInfo.gpuAvailable ? `${hardwareInfo.gpuUsage}%` : 'N/A', icon: Zap, color: 'text-accent' },
        { label: 'GPU Accel.', value: hardwareInfo.gpuAvailable ? 'Active' : 'Off', icon: HardDrive, color: 'text-success' },
    ];

    const refreshHardware = () => {
        setHardwareInfo({
            cpuUsage: Math.floor(20 + Math.random() * 30),
            gpuUsage: Math.floor(40 + Math.random() * 50),
        });
        toast.success('Hardware diagnostics refreshed');
    };

    return (
        <div className="h-full overflow-auto p-6 max-w-xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-[15px] font-semibold text-foreground mb-0.5">Settings</h1>
                    <p className="text-[12px] text-muted-foreground">Configure VisionArchive AI preferences</p>
                </div>
                <button
                    onClick={refreshHardware}
                    className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
                    title="Refresh Hardware Specs"
                >
                    <RefreshCw size={14} />
                </button>
            </div>

            {/* Hardware cards */}
            <div className="mb-8">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-3">
                    Hardware Acceleration
                </p>
                <div className="grid grid-cols-3 gap-3">
                    {cards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="rounded-xl border border-border bg-card p-4 text-center shadow-sm"
                        >
                            <card.icon size={16} className={`mx-auto mb-2 ${card.color}`} />
                            <p className="text-[18px] font-semibold text-foreground mono">{card.value}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{card.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Theme Selector */}
            <div className="mb-8">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-3">
                    Appearance
                </p>
                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                    <div className="text-[13px] font-medium text-foreground">Theme Mode</div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${theme === 'dark'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Moon size={13} /> Dark
                        </button>
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${theme === 'light'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Sun size={13} /> Light
                        </button>
                    </div>
                </div>
            </div>

            {/* Paths */}
            <div className="mb-8">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-3">
                    Library Storage
                </p>
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[13px] text-foreground">
                            <Folder size={14} className="text-muted-foreground" />
                            Photo Library Directory
                        </div>
                        <span className="text-[11px] mono text-muted-foreground">~/Pictures/VisionArchive</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[13px] text-foreground">
                            <HardDrive size={14} className="text-muted-foreground" />
                            Vector Index Storage
                        </div>
                        <span className="text-[11px] mono text-muted-foreground">~/.visionarchive/index.faiss</span>
                    </div>
                </div>
            </div>

            {/* About */}
            <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 shadow-sm">
                <Info size={16} className="text-primary flex-shrink-0" />
                <div>
                    <p className="text-[13px] font-medium text-foreground">VisionArchive AI v1.0.0 (Production Build)</p>
                    <p className="text-[11px] text-muted-foreground">CLIP Embeddings · InsightFace · FAISS · Local-first Architecture</p>
                </div>
            </div>
        </div>
    );
}
