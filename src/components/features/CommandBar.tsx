/**
 * Top command bar — Raycast-inspired with search glow, status indicators.
 */
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, FolderOpen, Cpu, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function CommandBar() {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const setActiveView = useAppStore((s) => s.setActiveView);
  const indexingStatus = useAppStore((s) => s.indexingStatus);
  const hardwareInfo = useAppStore((s) => s.hardwareInfo);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) setActiveView('search');
  };

  return (
    <div className="flex h-[52px] items-center gap-3 border-b border-border px-4 bg-surface/50 flex-shrink-0 backdrop-blur-sm">
      {/* Search input */}
      <motion.div
        className={`
          relative flex flex-1 max-w-2xl items-center gap-2.5 rounded-lg px-3 py-[7px]
          transition-all duration-200
          ${focused
            ? 'bg-background border border-primary/40'
            : 'bg-muted/40 border border-transparent hover:bg-muted/60'
          }
        `}
        animate={
          focused
            ? { boxShadow: '0 0 0 3px hsl(215 95% 58% / 0.08), 0 0 20px -4px hsl(215 95% 58% / 0.2)' }
            : { boxShadow: '0 0 0 0px transparent, 0 0 0px 0px transparent' }
        }
        transition={{ duration: 0.2 }}
      >
        <Search size={13} className={`flex-shrink-0 transition-colors ${focused ? 'text-primary' : 'text-muted-foreground'}`} />
        <input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search your photos..."
          className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/70 outline-none"
        />
        <kbd className="hidden sm:inline-flex h-[18px] items-center rounded border border-border/60 bg-muted/50 px-1 text-[9px] font-mono text-muted-foreground">
          ⌘F
        </kbd>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Status pills */}
      <div className="flex items-center gap-2">
        {/* Indexing */}
        {indexingStatus.isIndexing && (
          <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-success animate-pulse" />
              <span className="rounded-full bg-success h-1.5 w-1.5" />
            </span>
            <span className="text-[10px] font-medium text-success mono">
              {Math.round(indexingStatus.progress)}%
            </span>
          </div>
        )}

        {/* Hardware */}
        <div className="hidden md:flex items-center gap-1 rounded-full bg-muted/40 px-2.5 py-1">
          <Cpu size={10} className="text-muted-foreground" />
          <span className="text-[10px] mono text-muted-foreground">{hardwareInfo.cpuUsage}%</span>
          {hardwareInfo.gpuAvailable && (
            <>
              <span className="text-muted-foreground/30 mx-0.5">·</span>
              <Zap size={10} className="text-primary/70" />
              <span className="text-[10px] mono text-muted-foreground">{hardwareInfo.gpuUsage}%</span>
            </>
          )}
        </div>

        {/* Import */}
        <button className="flex items-center gap-1.5 rounded-lg bg-primary/10 hover:bg-primary/15 px-3 py-[6px] text-[12px] font-medium text-primary transition-colors">
          <FolderOpen size={13} />
          <span className="hidden sm:inline">Import</span>
        </button>
      </div>
    </div>
  );
}
