import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Rocket, 
  Target, 
  Users, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface BasicFeaturesProps {
  onBack: () => void;
  onConfirm: () => void;
  isSuccess?: boolean;
}

const BasicFeatures: React.FC<BasicFeaturesProps> = ({ onBack, onConfirm, isSuccess = false }) => {
  const features = [
    {
      title: "1 Career Roadmap",
      desc: "Get a comprehensive, AI-generated roadmap for your primary career goal.",
      icon: <Target className="text-slate-400" />
    },
    {
      title: "Basic Progress Tracking",
      desc: "Keep track of your milestones and mark tasks as completed as you grow.",
      icon: <Rocket className="text-slate-400" />
    },
    {
      title: "Community Access",
      desc: "Join our global community of learners and professionals to share insights.",
      icon: <Users className="text-slate-400" />
    },
    {
      title: "Public Resources",
      desc: "Access a curated list of free learning materials and industry guides.",
      icon: <BookOpen className="text-slate-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white py-20 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">
        {!isSuccess && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Pricing
          </button>
        )}

        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-black uppercase tracking-widest mb-6">
            <CheckCircle2 size={14} />
            Basic Plan
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            {isSuccess ? "Welcome to the" : "Start Your"} <span className="text-slate-400">Journey.</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            {isSuccess 
              ? "Your basic access is now active. Start building your career path with our AI-powered tools."
              : "The Basic plan gives you the essential tools to start mapping out your career and tracking your progress."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2.5rem] glass-card border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="p-12 rounded-[3rem] border border-white/10 glass-dark text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none" />
          <h2 className="text-3xl font-black mb-4 relative z-10">
            {isSuccess ? "Ready to start?" : "Free Forever"}
          </h2>
          <p className="text-slate-400 mb-10 max-w-md mx-auto relative z-10">
            {isSuccess 
              ? "Let's set up your profile and generate your first roadmap."
              : "No credit card required. Start building your future today with our basic tools."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <button 
              onClick={onConfirm}
              className="px-12 py-6 bg-white text-slate-950 font-black rounded-2xl text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10 flex items-center gap-3"
            >
              {isSuccess ? "Go to Dashboard" : "Start Free Now"}
              <ArrowRight size={24} />
            </button>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.5em]">
            Built BY ATSFY Technologies
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicFeatures;
