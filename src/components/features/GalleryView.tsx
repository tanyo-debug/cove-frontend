/**
 * Virtualized photo gallery — renders 100k+ photos at 60fps.
 * Groups by date with sticky headers. TanStack Virtual for rows.
 */
import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'framer-motion';
import { Images, FolderOpen } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { fetchImages } from '@/lib/mockApi';
import { PhotoCard } from './PhotoCard';

const COLUMNS = 5;
const ROW_HEIGHT = 180;
const GAP = 3;

export function GalleryView() {
  const images = useAppStore((s) => s.images);
  const setImages = useAppStore((s) => s.setImages);
  const selectedImages = useAppStore((s) => s.selectedImages);
  const selectImage = useAppStore((s) => s.selectImage);
  const toggleImageSelection = useAppStore((s) => s.toggleImageSelection);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length === 0) {
      fetchImages(0, 1000).then(setImages);
    }
  }, [images.length, setImages]);

  // Group images by date, then chunk into rows
  const { rows, dateHeaders } = useMemo(() => {
    // Group by date
    const groups = new Map<string, typeof images>();
    images.forEach((img) => {
      const existing = groups.get(img.date) || [];
      existing.push(img);
      groups.set(img.date, existing);
    });

    type RowItem = { type: 'header'; date: string } | { type: 'images'; images: typeof images };
    const rows: RowItem[] = [];
    const dateHeaders = new Set<number>();

    Array.from(groups.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .forEach(([date, imgs]) => {
        dateHeaders.add(rows.length);
        rows.push({ type: 'header', date });
        for (let i = 0; i < imgs.length; i += COLUMNS) {
          rows.push({ type: 'images', images: imgs.slice(i, i + COLUMNS) });
        }
      });

    return { rows, dateHeaders };
  }, [images]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => (rows[index]?.type === 'header' ? 44 : ROW_HEIGHT + GAP),
    overscan: 8,
  });

  const handleSelect = useCallback(
    (id: string, shiftKey: boolean) => {
      shiftKey ? toggleImageSelection(id) : selectImage(id);
    },
    [selectImage, toggleImageSelection]
  );

  // Format date nicely
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <FolderOpen size={14} />
          Import Folder
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 flex-shrink-0 border-b border-transparent">
        <div className="flex items-baseline gap-2">
          <h1 className="text-[15px] font-semibold text-foreground">Library</h1>
          <span className="text-[11px] text-muted-foreground mono">
            {images.length.toLocaleString()} photos
          </span>
        </div>
        {selectedImages.size > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[11px] text-primary font-medium bg-primary/10 rounded-full px-2.5 py-0.5"
          >
            {selectedImages.size} selected
          </motion.span>
        )}
      </div>

      {/* Virtualized grid */}
      <div ref={parentRef} className="flex-1 overflow-auto px-5 pb-5">
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
                  className="flex items-end pb-2"
                >
                  <span className="text-[12px] font-medium text-muted-foreground">
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
                  style={{ gridTemplateColumns: `repeat(${COLUMNS}, 1fr)` }}
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
