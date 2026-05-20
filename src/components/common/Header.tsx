import React from 'react';
import { Trash2, Calculator } from 'lucide-react';
import { BRAND } from '../../constants/branding';

interface HeaderProps {
  hasImage: boolean;
  onStartOver: () => void;
  onQuoteClick: () => void;
  isQuoteAvailable: boolean;
}

const Header: React.FC<HeaderProps> = ({
  hasImage, onStartOver, onQuoteClick, isQuoteAvailable
}) => {
  return (
    <header className="border-b border-[#7C3AED]/15 bg-[#060B18]/95 backdrop-blur-md sticky top-0 z-10 shadow-[0_1px_24px_rgba(124,58,237,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 bg-[#7C3AED]/20 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#A78BFA]">
              <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/>
              <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/>
              <path d="M14.5 17.5 4.5 15"/>
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-bold text-[15px] leading-none tracking-tight text-white whitespace-nowrap">
              {BRAND.name}
            </h1>
            <span className="text-[8px] uppercase tracking-[0.18em] font-semibold whitespace-nowrap mt-0.5"
              style={{background: BRAND.accentGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              {BRAND.tagline}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {hasImage && (
            <button onClick={onStartOver}
              className="hover:text-red-400 text-red-500/70 transition-colors hidden sm:flex items-center gap-1.5 text-xs font-medium"
              title="Start Over"
            >
              <Trash2 className="w-3.5 h-3.5" /><span>Reset</span>
            </button>
          )}

          <button onClick={onQuoteClick} disabled={!isQuoteAvailable}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-all active:scale-95 text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap ${
              isQuoteAvailable
                ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                : 'bg-[#1E293B] text-[#475569] cursor-not-allowed'
            }`}
          >
            <Calculator className="w-3 h-3" />
            <span className="hidden sm:inline">Get Paint Estimate</span>
            <span className="sm:hidden">Estimate</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
