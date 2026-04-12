import React from 'react';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import BookingPage from './components/BookingPage';
import SubscriptionPayment from './components/SubscriptionPayment';
import BasicFeatures from './components/BasicFeatures';
import ProFeatures from './components/ProFeatures';
import PremiumFeatures from './components/PremiumFeatures';
import ProfilePage from './components/ProfilePage';
import { UserProfile, CareerRoadmap, SubscriptionPlan, ConsultationPackage } from './types';
import { generateCareerRoadmap } from './services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, Zap } from 'lucide-react';
import { db } from './lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/firestoreErrorHandler';

console.log('App.tsx: Module evaluating...');

export default function App() {
  console.log('App: Component function called');
  const [user, setUser] = React.useState<any>({ uid: 'guest-user', email: 'guest@example.com' });
  const [isAuthReady, setIsAuthReady] = React.useState(true);
  
  React.useEffect(() => {
    console.log('App: Guest mode active');
  }, []);
  const [showLanding, setShowLanding] = React.useState(true);
  const [selectedPlan, setSelectedPlan] = React.useState<SubscriptionPlan>('Basic');
  const [showPayment, setShowPayment] = React.useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = React.useState(false);
  const [showBasicFeatures, setShowBasicFeatures] = React.useState(false);
  const [showProFeatures, setShowProFeatures] = React.useState(false);
  const [showPremiumFeatures, setShowPremiumFeatures] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState<ConsultationPackage | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [roadmap, setRoadmap] = React.useState<CareerRoadmap | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Auth State Listener (Bypassed for Guest Mode)
  React.useEffect(() => {
    console.log('App: Initializing in guest mode...');
    setIsAuthReady(true);
  }, []);

  const handleOnboardingComplete = async (userProfile: UserProfile) => {
    if (!user) return;
    
    const profileWithUid = { ...userProfile, uid: user.uid };
    setProfile(profileWithUid);
    setLoading(true);
    setError(null);
    try {
      const apiKey = (process.env as any).GEMINI_API_KEY;
      if (!apiKey || apiKey === "undefined") {
        throw new Error("GEMINI_API_KEY is not configured. Please add it to your environment variables in the Settings menu.");
      }
      const generatedRoadmap = await generateCareerRoadmap(profileWithUid);
      
      // Save to Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          ...profileWithUid,
          updatedAt: serverTimestamp()
        });
        
        await setDoc(doc(db, 'roadmaps', user.uid), {
          uid: user.uid,
          roadmap: generatedRoadmap,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }

      setRoadmap(generatedRoadmap);
    } catch (err) {
      console.error('Failed to generate roadmap:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate your roadmap. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    if (!user) return;

    setProfile(updatedProfile);
    setLoading(true);
    setError(null);
    try {
      const apiKey = (process.env as any).GEMINI_API_KEY;
      if (!apiKey || apiKey === "undefined") {
        throw new Error("GEMINI_API_KEY is not configured. Please add it to your environment variables in the Settings menu.");
      }
      const generatedRoadmap = await generateCareerRoadmap(updatedProfile);
      
      // Save to Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          ...updatedProfile,
          updatedAt: serverTimestamp()
        });
        
        await setDoc(doc(db, 'roadmaps', user.uid), {
          uid: user.uid,
          roadmap: generatedRoadmap,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }

      setRoadmap(generatedRoadmap);
    } catch (err) {
      console.error('Failed to regenerate roadmap:', err);
      setError(err instanceof Error ? err.message : 'Failed to update your roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthReady || loading) {
    console.log('App: Rendering loading screen...');
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-8 text-primary"
        >
          <Loader2 size={64} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-3 font-display uppercase italic">
            <Zap className="text-primary" fill="currentColor" />
            INOTION
          </h1>
          <p className="text-gray-400 text-xs font-black uppercase tracking-[0.4em]">
            Architecting Your Future
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="p-8 bg-white rounded-[3rem] border border-red-100 max-w-md shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">System Breach</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setProfile(null);
            }}
            className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            Reboot System
          </button>
        </div>
      </div>
    );
  }

  console.log('App: Rendering main UI...');
  return (
    <div className="min-h-screen bg-white">
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
        ) : showBasicFeatures ? (
          <motion.div
            key="basic-features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BasicFeatures 
              onBack={() => {
                setShowBasicFeatures(false);
                setShowLanding(true);
              }} 
              onConfirm={() => {
                setShowBasicFeatures(false);
                setShowLanding(false);
              }} 
            />
          </motion.div>
        ) : showProFeatures ? (
          <motion.div
            key="pro-features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProFeatures 
              isSuccess={isPaymentSuccess}
              onBack={() => {
                setShowProFeatures(false);
                setShowLanding(true);
              }} 
              onConfirm={() => {
                setShowProFeatures(false);
                if (isPaymentSuccess) {
                  setShowLanding(false);
                } else {
                  setShowPayment(true);
                }
              }} 
            />
          </motion.div>
        ) : showPremiumFeatures ? (
          <motion.div
            key="premium-features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PremiumFeatures 
              isSuccess={isPaymentSuccess}
              onBack={() => {
                setShowPremiumFeatures(false);
                setShowLanding(true);
              }} 
              onConfirm={() => {
                setShowPremiumFeatures(false);
                if (isPaymentSuccess) {
                  setShowLanding(false);
                } else {
                  setShowPayment(true);
                }
              }} 
            />
          </motion.div>
        ) : showProfile ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProfilePage 
              profile={profile!} 
              onUpdate={handleProfileUpdate} 
              onBack={() => setShowProfile(false)} 
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
              profile={profile}
              onGoToDashboard={() => setShowLanding(false)}
              onStart={(plan) => {
                setSelectedPlan(plan);
                setIsPaymentSuccess(false);
                setShowLanding(false);
                if (plan === 'Basic') {
                  setShowBasicFeatures(true);
                } else if (plan === 'Pro') {
                  setShowProFeatures(true);
                } else if (plan === 'Premium') {
                  setShowPremiumFeatures(true);
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
              onBack={() => {
                setShowPayment(false);
                setShowLanding(true);
              }} 
              onConfirm={() => {
                setShowPayment(false);
                setIsPaymentSuccess(true);
                if (selectedPlan === 'Pro') setShowProFeatures(true);
                if (selectedPlan === 'Premium') setShowPremiumFeatures(true);
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
                setShowLanding(true);
              }}
              onEditProfile={() => setShowProfile(true)}
              onBook={(pkg) => setSelectedPackage(pkg)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
