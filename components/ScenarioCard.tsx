
import React from 'react';
import { Scenario } from '../types';
import { AlertCircle, ArrowRight, SkipForward } from 'lucide-react';

interface ScenarioCardProps {
  scenario: Scenario;
  onSelectOption: (optionId: string) => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onSelectOption, onSkip, isSubmitting }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-fade-in-up">
      {/* Header/Context Strip */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {scenario.phase}
            </span>
        </div>
        <h2 className="text-slate-300 text-xs sm:text-sm font-semibold uppercase tracking-widest hidden sm:block">Scenario Interface</h2>
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
          {scenario.title}
        </h1>

        <div className="prose prose-slate max-w-none mb-8">
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed border-l-4 border-teal-500 pl-4 bg-slate-50 py-2 rounded-r-lg">
            {scenario.description}
          </p>
          <div className="mt-4 flex items-start text-sm text-slate-500 bg-slate-100 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
            <p>{scenario.context}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Select Your Course of Action:</h3>
          {scenario.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              disabled={isSubmitting}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden
                ${isSubmitting 
                  ? 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-60' 
                  : 'border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 cursor-pointer shadow-sm hover:shadow-md'
                }
              `}
            >
              <div className="flex items-center justify-between z-10 relative">
                <span className="font-medium text-slate-800 text-sm sm:text-base group-hover:text-teal-900 pr-4">
                  {option.text}
                </span>
                <ArrowRight className={`hidden sm:block h-5 w-5 text-slate-300 group-hover:text-teal-500 transition-transform transform group-hover:translate-x-1 flex-shrink-0 ${isSubmitting ? 'hidden' : ''}`} />
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
            <button 
                onClick={onSkip}
                className="text-xs sm:text-sm text-slate-400 hover:text-slate-600 flex items-center transition-colors"
            >
                End Assessment & Generate Report Now <SkipForward className="w-3 h-3 ml-1" />
            </button>
        </div>

        {isSubmitting && (
            <div className="mt-6 flex items-center justify-center space-x-2 text-teal-600 animate-pulse">
                <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <span className="text-sm font-medium ml-2">Analyzing leadership impact...</span>
            </div>
        )}
      </div>
    </div>
  );
};
