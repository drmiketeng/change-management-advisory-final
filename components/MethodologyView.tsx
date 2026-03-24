
import React from 'react';
import { Layers, Star, BookOpen, ArrowRight, Award, Users, BarChart3, TrendingUp, Zap, ShieldCheck, Globe } from 'lucide-react';

interface MethodologyViewProps {
  onBack: () => void;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in pb-12 space-y-12">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-extrabold text-slate-900">Turnaround Methodology</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Based on the proprietary framework of Dr. Michael Teng, blending ancient Eastern wisdom with modern Western management science.
        </p>
      </div>

      {/* The 3 Phases */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-red-500 relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-24 h-24 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Phase 1: Surgery</h2>
          <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">Crisis Management</div>
          <p className="text-slate-600 mb-4 leading-relaxed">
            <strong>Archetype: Sun Zi / Joshua.</strong> Immediate action to stop financial bleeding. Focuses on cash flow survival, divestment, and cost-cutting.
          </p>
          <div className="bg-red-50 p-3 rounded-lg text-sm text-red-800 font-medium">
            Styles: Benevolent Autocratic, Paternalistic, Task-Oriented, Transactional
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-yellow-500 relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Phase 2: Resuscitation</h2>
          <div className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-4">Stabilization & Growth</div>
          <p className="text-slate-600 mb-4 leading-relaxed">
            <strong>Archetype: Confucius / King David.</strong> Rebuilding the team and market position. Focuses on innovation, marketing, and morale.
          </p>
          <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 font-medium">
            Styles: Democratic, Collaborative, Participative, Coaching
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-teal-500 relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe className="w-24 h-24 text-teal-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Phase 3: Therapy</h2>
          <div className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-4">Corporate Culture & Legacy</div>
          <p className="text-slate-600 mb-4 leading-relaxed">
            <strong>Archetype: Zheng He / Apostle Paul.</strong> Building a 100-year organization. Focuses on values, succession, and CSR.
          </p>
          <div className="bg-teal-50 p-3 rounded-lg text-sm text-teal-800 font-medium">
            Styles: Spiritual, Servant Leadership, Values-Driven, Inspirational
          </div>
        </div>
      </div>

      {/* 8 Centres of Excellence */}
      <div className="bg-slate-900 rounded-3xl shadow-2xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-teal-500/20 rounded-full mb-4 backdrop-blur-sm border border-teal-500/30">
             <Award className="h-8 w-8 text-teal-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">The 8 Centres of Excellence</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Comprehensive transformation requires mastery across these eight critical domains of the organization.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Strategic Management", icon: <Star className="w-5 h-5" />, desc: "Vision, Mission & Direction" },
            { title: "Financial Management", icon: <BarChart3 className="w-5 h-5" />, desc: "Cash Flow & Profitability" },
            { title: "Human Resource", icon: <Users className="w-5 h-5" />, desc: "Talent & Culture" },
            { title: "Marketing Management", icon: <TrendingUp className="w-5 h-5" />, desc: "Branding & Sales" },
            { title: "Business Operations", icon: <Layers className="w-5 h-5" />, desc: "Efficiency & Process" },
            { title: "Quality Management", icon: <ShieldCheck className="w-5 h-5" />, desc: "Standards & Excellence" },
            { title: "Innovation Management", icon: <Zap className="w-5 h-5" />, desc: "R&D & Future Growth" },
            { title: "Digital Transformation", icon: <Globe className="w-5 h-5" />, desc: "Technology & AI" }
          ].map((center, idx) => (
            <div key={idx} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors">
              <div className="text-teal-400 mb-3">{center.icon}</div>
              <h3 className="font-bold text-lg mb-1">{center.title}</h3>
              <p className="text-sm text-slate-400">{center.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onBack}
          className="flex items-center px-8 py-4 bg-white text-slate-900 border border-slate-200 font-bold rounded-full hover:bg-slate-50 hover:scale-105 transition-all shadow-lg"
        >
          Return to Advisory <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>

    </div>
  );
};
