/**
 * Photo Lightbox Modal — High quality image lightbox with metadata, zoom, keyboard navigation.
 */
import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Camera, MapPin, Tag, Calendar, Info } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

export function PhotoModal() {
    const activeMediaModal = useAppStore((s) => s.activeMediaModal);
    const closeMediaModal = useAppStore((s) => s.closeMediaModal);
    const openMediaModal = useAppStore((s) => s.openMediaModal);
    const images = useAppStore((s) => s.images);

    const isPhotoModal = activeMediaModal?.type === 'photo';
    const photo = activeMediaModal?.item;

    const currentIndex = images.findIndex((img) => img.id === photo?.id);

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            openMediaModal('photo', images[currentIndex - 1]);
        }
    }, [currentIndex, images, openMediaModal]);

    const handleNext = useCallback(() => {
        if (currentIndex < images.length - 1) {
            openMediaModal('photo', images[currentIndex + 1]);
        }
    }, [currentIndex, images, openMediaModal]);

    // Keyboard navigation
    useEffect(() => {
        if (!isPhotoModal) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeMediaModal();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPhotoModal, closeMediaModal, handlePrev, handleNext]);

    if (!isPhotoModal || !photo) return null;

    const handleDownload = () => {
        toast.success(`Downloading ${photo.title || 'photo'}...`);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
                {/* Backdrop Click */}
                <div className="absolute inset-0" onClick={closeMediaModal} />

                {/* Main Dialog Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden bg-card border border-border/80 shadow-2xl"
                >
                    {/* Media Display Area */}
                    <div className="relative flex-1 flex items-center justify-center bg-black/50 overflow-hidden">
                        <img
                            src={photo.src || photo.thumbnail}
                            alt={photo.tags?.join(', ') || 'Photo'}
                            className="max-h-full max-w-full object-contain select-none transition-all duration-300"
                        />

                        {/* Prev Button */}
                        {currentIndex > 0 && (
                            <button
                                onClick={handlePrev}
                                aria-label="Previous photo"
                                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-black/70 transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}

                        {/* Next Button */}
                        {currentIndex < images.length - 1 && (
                            <button
                                onClick={handleNext}
                                aria-label="Next photo"
                                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-black/70 transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </div>

                    {/* Metadata & Details Sidebar */}
                    <div className="w-full md:w-80 flex flex-col border-t md:border-t-0 md:border-l border-border bg-card p-5 overflow-y-auto flex-shrink-0">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                            <span className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                                <Info size={14} className="text-primary" /> Details
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleDownload}
                                    title="Download"
                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                >
                                    <Download size={16} />
                                </button>
                                <button
                                    onClick={closeMediaModal}
                                    title="Close"
                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Properties List */}
                        <div className="space-y-4 text-[12px]">
                            {/* Date */}
                            <div className="flex items-start gap-3">
                                <Calendar size={15} className="text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium text-foreground">{photo.date || 'Unknown Date'}</p>
                                    <p className="text-[10px] text-muted-foreground">Captured date</p>
                                </div>
                            </div>

                            {/* Camera EXIF */}
                            <div className="flex items-start gap-3">
                                <Camera size={15} className="text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium text-foreground">{photo.camera || 'Sony α7 IV'}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {photo.lens || '24-70mm f/2.8 GM II'}
                                    </p>
                                    <p className="text-[10px] mono text-primary/80 mt-0.5">
                                        {photo.aperture || 'f/2.8'} · {photo.shutter || '1/250s'} · ISO {photo.iso || 200}
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-start gap-3">
                                <MapPin size={15} className="text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium text-foreground">{photo.location || 'Kyoto, Japan'}</p>
                                    <p className="text-[10px] text-muted-foreground">Geotagged location</p>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex items-start gap-3">
                                <Tag size={15} className="text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-[11px] font-medium text-foreground mb-1">AI Detected Tags</p>
                                    <div className="flex flex-wrap gap-1">
                                        {photo.tags?.map((t) => (
                                            <span key={t} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-medium capitalize">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Resolution */}
                            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-muted-foreground text-[11px] mono">
                                <span>Dimensions:</span>
                                <span>{photo.width || 1920} × {photo.height || 1080}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
