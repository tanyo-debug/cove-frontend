/**
 * Hook for global keyboard shortcuts.
 * Manages search focus, selection, and navigation.
 */
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
export function useKeyboardShortcuts() {
    const { toggleSidebar, clearSelection, setActiveView } = useAppStore();
    useEffect(() => {
        const handler = (e) => {
            // Ctrl/Cmd + F → focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                setActiveView('search');
            }
            // Ctrl/Cmd + B → toggle sidebar
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                toggleSidebar();
            }
            // Escape → clear selection
            if (e.key === 'Escape') {
                clearSelection();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [toggleSidebar, clearSelection, setActiveView]);
}
