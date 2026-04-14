import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, SubscriptionPlan } from '../types';
import { ChevronRight, ChevronLeft, Sparkles, Target, Briefcase, GraduationCap, Clock, Calendar, AlertCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  onBack: () => void;
  initialPlan?: SubscriptionPlan;
  initialProfile?: UserProfile | null;
}

const steps = [
  { id: 'goal', title: 'What is your career goal?', icon: Target, description: 'Tell us where you want to be in the next few years.' },
  { id: 'level', title: 'What is your current level?', icon: Briefcase, description: 'Be honest so we can tailor the roadmap correctly.' },
  { id: 'skills', title: 'What are your existing skills?', icon: Sparkles, description: 'List your technical and soft skills.' },
  { id: 'education', title: 'What is your education background?', icon: GraduationCap, description: 'Degrees, certifications, or self-taught paths.' },
  { id: 'availability', title: 'Daily time availability?', icon: Clock, description: 'How many hours can you dedicate per day?' },
  { id: 'timeline', title: 'What is your target timeline?', icon: Calendar, description: 'When do you want to achieve your goal?' },
  { id: 'constraints', title: 'Any constraints?', icon: AlertCircle, description: 'Financial, time, or location constraints.' },
  { id: 'plan', title: 'Confirm your plan', icon: Sparkles, description: 'Review your selected tier to unlock your personalized roadmap.' },
];

export default function Onboarding({ onComplete, onBack, initialPlan = 'Basic', initialProfile }: OnboardingProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<Partial<UserProfile>>(() => {
    if (initialProfile) {
      return { ...initialProfile };
    }
    return {
      level: 'Beginner',
      timeline: '6 months',
      plan: initialPlan,
    };
  });

  React.useEffect(() => {
    if (initialPlan && !initialProfile) {
      setFormData(prev => ({ ...prev, plan: initialPlan }));
    }
  }, [initialPlan, initialProfile]);

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
    } else {
      onBack();
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
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="e.g. Senior Full Stack Developer at a top tech company..."
            value={formData.careerGoal || ''}
            onChange={e => updateField('careerGoal', e.target.value)}
            onKeyDown={e => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canContinue()) {
                handleNext();
              }
            }}
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
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
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
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="e.g. JavaScript, React, Python, Communication..."
            value={formData.currentSkills || ''}
            onChange={e => updateField('currentSkills', e.target.value)}
            onKeyDown={e => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canContinue()) {
                handleNext();
              }
            }}
          />
        );
      case 'education':
        return (
          <textarea
            autoFocus
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="e.g. B.Tech in Computer Science, Self-taught..."
            value={formData.education || ''}
            onChange={e => updateField('education', e.target.value)}
            onKeyDown={e => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canContinue()) {
                handleNext();
              }
            }}
          />
        );
      case 'availability':
        return (
          <input
            type="number"
            autoFocus
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
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
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
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
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="e.g. Limited budget for courses, working full-time..."
            value={formData.constraints || ''}
            onChange={e => updateField('constraints', e.target.value)}
            onKeyDown={e => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canContinue()) {
                handleNext();
              }
            }}
          />
        );
      case 'plan':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'Basic', price: '₹0', features: ['Basic roadmap', 'Limited features', 'Locked advanced sections'], color: 'gray' },
              { id: 'Pro', price: '₹999', features: ['Personalized roadmap', 'Weekly plans', 'Project suggestions', 'Resume guidance'], color: 'primary' },
              { id: 'Premium', price: '₹4999', features: ['Deep career strategy', 'Interview preparation', 'Networking plan', 'AI coach fully unlocked'], color: 'purple' },
            ].map(plan => (
              <button
                key={plan.id}
                onClick={() => updateField('plan', plan.id)}
                className={`p-10 rounded-[2.5rem] border transition-all text-left relative overflow-hidden group ${
                  formData.plan === plan.id
                    ? `bg-${plan.color === 'primary' ? 'primary' : plan.color}-500/10 border-${plan.color === 'primary' ? 'primary' : plan.color}-500 shadow-2xl shadow-${plan.color === 'primary' ? 'primary' : plan.color}-500/20`
                    : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                }`}
              >
                {formData.plan === plan.id && (
                  <motion.div
                    layoutId="plan-glow"
                    className={`absolute inset-0 bg-gradient-to-br from-${plan.color === 'primary' ? 'primary' : plan.color}-500/10 to-transparent pointer-events-none`}
                  />
                )}
                <div className="relative z-10">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-60 font-mono">{plan.id}</div>
                  <div className="text-4xl font-black mb-8 text-gray-900 tracking-tighter font-mono">{plan.price}</div>
                  <ul className="space-y-4">
                    {plan.features.map((f, i) => (
                      <li key={i} className="text-xs font-medium flex items-start gap-3 leading-relaxed">
                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-${plan.color === 'primary' ? 'primary' : plan.color}-500 shrink-0`} />
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="max-w-4xl w-full bg-white p-12 md:p-20 rounded-[4rem] border border-gray-100 relative z-10 shadow-sm card-3d">
        {/* Progress Bar */}
        <div className="mb-16 flex gap-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-700 ${
                i <= currentStep ? 'bg-primary shadow-[0_0_15px_rgba(242,125,38,0.3)]' : 'bg-gray-100'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary mb-6">
                <div className="p-2 rounded-xl bg-primary/10">
                  {React.createElement(steps[currentStep].icon, { size: 20 })}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono">Step {currentStep + 1} / {steps.length}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[0.9] font-display uppercase italic text-3d depth-1">
                {steps[currentStep].title}
              </h1>
              <p className="text-gray-500 text-xl max-w-xl font-medium opacity-80">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="py-8">
              {renderStepContent()}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-gray-100">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              >
                <ChevronLeft size={20} />
                {currentStep === 0 ? 'Back to Home' : 'Back'}
              </button>
              <button
                disabled={!canContinue()}
                onClick={handleNext}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${
                  canContinue()
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
