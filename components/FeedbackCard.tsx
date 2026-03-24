
import React from 'react';
import { Feedback } from '../types';
import { CheckCircle2, Lightbulb, Target, TrendingUp, Scale, GraduationCap } from 'lucide-react';

interface FeedbackCardProps {
  feedback: Feedback;
  onNext: () => void;
  isLast: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onNext, isLast }) => {
  const scoreColor = feedback.score >= 80 ? 'text-green-600' : feedback.score >= 60 ? 'text-yellow-600' : 'text-red-600';
  const ringColor = feedback.score >= 80 ? 'border-green-500' : feedback.score >= 60 ? 'border-yellow-500' : 'border-red-500';

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-teal-500 animate-fade-in">
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
          <Scale className="h-4 w-4 mr-2" />
          Weighting: 33% of Final Profile
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Calibration ID: #{Math.floor(Math.random() * 1000) + 9000}
        </div>
      </div>
      
      <div className="p-8">
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Score Panel */}
          <div className="w-full md:w-1/4 flex flex-col items-center justify-center bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Decision Quality</h3>
            <div className={`relative w-32 h-32 rounded-full border-8 ${ringColor} flex items-center justify-center bg-white shadow-inner`}>
              <span className={`text-4xl font-bold ${scoreColor}`}>{feedback.score}</span>
            </div>
            <div className="mt-4 text-center w-full">
               <div className="text-xs text-slate-400 uppercase font-bold mb-1">Detected Trait</div>
               <span className="inline-block w-full py-1.5 px-2 bg-slate-200 rounded-md text-xs font-bold text-slate-700 border border-slate-300 truncate">
                 {feedback.leadershipTrait}
               </span>
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="w-full md:w-3/4 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <Target className="h-5 w-5 text-teal-500 mr-2" />
                Impact Analysis
              </h2>
              <p className="mt-2 text-slate-600 leading-relaxed">
                {feedback.analysis}
              </p>
            </div>

            {/* Training Insight Box - New Feature */}
            <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
               <h3 className="text-sm font-bold text-indigo-900 flex items-center uppercase tracking-wide mb-3">
                 <GraduationCap className="h-5 w-5 mr-2 text-indigo-600" />
                 Training Insight
               </h3>
               <p className="text-indigo-800 text-sm leading-relaxed font-medium">
                 {feedback.coachingTips[0]}
               </p>
            </div>

            <div className="bg-teal-50 rounded-xl p-5 border border-teal-100 hidden">
               {/* Kept hidden or reduced as Training Insight takes precedence, but data is available if needed */}
               <ul className="space-y-2">
                 {feedback.coachingTips.slice(1).map((tip, idx) => (
                   <li key={idx} className="flex items-start text-teal-800 text-sm">
                     <span className="mr-2 mt-1.5 block w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0"></span>
                     {tip}
                   </li>
                 ))}
               </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center uppercase tracking-wide mb-2">
                <TrendingUp className="h-4 w-4 mr-2 text-slate-500" />
                Recommendation
              </h3>
              <p className="text-sm text-slate-600 italic border-l-2 border-slate-300 pl-3">
                "{feedback.recommendedAction}"
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end border-t border-slate-100 pt-6">
          <button
            onClick={onNext}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center"
          >
            {isLast ? "View Results Dashboard" : "Proceed to Next Scenario"} <CheckCircle2 className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
