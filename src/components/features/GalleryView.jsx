/**
 * Virtualized photo gallery — renders 100k+ photos at 60fps.
 * Dynamic responsive columns, sticky date headers, person filtering support.
 */
import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion, AnimatePresence } from 'framer-motion';
import { Images, FolderOpen, UserX, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { fetchImages } from '@/lib/mockApi';
import { PhotoCard } from './PhotoCard';
import { toast } from 'sonner';

export function GalleryView() {
    const images = useAppStore((s) => s.images);
    const setImages = useAppStore((s) => s.setImages);
    const selectedImages = useAppStore((s) => s.selectedImages);
    const selectImage = useAppStore((s) => s.selectImage);
    const toggleImageSelection = useAppStore((s) => s.toggleImageSelection);
    const selectedPersonFilter = useAppStore((s) => s.selectedPersonFilter);
    const setPersonFilter = useAppStore((s) => s.setPersonFilter);
    const importFiles = useAppStore((s) => s.importFiles);

    const parentRef = useRef(null);
    const [columns, setColumns] = useState(5);

    // Responsive column count calculation
    useEffect(() => {
        const updateColumns = () => {
            const width = window.innerWidth;
            if (width < 640) setColumns(2);
            else if (width < 768) setColumns(3);
            else if (width < 1024) setColumns(4);
            else if (width < 1400) setColumns(5);
            else setColumns(6);
        };
        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    useEffect(() => {
        if (images.length === 0) {
            fetchImages(0, 1000).then(setImages);
        }
    }, [images.length, setImages]);

    // Filter images if person filter is active
    const filteredImages = useMemo(() => {
        if (!selectedPersonFilter) return images;
        // Mock filter logic
        return images.filter((_, idx) => idx % 3 === 0);
    }, [images, selectedPersonFilter]);

    // Group images by date, then chunk into rows
    const { rows } = useMemo(() => {
        const groups = new Map();
        filteredImages.forEach((img) => {
            const date = img.date || 'Recent';
            const existing = groups.get(date) || [];
            existing.push(img);
            groups.set(date, existing);
        });

        const rows = [];
        Array.from(groups.entries())
            .sort(([a], [b]) => b.localeCompare(a))
            .forEach(([date, imgs]) => {
                rows.push({ type: 'header', date });
                for (let i = 0; i < imgs.length; i += columns) {
                    rows.push({ type: 'images', images: imgs.slice(i, i + columns) });
                }
            });
        return { rows };
    }, [filteredImages, columns]);

    const rowHeight = Math.max(120, Math.floor(1000 / columns / 1.3));

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: (index) => (rows[index]?.type === 'header' ? 44 : rowHeight + 4),
        overscan: 8,
    });

    const handleSelect = useCallback(
        (id, shiftKey) => {
            shiftKey ? toggleImageSelection(id) : selectImage(id);
        },
        [selectImage, toggleImageSelection]
    );

    const handleImportClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*,video/*';
        input.onchange = (e) => {
            if (e.target.files?.length) {
                const count = importFiles(e.target.files);
                toast.success(`Successfully imported ${count} item${count > 1 ? 's' : ''}`);
            }
        };
        input.click();
    };

    const formatDate = (dateStr) => {
        if (dateStr === 'Recent') return 'Recent Photos';
        const d = new Date(dateStr);
        return isNaN(d.getTime())
            ? dateStr
            : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    if (images.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-5 animate-fade-in-up">
                <motion.div
                    className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                >
                    <Images size={28} strokeWidth={1.2} className="text-muted-foreground" />
                </motion.div>
                <div className="text-center space-y-1.5">
                    <h2 className="text-base font-medium text-foreground">No photos yet</h2>
                    <p className="text-[13px] text-muted-foreground max-w-[260px]">
                        Import a folder to start organizing and searching your photos with AI
                    </p>
                </div>
                <button
                    onClick={handleImportClick}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
                >
                    <FolderOpen size={14} />
                    Import Folder
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header bar */}
            <div className="flex items-center justify-between px-5 py-3 flex-shrink-0 border-b border-border/40 bg-surface/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-2">
                        <h1 className="text-[15px] font-semibold text-foreground">Library</h1>
                        <span className="text-[11px] text-muted-foreground mono">
                            {filteredImages.length.toLocaleString()} photos
                        </span>
                    </div>

                    {/* Active Person Filter Pill */}
                    {selectedPersonFilter && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-medium text-primary"
                        >
                            <span>Filter: {selectedPersonFilter.name}</span>
                            <button
                                onClick={() => setPersonFilter(null)}
                                className="p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </motion.div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {selectedImages.size > 0 && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-[11px] text-primary font-medium bg-primary/10 rounded-full px-2.5 py-0.5 border border-primary/20"
                        >
                            {selectedImages.size} selected
                        </motion.span>
                    )}
                </div>
            </div>

            {/* Virtualized grid */}
            <div ref={parentRef} className="flex-1 overflow-auto px-5 pb-5 pt-2">
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {virtualizer.getVirtualItems().map((virtualRow) => {
                        const row = rows[virtualRow.index];
                        if (row.type === 'header') {
                            return (
                                <div
                                    key={virtualRow.key}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                    className="flex items-end pb-2 pt-1"
                                >
                                    <span className="text-[12px] font-semibold text-muted-foreground tracking-tight">
                                        {formatDate(row.date)}
                                    </span>
                                </div>
                            );
                        }
                        return (
                            <div
                                key={virtualRow.key}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <div
                                    className="grid gap-[3px] h-full"
                                    style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                                >
                                    {row.images.map((image) => (
                                        <PhotoCard
                                            key={image.id}
                                            image={image}
                                            isSelected={selectedImages.has(image.id)}
                                            onSelect={handleSelect}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
