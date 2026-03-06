/**
 * Photo card — Apple Photos inspired with refined hover, GPU-accelerated.
 * Uses forwardRef to avoid React warnings.
 */
import { memo, useState, useCallback, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ImageItem } from '@/store/useAppStore';

interface PhotoCardProps {
  image: ImageItem;
  isSelected: boolean;
  onSelect: (id: string, shiftKey: boolean) => void;
  style?: React.CSSProperties;
}

export const PhotoCard = memo(
  forwardRef<HTMLDivElement, PhotoCardProps>(function PhotoCard({ image, isSelected, onSelect, style }, ref) {
    const [loaded, setLoaded] = useState(false);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        onSelect(image.id, e.shiftKey);
      },
      [image.id, onSelect]
    );

    return (
      <motion.div
        ref={ref}
        className="relative cursor-pointer overflow-hidden rounded-[6px] bg-card group"
        style={{ ...style, willChange: 'transform' }}
        whileHover={{ scale: 1.025 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        onClick={handleClick}
      >
        {/* Shimmer skeleton */}
        {!loaded && (
          <div className="absolute inset-0 shimmer" />
        )}

        {/* Image */}
        <img
          src={image.thumbnail}
          alt={image.tags.join(', ')}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`
            w-full h-full object-cover aspect-square
            transition-all duration-500 ease-out
            ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'}
          `}
          style={{ transform: 'translateZ(0)' }}
        />

        {/* Hover vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Selection overlay */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 ring-2 ring-primary ring-inset rounded-[6px] bg-primary/8"
          >
            <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Check size={10} className="text-primary-foreground" strokeWidth={3} />
            </div>
          </motion.div>
        )}

        {/* Hover checkbox */}
        {!isSelected && (
          <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full border border-foreground/30 bg-background/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200" />
        )}
      </motion.div>
    );
  })
);
