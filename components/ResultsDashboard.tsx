import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AssessmentState } from '../types';
import { RefreshCw, Trophy, Calculator, BarChart3, FileText, UserCheck, Info, HelpCircle, Scale, Target } from 'lucide-react';

interface ResultsDashboardProps {
  state: AssessmentState;
  onRestart: () => void;
  onGenerateReport: () => void;
  isGeneratingReport: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ state, onRestart, onGenerateReport, isGeneratingReport }) => {
  
  // Average score logic
  const averageScore = state.history.length > 0 
    ? Math.round(state.history.reduce((acc, curr) => acc + curr.feedback.score, 0) / state.history.length)
    : 0;

  // Chart Data: Average score per phase
  const phases = ['Phase 1: Surgery', 'Phase 2: Resuscitation', 'Phase 3: Therapy'];
  const chartData = phases.map(phase => {
      const phaseHistory = state.history.filter(h => h.phase === phase);
      const score = phaseHistory.length > 0 
        ? Math.round(phaseHistory.reduce((acc, curr) => acc + curr.feedback.score, 0) / phaseHistory.length)
        : 0;
      const displayName = phase.includes(':') ? phase.split(':')[1].trim() : phase;
      return { name: displayName, score };
  });

  // Leadership Style Count Logic & Phase Dominance Calculation
  const p1Styles = ['Benevolent Autocratic', 'Paternalistic', 'Task-Oriented', 'Transactional'];
  const p2Styles = ['Democratic', 'Collaborative', 'Participative', 'Coaching'];
  const p3Styles = ['Spiritual', 'Servant Leadership', 'Values-Driven', 'Inspirational'];

  const styleCounts: Record<string, number> = {};
  // Initialize all styles to 0
  [...p1Styles, ...p2Styles, ...p3Styles].forEach(s => styleCounts[s] = 0);

  let p1Count = 0;
  let p2Count = 0;
  let p3Count = 0;

  state.history.forEach(h => {
      if (h.feedback && h.feedback.leadershipTrait) {
          const trait = h.feedback.leadershipTrait;
          styleCounts[trait] = (styleCounts[trait] || 0) + 1;

          // Aggregate Counts per Phase
          if (p1Styles.includes(trait)) p1Count++;
          else if (p2Styles.includes(trait)) p2Count++;
          else if (p3Styles.includes(trait)) p3Count++;
      }
  });

  const totalDecisions = state.history.length || 1;
  const p1Share = p1Count / totalDecisions;
  const p2Share = p2Count / totalDecisions;
  const p3Share = p3Count / totalDecisions;

  // Archetype Logic based on Distribution (> 40% Dominance Rule)
  let archetype = "Hybrid Style";
  let archetypeColor = "text-indigo-600";
  let archetypeDesc = "There is no dominating style (more than 40%) derived by the survey. You display a balanced mix of leadership approaches across the phases.";

  if (p1Share > 0.4001) { // slightly over 0.4 to handle exact 40% case as hybrid if strict >
      archetype = "Phase 1 Dominant";
      archetypeColor = "text-red-600";
      archetypeDesc = "Strong in restructuring to face harsh realities. You display a bias for decisive, command-oriented leadership suited for Crisis (Surgery).";
  } else if (p2Share > 0.4001) {
      archetype = "Phase 2 Dominant";
      archetypeColor = "text-yellow-600";
      archetypeDesc = "Strong in re-vitalising the business. You prioritize team building, innovation, and consensus suited for Growth (Resuscitation).";
  } else if (p3Share > 0.4001) {
      archetype = "Phase 3 Dominant";
      archetypeColor = "text-teal-600";
      archetypeDesc = "Strong in rehabilitating a healthy culture. You focus on values, sustainability, and legacy suited for Therapy.";
  }

  // Configuration for displaying all 12 styles grouped by phase
  const PHASES_CONFIG = [
    {
      title: "Phase 1: Surgery",
      subtitle: "Crisis (Sun Zi)",
      color: "text-red-600",
      bg: "bg-red-50",
      borderColor: "border-red-200",
      styles: p1Styles
    },
    {
      title: "Phase 2: Resuscitation",
      subtitle: "Growth (Confucius)",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      borderColor: "border-yellow-200",
      styles: p2Styles
    },
    {
      title: "Phase 3: Therapy",
      subtitle: "Legacy (Zheng He)",
      color: "text-teal-600",
      bg: "bg-teal-50",
      borderColor: "border-teal-200",
      styles: p3Styles
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header Summary */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-teal-500"></div>
        <div className="inline-flex items-center justify-center p-3 bg-slate-100 rounded-full mb-4 shadow-inner">
          <Trophy className="h-8 w-8 text-slate-700" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Change Management Report</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm group relative z-20">
            <div className="flex items-center justify-center md:justify-start gap-2 cursor-help">
                 <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Advisory Score</span>
                 <HelpCircle className="w-3 h-3 text-slate-400" />
                 
                 {/* Tooltip for Advisory Score */}
                 <div className="group-hover:opacity-100 opacity-0 transition-opacity absolute top-8 left-0 md:-left-12 bg-slate-800 text-white text-xs p-4 rounded-lg w-80 z-50 pointer-events-none shadow-xl text-left">
                    <p className="font-bold mb-2 border-b border-slate-600 pb-1 text-sm">Dr. Teng's Index (Calculation)</p>
                    <div className="mb-3 space-y-1">
                       <p className="text-slate-300 italic mb-2">Average of all your decision points:</p>
                       <div className="grid grid-cols-2 gap-x-2 text-[11px] mt-1 border-l-2 border-slate-500 pl-2">
                          <span>Perfect Choice:</span> <span className="text-green-400 font-bold">100 pts</span>
                          <span>Strong Choice:</span> <span className="text-blue-400 font-bold">75 pts</span>
                          <span>Moderate Choice:</span> <span className="text-yellow-400 font-bold">50 pts</span>
                          <span>Weak Choice:</span> <span className="text-red-400 font-bold">25 pts</span>
                       </div>
                    </div>
                    <p className="font-bold mb-1 text-slate-300 border-t border-slate-600 pt-2">Score Interpretation:</p>
                    <ul className="space-y-2 mt-1">
                        <li className="flex justify-between border-b border-slate-700/50 pb-1">
                            <span>Above 70:</span>
                            <span className="text-green-400 font-bold text-right">Very Adaptable</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-700/50 pb-1">
                            <span>40 - 70:</span>
                            <span className="text-yellow-400 font-bold text-right">Adaptable</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Below 40:</span>
                            <span className="text-red-400 font-bold text-right">Rigid Style</span>
                        </li>
                    </ul>
                 </div>
            </div>
            <div className="text-5xl font-extrabold text-slate-900 mt-2">{averageScore}</div>
            <div className="text-xs text-slate-400 mt-1">Dr. Teng's Index</div>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm md:col-span-2 flex flex-col justify-center items-center md:items-start">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Leadership Archetype</span>
            <div className={`text-3xl font-bold ${archetypeColor} mt-1`}>{archetype}</div>
            <p className="text-sm text-slate-600 mt-2 text-center md:text-left max-w-lg">{archetypeDesc}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Style Framework & Measurement Logic */}
          <div className="lg:col-span-1 bg-slate-900 text-white rounded-2xl shadow-lg p-6 border border-slate-700 flex flex-col gap-6">
              
              {/* Measurement Logic Section */}
              <div>
                 <div className="flex items-center mb-3">
                     <Calculator className="h-5 w-5 text-teal-400 mr-2" />
                     <h3 className="text-sm font-bold uppercase tracking-wider">Measurement Logic</h3>
                 </div>
                 <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                     <div>
                        <strong className="text-white block mb-1">1. Input Mapping (Categorization)</strong>
                        <p className="text-xs text-slate-400 mb-2">
                           Every scenario presents 4 distinct options. Each option is <strong>scientifically mapped</strong> to exactly one of the 12 Leadership Styles.
                        </p>
                        <div className="bg-slate-800 p-2 rounded border border-slate-600 text-[11px] italic">
                            Example: Selecting a "Vote" option adds +1 count to the <strong>Democratic</strong> style.
                        </div>
                     </div>

                     <div>
                        <strong className="text-white block mb-1">2. Scoring (Quality)</strong>
                        <p className="text-xs text-slate-400">
                           Separately, we grade the <strong>effectiveness</strong> of that input for the specific Phase (0-100pts).
                        </p>
                     </div>
                 </div>
              </div>

              {/* Targets Section */}
              <div className="border-t border-slate-700 pt-4">
                  <div className="flex items-center mb-3">
                      <Target className="h-5 w-5 text-teal-400 mr-2" />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Target Styles</h3>
                  </div>
                  <div className="space-y-3 text-xs">
                      <div className="border-l-2 border-red-500 pl-3">
                          <span className="text-red-400 font-bold block uppercase">Phase 1: Surgery</span>
                          <span className="text-slate-400">Target: Benevolent Autocratic</span>
                      </div>
                      <div className="border-l-2 border-yellow-500 pl-3">
                          <span className="text-yellow-400 font-bold block uppercase">Phase 2: Resuscitation</span>
                          <span className="text-slate-400">Target: Democratic, Coaching</span>
                      </div>
                      <div className="border-l-2 border-teal-500 pl-3">
                          <span className="text-teal-400 font-bold block uppercase">Phase 3: Therapy</span>
                          <span className="text-slate-400">Target: Servant Leadership</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* Right: The Visuals */}
          <div className="lg:col-span-2 space-y-8">
            {/* Phase Score Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 h-72 relative z-10">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <BarChart3 className="h-5 w-5 text-teal-600 mr-2" />
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Phase Adaptability Score</h3>
                    </div>
                    
                    <div className="group relative">
                        <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                        <div className="group-hover:opacity-100 opacity-0 transition-opacity absolute top-6 right-0 bg-slate-800 text-white text-xs p-3 rounded-lg w-64 pointer-events-none shadow-xl border border-slate-700 z-50">
                            <p className="font-bold mb-1 border-b border-slate-600 pb-1">Chart Calculation:</p>
                            <p className="text-slate-300 mb-2 leading-tight">
                                This bar represents the <strong>average points</strong> you scored in this specific phase.
                            </p>
                            <ul className="list-disc pl-3 space-y-1 text-[10px] text-slate-400">
                                <li><span className="text-green-400">100%</span>: You perfectly matched the ideal style for every scenario in this phase.</li>
                                <li><span className="text-yellow-400">~50%</span>: You chose neutral or less effective styles for this phase.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
                        cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={50}>
                        {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#eab308' : '#14b8a6'} />
                        ))}
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Leadership Style Profile Breakdown */}
             <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
                    <div className="flex items-center">
                        <UserCheck className="h-5 w-5 text-teal-600 mr-2" />
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Leadership Style Profile</h3>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                        <Scale className="w-3 h-3 mr-1" />
                        <span>Input Count: {state.history.length} / 18</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PHASES_CONFIG.map((phase) => (
                        <div key={phase.title} className={`rounded-xl p-4 border ${phase.borderColor} ${phase.bg}`}>
                            <div className="mb-3 border-b border-slate-200/50 pb-2">
                                <h4 className={`text-xs font-bold uppercase tracking-widest ${phase.color}`}>{phase.title}</h4>
                                <span className="text-[10px] text-slate-500 font-medium uppercase">{phase.subtitle}</span>
                            </div>
                            <div className="space-y-2">
                                {phase.styles.map(style => {
                                    const count = styleCounts[style] || 0;
                                    const isActive = count > 0;
                                    return (
                                        <div key={style} className={`flex items-center justify-between p-2 rounded-lg text-xs transition-all ${isActive ? 'bg-white shadow-sm border border-slate-200 opacity-100' : 'bg-slate-50/50 border border-transparent opacity-50'}`}>
                                            <span className={`font-medium ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{style}</span>
                                            <span className={`w-6 h-6 flex items-center justify-center rounded-md font-bold text-[10px] ${isActive ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                                {count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
                    <Info className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-800 italic leading-relaxed">
                        <p><strong>Input Measurement:</strong> The counts above represent the exact number of times you selected an option mapped to these specific styles.</p>
                        {state.history.length < 18 && (
                            <p className="mt-1 text-red-600 font-semibold">You have only completed {state.history.length} out of 18 scenarios. Completing the full assessment will provide a more accurate profile.</p>
                        )}
                    </div>
                </div>
            </div>
          </div>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <button 
            onClick={onRestart}
            className="flex items-center px-6 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
            <RefreshCw className="w-4 h-4 mr-2" /> Start Over
        </button>
        <button 
            onClick={onGenerateReport}
            disabled={isGeneratingReport}
            className={`flex items-center px-6 py-3 text-white font-medium rounded-xl transition-colors shadow-lg ${isGeneratingReport ? 'bg-slate-600 cursor-wait' : 'bg-slate-900 hover:bg-slate-800'}`}
        >
            {isGeneratingReport ? (
                <>Generating Report...</>
            ) : (
                <> <FileText className="w-4 h-4 mr-2" /> Generate Detailed Report ({state.isFaithBased ? 'Faith' : 'Standard'})</>
            )}
        </button>
      </div>

    </div>
  );
};