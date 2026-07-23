/**
 * Global Error Boundary — Catches unhandled React render errors gracefully.
 */
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Unhandled React Error:', error, errorInfo);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen w-screen flex-col items-center justify-center bg-background p-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
                        <AlertTriangle size={32} />
                    </div>
                    <h1 className="text-xl font-bold text-foreground mb-2">Something went wrong</h1>
                    <p className="text-[13px] text-muted-foreground max-w-md mb-6 leading-relaxed">
                        An unexpected application error occurred. We have safely logged the trace. Please refresh or try again.
                    </p>
                    <button
                        onClick={handleReload}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        <RefreshCw size={14} /> Reload VisionArchive
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
