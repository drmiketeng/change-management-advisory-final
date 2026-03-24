import React, { useState } from 'react';
import { BrainCircuit, Menu, X, ArrowLeft, Home } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'home') => void;
  onBack?: () => void;
  showBack?: boolean;
  onFeedback: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onBack, showBack, onFeedback }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (view: 'home') => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Navigation Controls (Back/Home) if not on Home */}
          {showBack && (
             <div className="flex items-center gap-2 mr-2 border-r border-slate-700 pr-4">
                <button 
                   onClick={() => handleNav('home')}
                   className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                   title="Home"
                >
                   <Home className="w-5 h-5" />
                </button>
                {onBack && (
                    <button 
                       onClick={onBack}
                       className="flex items-center px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium text-slate-200 transition-colors border border-slate-700 hover:border-slate-500"
                    >
                       <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </button>
                )}
             </div>
          )}

          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNav('home')}
          >
            <div className="bg-teal-500 p-1.5 rounded-lg hidden xs:block">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight leading-none">Change Mgmt Advisory</span>
                  <span className="bg-amber-500 text-white text-[0.65rem] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm transform -translate-y-0.5">Beta</span>
              </div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider hidden sm:block">AI Leadership Studio</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
           {/* Mobile Menu Toggle */}
           <button 
             className="md:hidden p-2 text-slate-300 hover:text-white"
             onClick={() => setIsMenuOpen(!isMenuOpen)}
           >
             {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
           </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button 
              onClick={() => handleNav('home')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700"
            >
              Advisory Home
            </button>
            {showBack && onBack && (
                <button 
                  onClick={() => { onBack(); setIsMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  Go Back
                </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
