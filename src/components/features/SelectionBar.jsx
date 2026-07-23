/**
 * Floating Selection Bar — Appears when items are selected for batch actions.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, CheckSquare, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

export function SelectionBar() {
    const selectedImages = useAppStore((s) => s.selectedImages);
    const clearSelection = useAppStore((s) => s.clearSelection);
    const selectAllImages = useAppStore((s) => s.selectAllImages);
    const deleteSelectedImages = useAppStore((s) => s.deleteSelectedImages);

    const count = selectedImages.size;
    if (count === 0) return null;

    const handleDownload = () => {
        toast.success(`Exporting ${count} selected item${count > 1 ? 's' : ''}...`);
    };

    const handleDelete = () => {
        deleteSelectedImages();
        toast.success(`Deleted ${count} item${count > 1 ? 's' : ''}`);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-full bg-card/90 border border-primary/30 px-4 py-2.5 shadow-2xl backdrop-blur-xl"
            >
                <div className="flex items-center gap-2 border-r border-border pr-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {count}
                    </span>
                    <span className="text-[12px] font-medium text-foreground">Selected</span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={selectAllImages}
                        className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                    >
                        <CheckSquare size={13} />
                        <span>Select All</span>
                    </button>

                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 text-[11px] font-medium transition-colors"
                    >
                        <Download size={13} />
                        <span>Export</span>
                    </button>

                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive px-3 py-1 text-[11px] font-medium transition-colors"
                    >
                        <Trash2 size={13} />
                        <span>Delete</span>
                    </button>

                    <button
                        onClick={clearSelection}
                        aria-label="Clear selection"
                        className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-1"
                    >
                        <X size={14} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
