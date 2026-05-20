import React from 'react';
import { BRAND } from '../../constants/branding';

interface FooterProps {
  onShowToS: () => void;
  onShowPrivacy: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowToS, onShowPrivacy }) => {
  return (
    <footer className="border-t border-[#1E293B] bg-[#060B18] py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest uppercase"
              style={{background: BRAND.accentGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              {BRAND.name}
            </span>
            <span className="text-[9px] text-[#475569]">·</span>
            <span className="text-[9px] text-[#475569]">Powered by Sherwin-Williams Colors</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[9px] text-[#475569]">
              © {new Date().getFullYear()} {BRAND.presenter}. All rights reserved.
            </span>
          </div>
        </div>
        <p className="text-[8px] text-[#334155] text-center mt-3">
          Color accuracy depends on screen calibration. Always test with physical paint samples before purchasing.
          Estimates are approximations — final pricing confirmed by {BRAND.presenter}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
