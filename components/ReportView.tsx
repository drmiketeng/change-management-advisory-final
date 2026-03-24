
import React from 'react';
import { AssessmentState } from '../types';
import { PrayerPlayer } from './PrayerPlayer';
import { FileText, BookOpen, Sparkles, List, ExternalLink } from 'lucide-react';

interface ReportViewProps {
  state: AssessmentState;
}

export const ReportView: React.FC<ReportViewProps> = ({ state }) => {
  const { finalReport } = state;

  if (!finalReport) return null;

  const resources = [
      "Turnaround Centre",
      "Transformation Centre",
      "Business Model Centre",
      "Accounting Financial Centre",
      "Digital AI Centre",
      "Merger Acquisition Centre",
      "Change Management Centre",
      "Corporate Culture Centre"
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* FAITH BASED: Prayer Section at Top */}
      {state.isFaithBased && finalReport.prayerContent && (
        <div className="bg-white rounded-2xl shadow-xl border-t-4 border-indigo-500 overflow-hidden">
          <div className="bg-indigo-50 px-6 sm:px-8 py-6 border-b border-indigo-100 text-center">
             <h2 className="text-2xl font-bold text-indigo-900 mb-2">Spiritual Perspectives. Secular Impacts</h2>
             <div className="inline-block px-4 py-2 bg-white rounded-lg border border-indigo-100 shadow-sm italic text-indigo-800 font-medium">
                 "Proverbs 16:9: A man's heart plans his way, but the Lord directs his steps."
             </div>
          </div>
          <div className="p-6 sm:p-8">
             <div className="mb-6 flex items-center justify-center">
                 <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
                 <span className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Personalized Prayer Guidance</span>
             </div>
             <PrayerPlayer text={finalReport.prayerContent} />
             <div className="prose prose-indigo max-w-none bg-slate-50 p-6 rounded-xl border border-slate-100 italic text-slate-700 mt-6">
                {finalReport.prayerContent.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* MAIN REPORT */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
         <div className="bg-slate-900 px-6 sm:px-8 py-6 text-white flex justify-between items-center">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold">Change Management Advisory Report</h2>
                <p className="text-slate-400 text-sm mt-1">Based on the Corporate Transformation Methodology</p>
            </div>
            <FileText className="w-8 h-8 text-teal-400" />
         </div>
         
         <div className="p-6 sm:p-8 space-y-8">
            
            <section>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">Executive Summary</h3>
                <p className="text-slate-700 leading-relaxed">{finalReport.executiveSummary}</p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">Detailed Analysis</h3>
                <div className="prose prose-slate max-w-none text-slate-700">
                    {finalReport.detailedAnalysis.split('\n').map((paragraph, idx) => {
                         if (paragraph.trim().startsWith('###')) {
                             return <h4 key={idx} className="text-lg font-bold text-teal-700 mt-6 mb-2">{paragraph.replace('###', '').trim()}</h4>;
                         }
                         if (paragraph.trim().startsWith('**')) {
                             return <strong key={idx} className="block mt-4 mb-1 text-slate-900">{paragraph.replace(/\*\*/g, '')}</strong>
                         }
                         return <p key={idx} className="mb-3">{paragraph}</p>;
                    })}
                </div>
            </section>

            {/* NEW: Submission Summary Section */}
            <section className="pt-8">
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4 flex items-center">
                    <List className="w-5 h-5 mr-2 text-slate-500" /> Submission History
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
                        <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs">
                            <tr>
                                <th className="p-3 border-b border-slate-200">Phase</th>
                                <th className="p-3 border-b border-slate-200">Scenario Title</th>
                                <th className="p-3 border-b border-slate-200">Selected Style</th>
                                <th className="p-3 border-b border-slate-200 text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {state.history.map((item, idx) => {
                                const phaseSimple = item.phase.includes(':') ? item.phase.split(':')[1] : item.phase;
                                const scoreColor = item.feedback.score >= 80 ? 'text-green-600' : item.feedback.score >= 60 ? 'text-yellow-600' : 'text-red-600';
                                return (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-3 font-medium text-slate-500">{phaseSimple}</td>
                                        <td className="p-3 text-slate-900">{item.scenario.title}</td>
                                        <td className="p-3">
                                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold border border-slate-200">
                                                {item.feedback.leadershipTrait}
                                            </span>
                                        </td>
                                        <td className={`p-3 text-right font-bold ${scoreColor}`}>{item.feedback.score}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* OTHER USEFUL RESOURCES */}
            <section className="pt-8">
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4 flex items-center">
                    <ExternalLink className="w-5 h-5 mr-2 text-slate-500" /> Other Helpful Resources
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {resources.map((res, idx) => (
                        <div key={idx} className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                            <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                            <span className="text-sm font-medium text-slate-700">{res}</span>
                        </div>
                    ))}
                </div>
            </section>

         </div>
         
         <div className="bg-slate-50 px-6 sm:px-8 py-6 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                <BookOpen className="w-4 h-4 mr-2" /> Sources of References
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                <li>• Ancient Chinese Wisdom to Transform Your Business: Lessons from Zheng He, Confucius and Sun Zi by Dr. Michael Teng</li>
                <li>• Admiral Zheng He: The Collaborative Transformational Expert by Dr. Michael Teng</li>
                <li>• Change Management Leadership: Biblical Perspective by Dr. Michael Teng</li>
            </ul>
         </div>
      </div>
    </div>
  );
};
