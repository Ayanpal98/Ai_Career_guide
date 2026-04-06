import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, SubscriptionPlan } from '../types';
import { ChevronRight, ChevronLeft, Sparkles, Target, Briefcase, GraduationCap, Clock, Calendar, AlertCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const steps = [
  { id: 'goal', title: 'What is your career goal?', icon: Target, description: 'Tell us where you want to be in the next few years.' },
  { id: 'level', title: 'What is your current level?', icon: Briefcase, description: 'Be honest so we can tailor the roadmap correctly.' },
  { id: 'skills', title: 'What are your existing skills?', icon: Sparkles, description: 'List your technical and soft skills.' },
  { id: 'education', title: 'What is your education background?', icon: GraduationCap, description: 'Degrees, certifications, or self-taught paths.' },
  { id: 'availability', title: 'Daily time availability?', icon: Clock, description: 'How many hours can you dedicate per day?' },
  { id: 'timeline', title: 'What is your target timeline?', icon: Calendar, description: 'When do you want to achieve your goal?' },
  { id: 'constraints', title: 'Any constraints?', icon: AlertCircle, description: 'Financial, time, or location constraints.' },
  { id: 'plan', title: 'Choose your plan', icon: Sparkles, description: 'Select a tier to unlock your personalized roadmap.' },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<Partial<UserProfile>>({
    level: 'Beginner',
    timeline: '6 months',
    plan: 'Basic',
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData as UserProfile);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateField = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    switch (step.id) {
      case 'goal':
        return (
          <textarea
            autoFocus
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="e.g. Senior Full Stack Developer at a top tech company..."
            value={formData.careerGoal || ''}
            onChange={e => updateField('careerGoal', e.target.value)}
          />
        );
      case 'level':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Beginner', 'Intermediate', 'Advanced'].map(level => (
              <button
                key={level}
                onClick={() => updateField('level', level)}
                className={`p-6 rounded-2xl border transition-all text-left ${
                  formData.level === level
                    ? 'bg-indigo-500/10 border-indigo-500 text-white'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-lg mb-1">{level}</div>
                <div className="text-sm opacity-60">
                  {level === 'Beginner' && 'Just starting out'}
                  {level === 'Intermediate' && 'Some experience'}
                  {level === 'Advanced' && 'Looking for growth'}
                </div>
              </button>
            ))}
          </div>
        );
      case 'skills':
        return (
          <textarea
            autoFocus
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="e.g. JavaScript, React, Python, Communication..."
            value={formData.currentSkills || ''}
            onChange={e => updateField('currentSkills', e.target.value)}
          />
        );
      case 'education':
        return (
          <textarea
            autoFocus
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="e.g. B.Tech in Computer Science, Self-taught..."
            value={formData.education || ''}
            onChange={e => updateField('education', e.target.value)}
          />
        );
      case 'availability':
        return (
          <input
            type="number"
            autoFocus
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Hours per day (e.g. 4)"
            value={formData.hoursPerDay || ''}
            onChange={e => updateField('hoursPerDay', e.target.value)}
          />
        );
      case 'timeline':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['3 months', '6 months', '1 year'].map(time => (
              <button
                key={time}
                onClick={() => updateField('timeline', time)}
                className={`p-6 rounded-2xl border transition-all text-left ${
                  formData.timeline === time
                    ? 'bg-indigo-500/10 border-indigo-500 text-white'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-lg mb-1">{time}</div>
              </button>
            ))}
          </div>
        );
      case 'constraints':
        return (
          <textarea
            autoFocus
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="e.g. Limited budget for courses, working full-time..."
            value={formData.constraints || ''}
            onChange={e => updateField('constraints', e.target.value)}
          />
        );
      case 'plan':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'Basic', price: '₹0', features: ['Basic roadmap', 'Limited features', 'Locked advanced sections'], color: 'slate' },
              { id: 'Pro', price: '₹999', features: ['Personalized roadmap', 'Weekly plans', 'Project suggestions', 'Resume guidance'], color: 'indigo' },
              { id: 'Premium', price: '₹4999', features: ['Deep career strategy', 'Interview preparation', 'Networking plan', 'AI coach fully unlocked'], color: 'purple' },
            ].map(plan => (
              <button
                key={plan.id}
                onClick={() => updateField('plan', plan.id)}
                className={`p-8 rounded-[2rem] border transition-all text-left relative overflow-hidden group ${
                  formData.plan === plan.id
                    ? `bg-${plan.color}-500/10 border-${plan.color}-500 text-white`
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {formData.plan === plan.id && (
                  <motion.div
                    layoutId="plan-glow"
                    className={`absolute inset-0 bg-gradient-to-br from-${plan.color}-500/20 to-transparent pointer-events-none`}
                  />
                )}
                <div className="relative z-10">
                  <div className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">{plan.id}</div>
                  <div className="text-3xl font-black mb-6">{plan.price}</div>
                  <ul className="space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <div className={`mt-1 w-1.5 h-1.5 rounded-full bg-${plan.color}-500`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const canContinue = () => {
    const step = steps[currentStep];
    if (step.id === 'goal') return !!formData.careerGoal;
    if (step.id === 'skills') return !!formData.currentSkills;
    if (step.id === 'education') return !!formData.education;
    if (step.id === 'availability') return !!formData.hoursPerDay;
    if (step.id === 'constraints') return !!formData.constraints;
    return true;
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-12 flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= currentStep ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-indigo-400 mb-4">
                {React.createElement(steps[currentStep].icon, { size: 24 })}
                <span className="text-sm font-bold uppercase tracking-widest">Step {currentStep + 1} of {steps.length}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {steps[currentStep].title}
              </h1>
              <p className="text-slate-400 text-lg max-w-xl">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="py-8">
              {renderStepContent()}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-slate-800/50">
              <button
                onClick={handleBack}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ChevronLeft size={20} />
                Back
              </button>
              <button
                disabled={!canContinue()}
                onClick={handleNext}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${
                  canContinue()
                    ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {currentStep === steps.length - 1 ? 'Generate Roadmap' : 'Continue'}
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
