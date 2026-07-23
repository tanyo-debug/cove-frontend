/**
 * Root page rendering the desktop layout.
 * Initializes mock data on mount.
 */
import { useEffect } from 'react';
import { DesktopLayout } from '@/layouts/DesktopLayout';
import { useAppStore } from '@/store/useAppStore';
const Index = () => {
    const setHardwareInfo = useAppStore((s) => s.setHardwareInfo);
    const setIndexingStatus = useAppStore((s) => s.setIndexingStatus);
    // Initialize mock hardware + indexing data
    useEffect(() => {
        setHardwareInfo({ cpuUsage: 34, gpuUsage: 67, gpuAvailable: true });
        setIndexingStatus({
            isIndexing: true,
            stage: 'embedding',
            progress: 67,
            processed: 67432,
            total: 100000,
        });
    }, [setHardwareInfo, setIndexingStatus]);
    return <DesktopLayout />;
};
export default Index;
