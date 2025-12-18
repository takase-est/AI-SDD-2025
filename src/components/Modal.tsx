import React, { useEffect, useRef } from 'react';
import { XIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="w-full max-w-lg transform overflow-hidden bg-dark-950 border border-neon-blue shadow-[0_0_30px_rgba(0,243,255,0.15)] p-6 text-left align-middle transition-all relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Decorative corner markers */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-blue"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-blue"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-blue"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-blue"></div>

        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-2">
          <h3 className="text-xl font-display font-bold tracking-wider text-neon-blue uppercase" id="modal-headline">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-none p-1 text-slate-400 hover:text-neon-pink hover:bg-slate-900 transition-colors focus:outline-none"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="font-sans">
          {children}
        </div>
      </div>
    </div>
  );
};