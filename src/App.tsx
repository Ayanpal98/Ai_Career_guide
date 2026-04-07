import React from 'react';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import BookingPage from './components/BookingPage';
import SubscriptionPayment from './components/SubscriptionPayment';
import { UserProfile, CareerRoadmap, SubscriptionPlan, ConsultationPackage } from './types';
import { generateCareerRoadmap } from './services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  const [showLanding, setShowLanding] = React.useState(true);
  const [selectedPlan, setSelectedPlan] = React.useState<SubscriptionPlan>('Basic');
  const [showPayment, setShowPayment] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState<ConsultationPackage | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [roadmap, setRoadmap] = React.useState<CareerRoadmap | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleOnboardingComplete = async (userProfile: UserProfile) => {
    setProfile(userProfile);
    setLoading(true);
    setError(null);
    try {
      const apiKey = (process.env as any).GEMINI_API_KEY;
      if (!apiKey || apiKey === "undefined") {
        throw new Error("GEMINI_API_KEY is not configured. Please add it to your environment variables in the Settings menu.");
      }
      const generatedRoadmap = await generateCareerRoadmap(userProfile);
      setRoadmap(generatedRoadmap);
    } catch (err) {
      console.error('Failed to generate roadmap:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate your roadmap. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setLoading(true);
    setError(null);
    try {
      const apiKey = (process.env as any).GEMINI_API_KEY;
      if (!apiKey || apiKey === "undefined") {
        throw new Error("GEMINI_API_KEY is not configured. Please add it to your environment variables in the Settings menu.");
      }
      const generatedRoadmap = await generateCareerRoadmap(updatedProfile);
      setRoadmap(generatedRoadmap);
    } catch (err) {
      console.error('Failed to regenerate roadmap:', err);
      setError(err instanceof Error ? err.message : 'Failed to update your roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-8 text-indigo-500"
        >
          <Loader2 size={64} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center justify-center gap-3">
            <Sparkles className="text-indigo-400" />
            Architecting Your Future
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
            Our AI Career Engine is analyzing your profile, identifying skill gaps, and building your personalized roadmap...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-8 glass-card rounded-[3rem] border-red-500/20 max-w-md">
          <h2 className="text-2xl font-black text-white mb-4">Something went wrong</h2>
          <p className="text-slate-400 mb-8">{error}</p>
          <button
            onClick={() => setProfile(null)}
            className="px-8 py-4 bg-indigo-500 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617]">
      <AnimatePresence mode="wait">
        {selectedPackage ? (
          <motion.div
            key="booking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BookingPage 
              pkg={selectedPackage} 
              onBack={() => setSelectedPackage(null)} 
              onComplete={() => setSelectedPackage(null)} 
            />
          </motion.div>
        ) : showLanding ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage 
              onStart={(plan) => {
                setSelectedPlan(plan);
                if (plan === 'Basic') {
                  setShowLanding(false);
                } else {
                  setShowPayment(true);
                }
              }} 
              onBook={(pkg) => setSelectedPackage(pkg)}
            />
          </motion.div>
        ) : showPayment ? (
          <motion.div
            key="payment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SubscriptionPayment 
              plan={selectedPlan} 
              onBack={() => setShowPayment(false)} 
              onConfirm={() => {
                setShowPayment(false);
                setShowLanding(false);
              }} 
            />
          </motion.div>
        ) : !roadmap ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Onboarding 
              onComplete={handleOnboardingComplete} 
              onBack={() => setShowLanding(true)}
              initialPlan={selectedPlan}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dashboard 
              roadmap={roadmap} 
              profile={profile!} 
              onUpdateRoadmap={(updated) => setRoadmap(prev => ({ ...prev!, ...updated }))} 
              onUpdateProfile={handleProfileUpdate}
              onBackToLanding={() => {
                setRoadmap(null);
                setProfile(null);
                setShowLanding(true);
              }}
              onEditProfile={() => setRoadmap(null)}
              onBook={(pkg) => setSelectedPackage(pkg)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
