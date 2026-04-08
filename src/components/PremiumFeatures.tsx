import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Zap, 
  Target, 
  BarChart3, 
  Layout, 
  Calendar, 
  MessageSquare,
  Sparkles,
  Rocket,
  ShieldCheck,
  Globe,
  Award,
  Users
} from 'lucide-react';

interface PremiumFeaturesProps {
  onBack: () => void;
  onConfirm: () => void;
  isSuccess?: boolean;
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ onBack, onConfirm, isSuccess = false }) => {
  const features = [
    {
      title: "Everything in Pro",
      desc: "All the benefits of the Pro plan, plus exclusive premium features for total career mastery.",
      icon: <CheckCircle2 className="text-purple-400" />
    },
    {
      title: "1:1 AI Coaching Sessions",
      desc: "Experience deep, personalized coaching sessions with our advanced AI model, tailored to your unique goals.",
      icon: <Users className="text-purple-400" />
    },
    {
      title: "Interview Simulation",
      desc: "Practice with realistic, industry-specific interview scenarios and get instant feedback on your performance.",
      icon: <Award className="text-purple-400" />
    },
    {
      title: "Direct Expert Access",
      desc: "Get your questions answered by industry experts and mentors through our exclusive premium channel.",
      icon: <ShieldCheck className="text-purple-400" />
    },
    {
      title: "Placement Support",
      desc: "Receive personalized guidance on job applications, resume tailoring, and networking strategies.",
      icon: <Globe className="text-purple-400" />
    },
    {
      title: "Lifetime Updates",
      desc: "Enjoy early access to all new features and updates, ensuring you're always ahead of the curve.",
      icon: <Sparkles className="text-purple-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white py-20 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles size={14} />
            Premium Plan
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            {isSuccess ? "Welcome to" : "Master Your"} <span className="text-purple-500">{isSuccess ? "Premium." : "Career Path."}</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            {isSuccess 
              ? "Your Premium access is now active. You have unlocked our most powerful tools and direct expert access."
              : "The Premium plan is the ultimate career accelerator, providing unparalleled support, advanced tools, and expert guidance to ensure your success."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2.5rem] glass-card border-white/5 hover:border-purple-500/20 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="p-12 rounded-[3rem] premium-border glass-dark text-center relative overflow-hidden border-purple-500/20">
          <div className="absolute top-0 left-0 w-full h-full bg-purple-500/5 pointer-events-none" />
          <h2 className="text-3xl font-black mb-4 relative z-10">
            {isSuccess ? "Ready to dominate?" : "The ultimate career investment."}
          </h2>
          <p className="text-slate-400 mb-10 max-w-md mx-auto relative z-10">
            {isSuccess 
              ? "Let's set up your profile and schedule your first expert consultation."
              : "Secure your future with the most comprehensive career development plan available today."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <button 
              onClick={onConfirm}
              className="px-12 py-6 bg-purple-500 text-white font-black rounded-2xl text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-purple-500/20"
            >
              {isSuccess ? "Go to Dashboard" : "Go Premium Now"}
            </button>
            {!isSuccess && (
              <div className="text-2xl font-black">
                ₹2,499<span className="text-sm text-slate-500">/mo</span>
              </div>
            )}
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

export default PremiumFeatures;
