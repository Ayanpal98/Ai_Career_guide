import React from 'react';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { UserProfile, CareerRoadmap } from './types';
import { generateCareerRoadmap } from './services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  const [showLanding, setShowLanding] = React.useState(true);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [roadmap, setRoadmap] = React.useState<CareerRoadmap | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleOnboardingComplete = async (userProfile: UserProfile) => {
    setProfile(userProfile);
    setLoading(true);
    setError(null);
    try {
      const generatedRoadmap = await generateCareerRoadmap(userProfile);
      setRoadmap(generatedRoadmap);
    } catch (err) {
      console.error('Failed to generate roadmap:', err);
      setError('Failed to generate your roadmap. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
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
        <div className="p-8 glass rounded-[3rem] border-red-500/20 max-w-md">
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
        {showLanding ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage onStart={() => setShowLanding(false)} />
          </motion.div>
        ) : !roadmap ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Onboarding onComplete={handleOnboardingComplete} />
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
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
