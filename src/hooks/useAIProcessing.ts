import { useState } from 'react';
import { API_BASE } from '../utils/apiConfig';

export function useAIProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQuickGenerating, setIsQuickGenerating] = useState(false);
  const [isDetectingSections, setIsDetectingSections] = useState(false);
  const [detectionProgress, setDetectionProgress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const friendlyError = (msg: string): string => {
    const lower = msg.toLowerCase();
    if (lower.includes('preflight_failure')) return 'This image doesn\'t appear to be an interior room. Please upload a clear photo of your kitchen, bathroom, or living space.';
    if (lower.includes('quota')) return 'Our servers are under heavy load right now. Please try again in a few minutes.';
    if (lower.includes('safety')) return 'This image couldn\'t be processed. Please try a different photo.';
    if (lower.includes('not responding') || lower.includes('failed to fetch') || lower.includes('network')) return 'We\'re having trouble connecting to our servers. Please check your internet connection.';
    if (lower.includes('timeout') || lower.includes('aborted')) return 'The visualization is taking longer than expected. Please try again.';
    return msg;
  };

  return {
    isProcessing,
    setIsProcessing,
    isQuickGenerating,
    setIsQuickGenerating,
    isDetectingSections,
    setIsDetectingSections,
    detectionProgress,
    setDetectionProgress,
    error,
    setError,
    friendlyError,
  };
}
