import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ConsultationPackage } from '../types';
import { Calendar, Clock, CheckCircle2, ChevronLeft, ArrowRight, Sparkles, User, Globe, ShieldCheck } from 'lucide-react';

interface BookingPageProps {
  pkg: ConsultationPackage;
  onBack: () => void;
  onComplete: () => void;
}

export default function BookingPage({ pkg, onBack, onComplete }: BookingPageProps) {
  const [step, setStep] = React.useState<'details' | 'payment' | 'confirm'>('details');
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [transactionId, setTransactionId] = React.useState('');

  const dates = [
    { day: 'Mon', date: '13', month: 'Apr' },
    { day: 'Tue', date: '14', month: 'Apr' },
    { day: 'Wed', date: '15', month: 'Apr' },
    { day: 'Fri', date: '17', month: 'Apr' },
    { day: 'Sat', date: '18', month: 'Apr' },
  ];

  const times = ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      setStep('payment');
    }
  };

  const handlePaymentConfirm = () => {
    if (transactionId.trim()) {
      setStep('confirm');
    }
  };

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full glass p-12 rounded-[3rem] space-y-8 relative z-10"
        >
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-black text-white">Complete Payment</h1>
            <p className="text-slate-400">Please pay <span className="text-white font-bold">{pkg.price}</span> to the UPI ID below to confirm your session.</p>
          </div>

          <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 text-center space-y-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">UPI ID</div>
            <div className="text-2xl font-mono text-indigo-400 select-all cursor-pointer hover:text-indigo-300 transition-colors">
              {pkg.upiId || '8798610548@ybl'}
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

          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => setStep('details')}
              className="flex-1 py-5 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
            >
              Back
            </button>
            <button 
              disabled={!transactionId.trim()}
              onClick={handlePaymentConfirm}
              className="flex-[2] py-5 bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              Verify & Confirm
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full glass p-12 rounded-[3rem] text-center space-y-8 relative z-10"
        >
          <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-4xl font-black text-white">Booking Confirmed!</h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Your <span className="text-white font-bold">{pkg.title}</span> session is scheduled for <span className="text-white font-bold">{selectedDate} Apr</span> at <span className="text-white font-bold">{selectedTime}</span>.
          </p>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-sm text-slate-400">
            A calendar invitation and meeting link have been sent to your email.
          </div>
          <button 
            onClick={onComplete}
            className="w-full py-5 bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] p-6 md:p-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Package Details */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-10 rounded-[3rem] border-white/5"
            >
              <div className={`text-xs font-black text-${pkg.color}-400 uppercase tracking-widest mb-4`}>{pkg.title}</div>
              <div className="text-4xl font-black text-white mb-2">{pkg.price}</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">{pkg.duration}</div>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-8">{pkg.desc}</p>
              
              <ul className="space-y-4">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-slate-300">
                    <CheckCircle2 size={14} className={`text-${pkg.color}-400`} />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
              <h4 className="text-white font-bold flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400" />
                What to expect
              </h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                    <User size={16} />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">Direct 1:1 interaction with a senior industry mentor.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                    <Globe size={16} />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">Conducted via Google Meet with full session recording.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Interface */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-12 rounded-[3rem] border-white/5 space-y-12"
            >
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Calendar className="text-indigo-400" />
                  Select a Date
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {dates.map((d) => (
                    <button
                      key={d.date}
                      onClick={() => setSelectedDate(d.date)}
                      className={`p-6 rounded-2xl border transition-all text-center group ${
                        selectedDate === d.date
                          ? 'bg-indigo-500 border-indigo-400 text-white shadow-xl shadow-indigo-500/20'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">{d.day}</div>
                      <div className="text-2xl font-black">{d.date}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60">{d.month}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Clock className="text-purple-400" />
                  Select a Time
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {times.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`p-5 rounded-2xl border transition-all text-center font-bold text-sm ${
                        selectedTime === t
                          ? 'bg-purple-500 border-purple-400 text-white shadow-xl shadow-purple-500/20'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="text-slate-400 text-sm">
                  {selectedDate && selectedTime ? (
                    <p>Selected: <span className="text-white font-bold">{selectedDate} Apr</span> at <span className="text-white font-bold">{selectedTime}</span></p>
                  ) : (
                    <p>Please select a date and time to continue.</p>
                  )}
                </div>
                <button 
                  disabled={!selectedDate || !selectedTime}
                  onClick={handleBooking}
                  className={`group flex items-center gap-3 px-10 py-5 rounded-2xl font-black transition-all ${
                    selectedDate && selectedTime
                      ? 'bg-white text-slate-950 shadow-2xl shadow-white/10 hover:scale-105 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Confirm Booking
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
