/**
 * Global application state managed with Zustand.
 * Uses state slicing to minimize rerenders across components.
 */
import { create } from 'zustand';
export const useAppStore = create((set, get) => ({
    images: [],
    clusters: [],
    searchResults: [],
    searchQuery: '',
    sidebarCollapsed: false,
    selectedImages: new Set(),
    activeView: 'library',
    indexingStatus: {
        isIndexing: false,
        stage: 'idle',
        progress: 0,
        processed: 0,
        total: 0,
    },
    hardwareInfo: {
        cpuUsage: 0,
        gpuUsage: 0,
        gpuAvailable: true,
    },
    setImages: (images) => set({ images }),
    setClusters: (clusters) => set({ clusters }),
    setSearchResults: (results) => set({ searchResults: results }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    selectImage: (id) => set({ selectedImages: new Set([id]) }),
    toggleImageSelection: (id) => {
        const selected = new Set(get().selectedImages);
        if (selected.has(id))
            selected.delete(id);
        else
            selected.add(id);
        set({ selectedImages: selected });
    },
    selectRange: (startId, endId) => {
        const { images } = get();
        const startIdx = images.findIndex((i) => i.id === startId);
        const endIdx = images.findIndex((i) => i.id === endId);
        if (startIdx === -1 || endIdx === -1)
            return;
        const [lo, hi] = [Math.min(startIdx, endIdx), Math.max(startIdx, endIdx)];
        const selected = new Set(images.slice(lo, hi + 1).map((i) => i.id));
        set({ selectedImages: selected });
    },
    clearSelection: () => set({ selectedImages: new Set() }),
    setActiveView: (view) => set({ activeView: view }),
    setIndexingStatus: (status) => set((s) => ({ indexingStatus: { ...s.indexingStatus, ...status } })),
    setHardwareInfo: (info) => set((s) => ({ hardwareInfo: { ...s.hardwareInfo, ...info } })),
}));
