import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060B18] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#111827] border border-[#1E293B] rounded-xl p-6 text-center shadow-2xl">
            <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h1 className="text-lg font-bold text-white mb-2 tracking-wide">Something went wrong</h1>
            <p className="text-xs text-[#94A3B8] mb-6 leading-relaxed">
              We encountered an unexpected error while loading the visualizer. 
              {this.state.error && (
                <span className="block mt-2 font-mono text-[10px] text-red-300/80 bg-red-950/20 p-2 rounded text-left overflow-hidden text-ellipsis whitespace-nowrap">
                  {this.state.error.message}
                </span>
              )}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
