
import React, { useState } from 'react';
import { ShieldCheck, Lock, Globe } from 'lucide-react';

interface DisclaimerProps {
  onComplete: (email: string, country: string) => void;
}

export const DisclaimerModal: React.FC<DisclaimerProps> = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && agreed && country) {
      onComplete(email, country);
    }
  };

  const countries = ["United States", "Singapore", "United Kingdom", "China", "Australia", "Malaysia", "Indonesia", "Other"];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 overflow-y-auto">
      <div className="min-h-screen w-full flex items-center justify-center p-4 py-12">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700 animate-fade-in-up relative">
          <div className="bg-slate-900 p-6 text-center border-b border-slate-800">
            <p className="text-xl text-white font-semibold mb-6">Welcome</p>
            <ShieldCheck className="w-12 h-12 text-teal-500 mx-auto mb-3" />
            <h2 className="text-teal-400 font-bold uppercase tracking-widest text-sm mb-2">Disclaimer</h2>
            <h1 className="text-2xl font-bold text-white tracking-tight">Change Management Advisory</h1>
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="mb-8 text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                Unlock the power of strategic transformation with Change Management Advisory AI, a premier leadership tool. There is a saying: If you find a rat on top of a pole, somebody must have put it there . Leadership and change management styles are very critical especially in the turnaround process. This intelligent platform assesses your decision-making across the critical stages of Surgery (Crisis), Resuscitation (Recovery), and Therapy (Growth), mapping your leadership style to 12 distinct archetypes.
              </p>
              <p>
                Designed for busy executives and aspiring . Features include a flexible scenario-based assessment, a specialized Virtual Assistant for comprehensive reporting with industry-specific benchmarking. Whether you are navigating a financial crisis or building a corporate legacy, this tool provides the actionable insights and personalized coaching needed as a leader to navigate through the different phases in a corporate life cycle.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 border-t border-slate-100 pt-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p className="font-bold text-blue-900 mb-2">Legal Disclaimer</p>
                <p>
                  This advisory tool uses artificial intelligence. By proceeding, you acknowledge that this is for educational purposes and does not constitute legal or financial advice.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input 
                    type="email" 
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <select 
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white outline-none appearance-none"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                  >
                      <option value="">Select...</option>
                      {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="mt-1 w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  I agree to the terms and consent to receive the analysis report.
                </span>
              </label>

              <button 
                type="submit"
                disabled={!email || !agreed || !country}
                className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform ${(!email || !agreed || !country) ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 hover:-translate-y-0.5'}`}
              >
                Enter Advisory
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
