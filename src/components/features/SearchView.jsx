/**
 * Semantic search — centered hero search with CLIP-powered results.
 * Raycast-inspired search UI with animated transitions.
 */
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { searchImages } from '@/lib/mockApi';
import { PhotoCard } from './PhotoCard';
const SUGGESTIONS = ['beach sunset', 'birthday party', 'dog running', 'mountain landscape', 'family dinner', 'city at night'];
export function SearchView() {
    const searchQuery = useAppStore((s) => s.searchQuery);
    const setSearchQuery = useAppStore((s) => s.setSearchQuery);
    const searchResults = useAppStore((s) => s.searchResults);
    const setSearchResults = useAppStore((s) => s.setSearchResults);
    const selectedImages = useAppStore((s) => s.selectedImages);
    const selectImage = useAppStore((s) => s.selectImage);
    const toggleImageSelection = useAppStore((s) => s.toggleImageSelection);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        setLoading(true);
        const timer = setTimeout(() => {
            searchImages(searchQuery).then((results) => {
                setSearchResults(results);
                setLoading(false);
            });
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery, setSearchResults]);
    const handleSelect = useCallback((id, shiftKey) => {
        shiftKey ? toggleImageSelection(id) : selectImage(id);
    }, [selectImage, toggleImageSelection]);
    const hasResults = searchResults.length > 0;
    const showEmpty = searchQuery.trim().length > 0 && !loading && !hasResults;
    return (<div className="h-full overflow-auto flex flex-col">
      {/* Hero area when no results */}
      {!hasResults && !loading && !showEmpty && (<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col items-center justify-center pt-32 pb-8 px-4">
          <motion.div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
            <Sparkles size={20} className="text-primary"/>
          </motion.div>
          <h1 className="text-lg font-semibold text-foreground mb-1.5">Semantic Search</h1>
          <p className="text-[13px] text-muted-foreground mb-6 text-center max-w-sm leading-relaxed">
            Describe what you're looking for in natural language.
            Powered by CLIP embeddings.
          </p>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-1.5 justify-center max-w-md">
            {SUGGESTIONS.map((s, i) => (<motion.button key={s} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} onClick={() => setSearchQuery(s)} className="rounded-full border border-border bg-card hover:bg-surface-hover hover:border-primary/30 px-3 py-1.5 text-[11px] text-secondary-foreground transition-all duration-200">
                {s}
              </motion.button>))}
          </div>
        </motion.div>)}

      {/* Loading */}
      {loading && (<div className="flex items-center justify-center py-20">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
            <Loader2 size={14} className="animate-spin text-primary"/>
            Searching for "{searchQuery}"...
          </motion.div>
        </div>)}

      {/* Empty state */}
      {showEmpty && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Search size={28} strokeWidth={1.2} className="mb-3 text-muted-foreground/50"/>
          <p className="text-[13px]">No results for "{searchQuery}"</p>
          <p className="text-[11px] text-muted-foreground/60 mt-1">Try a different description</p>
        </motion.div>)}

      {/* Results */}
      <AnimatePresence>
        {hasResults && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="px-5 pb-5">
            <div className="flex items-baseline gap-2 mb-3 pt-1">
              <span className="text-[12px] text-muted-foreground">
                {searchResults.length} results
              </span>
              <span className="text-[11px] text-muted-foreground/50">for "{searchQuery}"</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-[3px]">
              {searchResults.map((image, i) => (<motion.div key={image.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.015, 0.5), duration: 0.25 }}>
                  <PhotoCard image={image} isSelected={selectedImages.has(image.id)} onSelect={handleSelect}/>
                </motion.div>))}
            </div>
          </motion.div>)}
      </AnimatePresence>
    </div>);
}
