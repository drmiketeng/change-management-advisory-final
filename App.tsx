
import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScenarioCard } from './components/ScenarioCard';
import { FeedbackCard } from './components/FeedbackCard';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ReportView } from './components/ReportView';
import { VirtualAssistant } from './components/VirtualAssistant';
import { FeedbackModal } from './components/FeedbackModal';
import { DisclaimerModal } from './components/Disclaimer';
import { AssessmentState, TurnaroundPhase, Scenario, Feedback } from './types';
import { getScenarioByIndex, evaluateDecision, generateFinalReport, getTotalScenarios, generateDemoHistory } from './services/geminiService';
import { PlayCircle, Loader2, RefreshCw, Info, UserCheck, Zap, ArrowLeft, Home, BrainCircuit, Crosshair, FileText, Users, Globe } from 'lucide-react';

function App() {
  const TOTAL_SCENARIOS = getTotalScenarios();

  // --- State ---
  const [currentView, setCurrentView] = useState<'home' | 'assessment' | 'report'>('home');
  
  const [hasAccess, setHasAccess] = useState(false);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  // Assessment Progression
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [history, setHistory] = useState<AssessmentState['history']>([]);
  const [finished, setFinished] = useState(false);

  // Global User State
  const [userEmail, setUserEmail] = useState('');
  const [userIndustry, setUserIndustry] = useState('');
  const [userCountry, setUserCountry] = useState('');
  const [isFaithBased, setIsFaithBased] = useState(false);
  const [finalReportData, setFinalReportData] = useState<AssessmentState['finalReport']>();

  // --- Logic ---

  const handleDisclaimerComplete = (email: string, country: string) => {
    setUserEmail(email);
    setUserIndustry('General'); // Default since removed from input
    setUserCountry(country);
    setHasAccess(true);
  };

  const handleRestart = () => {
    setStarted(false);
    setFinished(false);
    setCurrentView('home');
    setHistory([]);
    setCurrentScenarioIndex(0);
    setCurrentScenario(null);
    setCurrentFeedback(null);
    setFinalReportData(undefined);
    
    // Keep user identity (email/country), but reset assessment mode
    setIsFaithBased(false);
  };

  const handleNavigate = (view: 'home') => {
    if (view === 'home') {
        handleRestart();
    }
  };

  const startAssessment = async (faithMode: boolean) => {
    setIsFaithBased(faithMode);
    setStarted(true);
    setCurrentView('assessment');
    await loadScenario(0);
  };

  const runDemo = async (faithMode: boolean) => {
    setIsFaithBased(faithMode);
    setStarted(true); 
    setGeneratingReport(true);
    
    try {
        // Generate synthetic history
        const demoHistory = await generateDemoHistory(faithMode);
        setHistory(demoHistory);
        setFinished(true);
        setCurrentScenarioIndex(TOTAL_SCENARIOS);

        // Generate report with isDemo: true to use pre-generated server content
        const report = await generateFinalReport({
            email: userEmail,
            isFaithBased: faithMode,
            isDemo: true, 
            industry: userIndustry,
            country: userCountry,
            currentScenarioIndex: TOTAL_SCENARIOS,
            history: demoHistory,
            totalScore: 0
        });
        setFinalReportData(report);
        
        // Navigate to Assessment (Dashboard view because finished=true)
        setCurrentView('assessment');
    } catch (e) {
        console.error("Demo failed", e);
    } finally {
        setGeneratingReport(false);
    }
  };

  const loadScenario = async (index: number) => {
    if (index >= TOTAL_SCENARIOS) {
      setFinished(true);
      return;
    }
    
    setLoading(true);
    setCurrentScenarioIndex(index);
    setCurrentFeedback(null); 
    setCurrentScenario(null);

    try {
        const scenario = await getScenarioByIndex(index);
        setCurrentScenario(scenario);
    } catch (e) {
        console.error("Failed to load scenario", e);
    } finally {
        setLoading(false);
    }
  };

  const handleOptionSelect = async (optionId: string) => {
    if (!currentScenario) return;

    setLoading(true);
    
    try {
        const feedback = await evaluateDecision(currentScenario.phase, currentScenario, optionId, isFaithBased);
        setCurrentFeedback(feedback);
        
        setHistory(prev => [
          ...prev,
          {
            phase: currentScenario!.phase,
            scenario: currentScenario!,
            userChoiceId: optionId,
            feedback
          }
        ]);
    } catch (e) {
        console.error("Evaluation failed", e);
    } finally {
        setLoading(false);
    }
  };

  const handleNext = () => {
    loadScenario(currentScenarioIndex + 1);
  };

  const handleBack = () => {
    if (currentView === 'report') {
        // Return to Dashboard
        setCurrentView('assessment');
        return;
    }

    if (finished) {
        // Back from Dashboard -> Re-do last scenario
        setFinished(false);
        const lastIndex = history.length - 1;
        if (lastIndex >= 0) {
            setCurrentFeedback(null);
            setHistory(prev => prev.slice(0, -1));
            loadScenario(lastIndex);
        } else {
            handleRestart();
        }
    } else if (currentFeedback) {
        // Back from Feedback -> Re-do current scenario
        setCurrentFeedback(null);
        setHistory(prev => prev.slice(0, -1));
    } else if (currentScenarioIndex > 0) {
        // Back from Scenario -> Re-do previous scenario
        const prevIndex = currentScenarioIndex - 1;
        setHistory(prev => prev.slice(0, -1));
        loadScenario(prevIndex);
    } else {
        // Back from first Scenario -> Home
        handleRestart();
    }
  };

  // Flexible Questionnaire: Early exit logic
  const handleSkipToReport = () => {
      setFinished(true);
  };

  const handleGenerateReport = async () => {
    // If report data already exists (from demo), just show it
    if (finalReportData) {
        setCurrentView('report');
        return;
    }

    setGeneratingReport(true);
    try {
        const report = await generateFinalReport({
            email: userEmail,
            isFaithBased,
            isDemo: false,
            industry: userIndustry,
            country: userCountry,
            currentScenarioIndex,
            history,
            totalScore: 0
        });
        setFinalReportData(report);
        setCurrentView('report');
    } catch (e) {
        console.error("Report generation failed", e);
    } finally {
        setGeneratingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900 relative pb-20">
      
      {!hasAccess ? (
        <DisclaimerModal onComplete={handleDisclaimerComplete} />
      ) : (
        <>
          <Header 
            onNavigate={handleNavigate} 
            onFeedback={() => setIsFeedbackOpen(true)} 
            showBack={currentView !== 'home'}
            onBack={handleBack}
          />

          <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
            
            {/* VIEW: Home / Welcome */}
            {currentView === 'home' && !started && !generatingReport && (
              <div className="max-w-6xl w-full text-center animate-fade-in space-y-12">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        Beta Site Preview
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    <span className="text-teal-600">Change Management</span> Advisory
                  </h1>
                  
                  <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-lg text-left relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
                    
                    <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
                        <p>
                            Unlock the power of strategic transformation with <strong>Change Management Advisory AI</strong>, a premier leadership tool.
                        </p>
                        <div className="flex items-start p-4 bg-slate-50 rounded-lg border-l-4 border-teal-500 italic text-slate-600">
                            "There is a saying: If you find a rat on top of a pole, somebody must have put it there."
                        </div>
                        <p>
                            Leadership and change management styles are very critical especially in the turnaround process. This intelligent platform assesses your decision-making across the critical stages of <strong>Surgery</strong> (Crisis), <strong>Resuscitation</strong> (Recovery), and <strong>Therapy</strong> (Growth), mapping your leadership style to 12 distinct archetypes.
                        </p>
                        <p>
                            Designed for busy executives and aspiring leaders. Features include a flexible scenario-based assessment, a specialized Virtual Assistant for comprehensive reporting with industry-specific benchmarking. Whether you are navigating a financial crisis or building a corporate legacy, this tool provides the actionable insights and personalized coaching needed as a leader to navigate through the different phases in a corporate life cycle.
                        </p>
                    </div>
                    
                    {/* Comparison Table */}
                    <div className="overflow-x-auto mt-8">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-3 font-bold text-slate-500 uppercase text-xs">Feature</th>
                                    <th className="p-3 font-bold text-slate-400 uppercase text-xs">Traditional Planning</th>
                                    <th className="p-3 font-bold text-teal-700 uppercase text-xs bg-teal-50/50">Leadership Scenario Planning</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="p-3 font-medium text-slate-900"><BrainCircuit className="w-4 h-4 inline mr-2 text-slate-400"/>Speed</td>
                                    <td className="p-3 text-slate-500">Weeks / Months</td>
                                    <td className="p-3 text-teal-700 font-bold bg-teal-50/30">Minutes</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium text-slate-900"><Crosshair className="w-4 h-4 inline mr-2 text-slate-400"/>Focus</td>
                                    <td className="p-3 text-slate-500">Linear Projection</td>
                                    <td className="p-3 text-teal-700 font-bold bg-teal-50/30">Dynamic Adaptability</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium text-slate-900"><FileText className="w-4 h-4 inline mr-2 text-slate-400"/>Outcome</td>
                                    <td className="p-3 text-slate-500">Static PDF Report</td>
                                    <td className="p-3 text-teal-700 font-bold bg-teal-50/30">Interactive Action Plan</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                  </div>
                </div>

                {/* Action Cards Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  
                  {/* Self Assessment Card */}
                  <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center hover:shadow-2xl transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-slate-900 group-hover:h-2 transition-all"></div>
                      <div className="bg-slate-100 p-4 rounded-full mb-4 group-hover:bg-slate-200 transition-colors">
                        <UserCheck className="w-10 h-10 text-slate-800" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Full Assessment</h3>
                      <p className="text-slate-500 mb-8 text-sm flex-grow">
                        Take the complete 18-scenario leadership journey to diagnose your style across 3 phases.
                      </p>
                      <div className="grid grid-cols-1 w-full gap-3">
                          <button 
                            onClick={() => startAssessment(false)}
                            className="w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                          >
                            Start Non-Faith Based
                          </button>
                          <button 
                            onClick={() => startAssessment(true)}
                            className="w-full py-3 px-4 bg-white text-teal-700 border-2 border-teal-600 font-bold rounded-xl hover:bg-teal-50 transition-colors"
                          >
                            Start Faith-Based
                          </button>
                      </div>
                  </div>

                  {/* Demo Play Card */}
                  <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center hover:shadow-2xl transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 group-hover:h-2 transition-all"></div>
                      <div className="bg-teal-50 p-4 rounded-full mb-4 group-hover:bg-teal-100 transition-colors">
                        <PlayCircle className="w-10 h-10 text-teal-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Instant Demo</h3>
                      <p className="text-slate-500 mb-8 text-sm flex-grow">
                        View a sample report with simulated data to understand the depth of the advisory.
                      </p>
                      <div className="grid grid-cols-1 w-full gap-3">
                          <button 
                            onClick={() => runDemo(false)}
                            className="w-full py-3 px-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-lg"
                          >
                            View Non-Faith Demo
                          </button>
                          <button 
                            onClick={() => runDemo(true)}
                            className="w-full py-3 px-4 bg-white text-teal-700 border-2 border-teal-600 font-bold rounded-xl hover:bg-teal-50 transition-colors"
                          >
                            View Faith-Based Demo
                          </button>
                      </div>
                  </div>
                </div>

                {/* TRANSFERRED METHODOLOGY SECTION */}
                <div className="w-full max-w-6xl mx-auto pt-12 border-t border-slate-200">
                    <div className="text-center mb-12 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Turnaround Methodology</h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Based on the proprietary framework of Dr. Michael Teng, blending ancient Eastern wisdom with modern Western management science.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {/* Phase 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-red-500 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Zap className="w-24 h-24 text-red-500" />
                            </div>
                            <div className="text-red-500 font-bold uppercase tracking-widest text-xs mb-2">Phase 1</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-1">Surgery</h3>
                            <div className="text-sm font-medium text-slate-500 mb-4">Crisis Management</div>
                            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                <strong>Archetype: Sun Zi / Joshua.</strong> Immediate action to stop financial bleeding. Focuses on cash flow survival, divestment, and cost-cutting.
                            </p>
                            <div className="bg-red-50 p-3 rounded-lg text-xs text-red-800 font-medium">
                                Styles: Benevolent Autocratic, Paternalistic, Task-Oriented, Transactional
                            </div>
                        </div>

                        {/* Phase 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-yellow-500 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Users className="w-24 h-24 text-yellow-500" />
                            </div>
                            <div className="text-yellow-600 font-bold uppercase tracking-widest text-xs mb-2">Phase 2</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-1">Resuscitation</h3>
                            <div className="text-sm font-medium text-slate-500 mb-4">Stabilization & Growth</div>
                            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                <strong>Archetype: Confucius / King David.</strong> Rebuilding the team and market position. Focuses on innovation, marketing, and morale.
                            </p>
                            <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 font-medium">
                                Styles: Democratic, Collaborative, Participative, Coaching
                            </div>
                        </div>

                        {/* Phase 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-teal-500 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Globe className="w-24 h-24 text-teal-500" />
                            </div>
                            <div className="text-teal-600 font-bold uppercase tracking-widest text-xs mb-2">Phase 3</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-1">Therapy</h3>
                            <div className="text-sm font-medium text-slate-500 mb-4">Corporate Culture & Legacy</div>
                            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                <strong>Archetype: Zheng He / Apostle Paul.</strong> Building a 100-year organization. Focuses on values, succession, and CSR.
                            </p>
                            <div className="bg-teal-50 p-3 rounded-lg text-xs text-teal-800 font-medium">
                                Styles: Spiritual, Servant Leadership, Values-Driven, Inspirational
                            </div>
                        </div>
                    </div>
                </div>

              </div>
            )}
            
            {/* Generating Report Loading State for Demo */}
            {generatingReport && !finalReportData && (
                <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
                    <Zap className="h-16 w-16 text-teal-600 animate-bounce" />
                    <p className="text-slate-500 font-medium text-lg">Analysing Leadership DNA...</p>
                </div>
            )}

            {/* VIEW: Assessment Loop */}
            {currentView === 'assessment' && started && (
                <div className="w-full flex flex-col items-center space-y-6">
                    
                    {/* Loading */}
                    {loading && !currentFeedback && (
                    <div className="flex flex-col items-center justify-center space-y-4 animate-pulse py-12">
                        <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
                        <p className="text-slate-500 font-medium">Loading Scenario {currentScenarioIndex + 1}...</p>
                    </div>
                    )}

                    {/* Scenario */}
                    {!finished && !loading && currentScenario && !currentFeedback && (
                    <div className="w-full flex flex-col items-center space-y-6">
                        <div className="w-full max-w-4xl h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-teal-500 transition-all duration-500 ease-out" 
                                style={{ width: `${((currentScenarioIndex) / TOTAL_SCENARIOS) * 100}%` }}
                            />
                        </div>

                        <ScenarioCard 
                            scenario={currentScenario} 
                            onSelectOption={handleOptionSelect} 
                            onSkip={handleSkipToReport}
                            isSubmitting={loading} 
                        />
                    </div>
                    )}

                    {/* Feedback */}
                    {!finished && currentFeedback && (
                    <FeedbackCard 
                        feedback={currentFeedback} 
                        onNext={handleNext}
                        isLast={currentScenarioIndex === TOTAL_SCENARIOS - 1}
                    />
                    )}

                    {/* Dashboard (Pre-Report) */}
                    {finished && (
                        <div className="w-full flex flex-col items-center">
                            {history.length < TOTAL_SCENARIOS && (
                                <div className="max-w-4xl w-full mb-6 bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl flex items-start">
                                    <Info className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                        Note: You completed {history.length} out of {TOTAL_SCENARIOS} scenarios. While your report is generated based on available data, a full assessment yields more accurate leadership profiling.
                                    </p>
                                </div>
                            )}
                            <ResultsDashboard 
                                state={{
                                email: userEmail,
                                isFaithBased,
                                industry: userIndustry,
                                country: userCountry,
                                currentScenarioIndex,
                                history,
                                totalScore: 0 
                                }}
                                onRestart={handleRestart}
                                onGenerateReport={handleGenerateReport}
                                isGeneratingReport={generatingReport}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* VIEW: Final Report */}
            {currentView === 'report' && finalReportData && (
                <div className="w-full max-w-4xl">
                    <ReportView state={{
                        email: userEmail,
                        isFaithBased,
                        isDemo: generatingReport ? false : (finalReportData === undefined ? false : true), 
                        industry: userIndustry,
                        country: userCountry,
                        currentScenarioIndex,
                        history,
                        totalScore: 0,
                        finalReport: finalReportData
                    }} />
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pb-12">
                        <button 
                            onClick={() => setCurrentView('assessment')} // Back to Dashboard
                            className="flex items-center justify-center px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-300 transition-colors"
                        >
                            View Dashboard
                        </button>
                        <button 
                            onClick={handleRestart}
                            className="flex items-center justify-center px-6 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" /> Start New Session
                        </button>
                    </div>
                </div>
            )}

          </main>
          
          <footer className="py-6 text-center text-slate-400 text-sm bg-slate-50 border-t border-slate-200">
            <p>Copyright 2025 Corporate Turnaround Centre. All rights reserved.</p>
          </footer>

          {/* Global Elements */}
          <VirtualAssistant />
          <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
        </>
      )}
      
    </div>
  );
}

export default App;
