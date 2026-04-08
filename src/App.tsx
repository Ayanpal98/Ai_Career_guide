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
import { Sparkles, Loader2, LogOut } from 'lucide-react';
import { auth, db, googleProvider } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/firestoreErrorHandler';

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(false);
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

  // Auth State Listener
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch profile and roadmap from Firestore
        setLoading(true);
        try {
          const profileDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (profileDoc.exists()) {
            const profileData = profileDoc.data() as UserProfile;
            setProfile(profileData);
            
            const roadmapDoc = await getDoc(doc(db, 'roadmaps', currentUser.uid));
            if (roadmapDoc.exists()) {
              setRoadmap(roadmapDoc.data().roadmap as CareerRoadmap);
              setShowLanding(false);
            }
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}`);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setRoadmap(null);
        setShowLanding(true);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Failed to sign in. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowLanding(true);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

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
              onSignIn={handleSignIn}
              onSignOut={handleSignOut}
              onStart={(plan) => {
                if (!user) {
                  handleSignIn();
                  return;
                }
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
              onSignOut={handleSignOut}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
