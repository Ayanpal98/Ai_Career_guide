import React from 'react';
import { motion } from 'motion/react';
import { SubscriptionPlan } from '../types';
import { ShieldCheck, ChevronLeft, ArrowRight, Zap, Sparkles } from 'lucide-react';

interface SubscriptionPaymentProps {
  plan: SubscriptionPlan;
  onBack: () => void;
  onConfirm: (transactionId: string) => void;
}

export default function SubscriptionPayment({ plan, onBack, onConfirm }: SubscriptionPaymentProps) {
  const [transactionId, setTransactionId] = React.useState('');

  const getPrice = () => {
    if (plan === 'Pro') return '₹999';
    if (plan === 'Premium') return '₹2,499';
    return '₹0';
  };

  const getPlanColor = () => {
    if (plan === 'Pro') return 'indigo';
    if (plan === 'Premium') return 'purple';
    return 'slate';
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full glass p-12 rounded-[3rem] space-y-8 relative z-10"
      >
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-4 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Plans
        </button>

        <div className="text-center space-y-4">
          <div className={`w-20 h-20 bg-${getPlanColor()}-500/20 text-${getPlanColor()}-400 rounded-full flex items-center justify-center mx-auto mb-6`}>
            {plan === 'Pro' ? <Zap size={40} /> : <Sparkles size={40} />}
          </div>
          <h1 className="text-3xl font-black text-white">Activate {plan} Access</h1>
          <p className="text-slate-400">Please pay <span className="text-white font-bold">{getPrice()}</span> to the UPI ID below to unlock your {plan} features.</p>
        </div>

        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 text-center space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">UPI ID</div>
          <div className={`text-2xl font-mono text-${getPlanColor()}-400 select-all cursor-pointer hover:text-${getPlanColor()}-300 transition-colors`}>
            ayanpal0698@okaxis
          </div>
          <div className="text-[10px] text-slate-500">Click to copy UPI ID</div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Transaction ID / UTR Number</label>
          <input 
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter 12-digit transaction ID"
            className="w-full bg-slate-900 border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
          />
        </div>

        <button 
          disabled={!transactionId.trim()}
          onClick={() => onConfirm(transactionId)}
          className={`w-full py-5 bg-${getPlanColor()}-500 text-white font-black rounded-2xl shadow-xl shadow-${getPlanColor()}-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3`}
        >
          Verify & Unlock Access
          <ArrowRight size={20} />
        </button>

        <p className="text-[10px] text-slate-500 text-center leading-relaxed">
          By confirming, you agree that you have made the payment. Access will be granted immediately upon verification of the transaction ID.
        </p>
      </motion.div>
    </div>
  );
}
