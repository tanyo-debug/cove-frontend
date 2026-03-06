/**
 * Settings view with hardware monitoring and configuration options.
 */
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Cpu, Zap, HardDrive, Folder, Info } from 'lucide-react';

export function SettingsView() {
  const hardwareInfo = useAppStore((s) => s.hardwareInfo);

  const cards = [
    { label: 'CPU', value: `${hardwareInfo.cpuUsage}%`, icon: Cpu, color: 'text-primary' },
    { label: 'GPU', value: hardwareInfo.gpuAvailable ? `${hardwareInfo.gpuUsage}%` : 'N/A', icon: Zap, color: 'text-accent' },
    { label: 'GPU Accel.', value: hardwareInfo.gpuAvailable ? 'Active' : 'Off', icon: HardDrive, color: 'text-success' },
  ];

  return (
    <div className="h-full overflow-auto p-6 max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[15px] font-semibold text-foreground mb-0.5">Settings</h1>
        <p className="text-[12px] text-muted-foreground">Configure VisionArchive AI</p>
      </div>

      {/* Hardware cards */}
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-3">
          Hardware
        </p>
        <div className="grid grid-cols-3 gap-2">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <card.icon size={16} className={`mx-auto mb-2 ${card.color}`} />
              <p className="text-[18px] font-semibold text-foreground mono">{card.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{card.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Paths */}
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-3">
          Library
        </p>
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] text-foreground">
              <Folder size={14} className="text-muted-foreground" />
              Photo Library
            </div>
            <span className="text-[11px] mono text-muted-foreground">~/Pictures</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] text-foreground">
              <HardDrive size={14} className="text-muted-foreground" />
              Index Database
            </div>
            <span className="text-[11px] mono text-muted-foreground">~/.visionarchive</span>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
        <Info size={14} className="text-muted-foreground flex-shrink-0" />
        <div>
          <p className="text-[12px] text-foreground">VisionArchive AI v0.1.0</p>
          <p className="text-[10px] text-muted-foreground">CLIP + InsightFace + FAISS · Local-first</p>
        </div>
      </div>
    </div>
  );
}
