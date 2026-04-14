import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Sparkles, CheckCircle2, ArrowRight, Play, Users, User,
  Target, BarChart3, MessageSquare, ShieldCheck, Star,
  ChevronRight, ArrowUpRight, Globe, Lock, AlertTriangle, X,
  Search, Filter
} from 'lucide-react';

import { SubscriptionPlan, ConsultationPackage, UserProfile } from '../types';
import RocketScene from './RocketModel';

interface LandingPageProps {
  onStart: (plan: SubscriptionPlan) => void;
  onBook: (pkg: ConsultationPackage) => void;
  profile?: UserProfile | null;
  onGoToDashboard?: () => void;
}

console.log('LandingPage.tsx: Module evaluating...');

export default function LandingPage({ onStart, onBook, profile, onGoToDashboard }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-gray-100 bg-white/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-900 font-black text-2xl tracking-tighter">
            <div className="p-1.5 rounded-lg bg-primary text-white">
              <Zap size={20} />
            </div>
            CAREERPATH
          </div>
          <div className="hidden md:flex items-center gap-10 text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
            <a href="#resources" className="hover:text-primary transition-colors">Resources</a>
            <a href="#explore" className="hover:text-primary transition-colors">Explore</a>
            <a href="#connect" className="hover:text-primary transition-colors">Connect</a>
          </div>
          <div className="flex items-center gap-4">
            {profile ? (
              <button 
                onClick={onGoToDashboard}
                className="flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center border border-primary/20">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={16} className="text-primary" />
                  )}
                </div>
                <span className="hidden sm:block text-xs font-black text-gray-900 uppercase tracking-widest">Dashboard</span>
                <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button 
                onClick={() => onStart('Basic')}
                className="px-8 py-2.5 border-2 border-primary text-primary font-black rounded-full text-sm hover:bg-primary hover:text-white transition-all"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black text-gray-900 leading-[1.1] tracking-tight mb-12">
              Find the career that will let you pursue your passions
            </h1>

            <div className="relative max-w-xl group">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center p-2 bg-[#F2F1EB] rounded-full border border-gray-100 shadow-sm">
                <div className="pl-6 text-gray-400">
                  <Search size={24} />
                </div>
                <input 
                  type="text" 
                  placeholder="Explore any career"
                  className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-medium text-gray-700 px-4 placeholder:text-gray-400"
                />
                <button className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/30">
                  <Zap size={28} />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative h-[500px] lg:h-[600px] bg-[#F2F1EB] rounded-[4rem] overflow-hidden shadow-inner"
          >
            <RocketScene />
          </motion.div>
        </div>
      </section>

      {/* Trending Careers Section */}
      <section id="explore" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Trending Careers</h2>
            <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">
              Filter <Filter size={18} />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar Tabs */}
            <div className="w-full lg:w-64 shrink-0">
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar">
                {[
                  { id: 'management', label: 'Management' },
                  { id: 'design', label: 'Design', active: true },
                  { id: 'development', label: 'Development' },
                  { id: 'marketing', label: 'Marketing' },
                  { id: 'customer-service', label: 'Customer Service' }
                ].map((cat) => (
                  <button 
                    key={cat.id}
                    className={`relative px-6 py-4 text-left text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                      cat.active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {cat.active && (
                      <motion.div 
                        layoutId="active-cat"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full"
                      />
                    )}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Career Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[
                { title: 'UX Designer', mentors: '400+', image: 'https://picsum.photos/seed/ux/600/400' },
                { title: 'UI Designer', mentors: '600+', image: 'https://picsum.photos/seed/ui/600/400' },
                { title: 'Product Designer', mentors: '200+', image: 'https://picsum.photos/seed/product/600/400' }
              ].map((career, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                    <img 
                      src={career.image} 
                      alt={career.title}
                      className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">{career.title}</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
                      <span className="text-primary">{career.mentors} Mentors</span>
                      <span>•</span>
                      <span>ADPList</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <button className="flex items-center gap-2 px-6 py-3 bg-[#F2F1EB] rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                        Explore <Zap size={16} className="text-primary group-hover:text-white" />
                      </button>
                      <button className="p-3 bg-[#90C8C2] text-white rounded-xl hover:scale-110 transition-transform">
                        <Globe size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-white/5 bg-white/[0.01] overflow-hidden">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Trusted by professionals at world-class companies</p>
          </div>
          <div className="flex overflow-hidden group">
            <div className="flex gap-16 md:gap-32 animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused] whitespace-nowrap px-8">
              {['Google', 'Meta', 'Amazon', 'Stripe', 'Netflix', 'Apple', 'Microsoft', 'Airbnb', 'Uber', 'SpaceX'].map((company) => (
                <div key={company} className="flex items-center gap-2 font-black text-2xl md:text-3xl tracking-tighter text-slate-500 hover:text-white transition-colors cursor-default">
                  {company}
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {['Google', 'Meta', 'Amazon', 'Stripe', 'Netflix', 'Apple', 'Microsoft', 'Airbnb', 'Uber', 'SpaceX'].map((company) => (
                <div key={`${company}-2`} className="flex items-center gap-2 font-black text-2xl md:text-3xl tracking-tighter text-slate-500 hover:text-white transition-colors cursor-default">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 px-6 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">The Career Fog is Real.</h2>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto">Most people don't lack ambition. They lack a sequence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Globe, 
                title: "LinkedIn Overload", 
                desc: "Endless scrolling through success stories makes you feel behind, without showing you how to get there." 
              },
              { 
                icon: Lock, 
                title: "Tutorial Hell", 
                desc: "Learning random skills without a structured path leads to burnout and zero real-world progress." 
              },
              { 
                icon: AlertTriangle, 
                title: "Direction Anxiety", 
                desc: "The constant 'What's Next?' keeps you paralyzed while others move forward with precision." 
              }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[3rem] border border-gray-100 cursor-default card-3d shadow-sm hover:shadow-md"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-primary mb-8 depth-2">
                  <item.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 depth-1">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed depth-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="py-32 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8">
                The Solution
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
                Precision Engineering for Your Career.
              </h2>
              <p className="text-gray-500 text-xl leading-relaxed mb-12">
                We don't just give you a list of skills. We architect a sequence of actions, projects, and milestones tailored to your DNA.
              </p>
              
              <div className="space-y-6">
                {[
                  "AI-Generated Step-by-Step Roadmaps",
                  "Real-time Skill Gap Analysis",
                  "24/7 AI Career Coaching",
                  "Verified Industry Milestones"
                ].map((feature, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-4 text-gray-900 font-bold"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <CheckCircle2 size={14} />
                    </div>
                    {feature}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 card-3d shadow-sm"
                >
                  <BarChart3 size={32} className="text-primary mb-6 depth-2" />
                  <h4 className="text-xl font-bold text-gray-900 mb-2 depth-1">Progress Tracking</h4>
                  <p className="text-sm text-gray-500 depth-1">Visualize every step of your journey with deep analytics.</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 card-3d shadow-sm"
                >
                  <MessageSquare size={32} className="text-purple-400 mb-6 depth-2" />
                  <h4 className="text-xl font-bold text-gray-900 mb-2 depth-1">AI Coach</h4>
                  <p className="text-sm text-gray-500 depth-1">Get instant answers to your career dilemmas, anytime.</p>
                </motion.div>
              </div>
              <div className="space-y-6 mt-12">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 card-3d shadow-sm"
                >
                  <Target size={32} className="text-emerald-400 mb-6 depth-2" />
                  <h4 className="text-xl font-bold text-gray-900 mb-2 depth-1">Next Step Focus</h4>
                  <p className="text-sm text-gray-500 depth-1">Never feel overwhelmed. We show you exactly what to do next.</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 card-3d shadow-sm"
                >
                  <Zap size={32} className="text-amber-400 mb-6 depth-2" />
                  <h4 className="text-xl font-bold text-gray-900 mb-2 depth-1">Project Lab</h4>
                  <p className="text-sm text-gray-500 depth-1">Build real-world projects that prove your expertise.</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-24">3 Steps to Mastery.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
            
            {[
              { step: "01", title: "Define Your Goal", desc: "Tell us where you are and where you want to be. Our AI analyzes your starting point." },
              { step: "02", title: "Get Your Roadmap", desc: "Receive a custom-built, phase-by-phase plan with specific tasks and resources." },
              { step: "03", title: "Execute & Grow", desc: "Follow the daily rituals, complete tasks, and track your progress to the top." }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, type: "spring", stiffness: 100 }}
                className="relative z-10 space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-primary text-white font-black text-2xl flex items-center justify-center mx-auto shadow-2xl shadow-primary/20">
                  {item.step}
                </div>
                <h3 className="text-2xl font-black text-gray-900">{item.title}</h3>
                <p className="text-gray-500 max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">Invest in Your Future.</h2>
            <p className="text-gray-500 text-xl">Plans designed to take you from beginner to industry leader.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-12 rounded-[3rem] border border-gray-100 flex flex-col card-3d shadow-sm hover:shadow-md"
            >
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 depth-1">Basic</div>
              <div className="text-5xl font-black text-gray-900 mb-8 depth-2">
                ₹0<span className="text-lg text-gray-400">/mo</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                {["1 Career Roadmap", "Basic Progress Tracking", "Community Access", "Public Resources"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-500">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => onStart('Basic')}
                className="w-full py-4 bg-gray-50 text-gray-900 font-black rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all"
              >
                Start Free
              </button>
            </motion.div>

            {/* Pro */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-12 rounded-[3rem] border border-primary/20 flex flex-col relative scale-105 z-10 shadow-2xl shadow-primary/10 card-3d"
            >
              <div className="absolute top-0 right-12 -translate-y-1/2 px-4 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full depth-3">
                Most Popular
              </div>
              <div className="text-xs font-black text-primary uppercase tracking-widest mb-4 depth-1">Pro</div>
              <div className="text-5xl font-black text-gray-900 mb-8 depth-2">
                ₹999<span className="text-lg text-gray-400">/mo</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                {[
                  "Unlimited Roadmaps",
                  "AI Skill Gap Analysis",
                  "Project Lab Access",
                  "Weekly Accountability",
                  "Priority AI Support"
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle2 size={16} className="text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => onStart('Pro')}
                className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                Get Pro Access
              </button>
            </motion.div>

            {/* Premium */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-12 rounded-[3rem] border border-purple-100 flex flex-col card-3d shadow-sm hover:shadow-md"
            >
              <div className="text-xs font-black text-purple-400 uppercase tracking-widest mb-4 depth-1">Premium</div>
              <div className="text-5xl font-black text-gray-900 mb-8 depth-2">
                ₹2,499<span className="text-lg text-gray-400">/mo</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                {[
                  "Everything in Pro",
                  "1:1 AI Coaching Sessions",
                  "Interview Simulation",
                  "Direct Expert Access",
                  "Placement Support",
                  "Lifetime Updates"
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-500">
                    <CheckCircle2 size={16} className="text-purple-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => onStart('Premium')}
                className="w-full py-4 bg-purple-500 text-white font-black rounded-2xl shadow-xl shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                Go Premium
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <section id="consultation" className="py-32 px-6 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-24">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8">
                <ShieldCheck size={14} />
                Premium Experience
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tighter">
                Accelerate with <span className="text-primary">1:1 Mastery.</span>
              </h2>
              <p className="text-gray-500 text-xl leading-relaxed">
                AI gives you the map. Our mentors give you the <span className="text-gray-900 font-bold">keys to the room.</span> Direct access to leaders from Google, Meta, and top-tier startups.
              </p>
            </div>
            <div className="flex flex-col items-end gap-4">
              <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">Only 4 spots left this month</span>
              </div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Next availability: April 12th</p>
            </div>
          </div>

          {/* Why 1:1 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {[
              { icon: Target, title: "Custom Strategy", desc: "No generic advice. We analyze your specific situation and build a plan that works for you." },
              { icon: Lock, title: "Insider Secrets", desc: "Learn the unwritten rules of hiring, networking, and promotion that aren't on the internet." },
              { icon: MessageSquare, title: "Direct Feedback", desc: "Get brutal honesty on your resume, portfolio, and interview style from people who hire." }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 cursor-default card-3d shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary mb-6 depth-2">
                  <item.icon size={24} />
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-4 depth-1">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed depth-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Packages */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
            {[
              { 
                title: "Quick Sync", 
                price: "₹999", 
                duration: "30 Minutes",
                desc: "Laser-focused session for specific roadblocks or resume audits.",
                features: ["Resume/Portfolio Audit", "Specific Career Q&A", "Session Recording", "Actionable Next Steps"],
                color: "indigo",
                upiId: "8798610548@ybl"
              },
              { 
                title: "Deep Dive", 
                price: "₹1,999", 
                duration: "60 Minutes",
                desc: "Comprehensive strategy session to unlock your full potential.",
                features: ["Full Roadmap Review", "Mock Interview (1 Round)", "Networking Strategy", "Custom Resource List", "Action Plan PDF"],
                color: "purple",
                popular: true,
                upiId: "8798610548@ybl"
              },
              { 
                title: "Elite Package", 
                price: "₹4,999+", 
                duration: "Full Mentorship",
                desc: "High-touch guidance for those aiming for the top 1% of their field.",
                features: ["3-5 Strategy Sessions", "Direct WhatsApp Access", "Placement Support", "Priority Booking", "Lifetime Community Access"],
                color: "amber",
                upiId: "8798610548@ybl"
              }
            ].map((pkg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover="hover"
                className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col relative group"
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl shadow-primary/20 z-20">
                    Most Popular
                  </div>
                )}
                <div className={`text-xs font-black text-${pkg.color === 'amber' ? 'amber' : pkg.color === 'purple' ? 'purple' : 'primary'}-500 uppercase tracking-widest mb-4`}>{pkg.title}</div>
                <motion.div 
                  variants={{ hover: { scale: 1.1, color: pkg.color === 'amber' ? '#f59e0b' : pkg.color === 'purple' ? '#a855f7' : '#F27D26' } }}
                  className="text-5xl font-black text-gray-900 mb-2 tracking-tighter"
                >
                  {pkg.price}
                </motion.div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">{pkg.duration}</div>
                
                <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">{pkg.desc}</p>
                
                <ul className="space-y-4 mb-12 flex-1">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                      <CheckCircle2 size={14} className={`text-${pkg.color === 'amber' ? 'amber' : pkg.color === 'purple' ? 'purple' : 'primary'}-500`} />
                      {f}
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => onBook(pkg)}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  pkg.color === 'indigo' ? 'bg-gray-50 text-gray-900 border border-gray-100 hover:bg-gray-100' :
                  pkg.color === 'purple' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20 hover:scale-105' :
                  'bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:scale-105'
                }`}>
                  Book Your Session
                </button>

                {pkg.upiId && (
                  <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pay via UPI</div>
                    <div className="text-xs font-mono text-primary select-all cursor-pointer hover:text-primary/80 transition-colors">
                      {pkg.upiId}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Social Proof Footer */}
          <div className="bg-white p-12 md:p-20 rounded-[4rem] relative overflow-hidden border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Trusted by 10,000+ Professionals.</h3>
                <p className="text-gray-500 text-lg leading-relaxed mb-8 font-medium">
                  Our mentors are leaders from top-tier companies. They don't just teach; they lead the industry.
                </p>
                <div className="flex items-center gap-8">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                      <img 
                        key={i} 
                        src={`https://picsum.photos/seed/mentor${i}/100/100`} 
                        className="w-12 h-12 rounded-full border-4 border-white grayscale hover:grayscale-0 transition-all cursor-pointer shadow-sm" 
                        alt="Mentor"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                  <div className="h-12 w-px bg-gray-100" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">4.9/5 Avg. Rating</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="text-3xl font-black text-gray-900 mb-1">98%</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Success Rate</div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="text-3xl font-black text-gray-900 mb-1">45%</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg. Salary Hike</div>
                  </div>
                </div>
                <div className="space-y-6 mt-12">
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="text-3xl font-black text-gray-900 mb-1">24h</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Response Time</div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="text-3xl font-black text-gray-900 mb-1">10k+</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sessions Done</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="resources" className="py-32 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Success Stories.</h2>
            <p className="text-gray-500 text-xl font-medium">Real people. Real growth. Real results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rahul Sharma",
                role: "SDE at Amazon",
                text: "I was stuck in a mid-level role for 3 years. Career Path builder's roadmap showed me exactly which system design skills I was missing. 4 months later, I landed my dream role.",
                avatar: "https://picsum.photos/seed/user1/100/100"
              },
              {
                name: "Ananya Iyer",
                role: "Product Designer",
                text: "The AI Coach is like having a mentor in my pocket. Whenever I feel stuck on a project, I get instant strategic advice that actually works.",
                avatar: "https://picsum.photos/seed/user2/100/100"
              },
              {
                name: "Vikram Mehta",
                role: "Data Scientist",
                text: "The 'Next Step' focus is a game changer. I no longer feel overwhelmed by the vastness of Data Science. I just follow the rituals and grow.",
                avatar: "https://picsum.photos/seed/user3/100/100"
              }
            ].map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 mb-8">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                  <div>
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed italic font-medium">"{t.text}"</p>
                <div className="absolute top-10 right-10 text-primary/10">
                  <Star size={40} fill="currentColor" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-32 px-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { val: "94%", label: "Goal Completion Rate" },
            { val: "50k+", label: "Active Professionals" },
            { val: "₹12L", label: "Avg. Salary Hike" },
            { val: "4.9/5", label: "User Satisfaction" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-5xl font-black text-gray-900 mb-2">{stat.val}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
            Start building your career today.
          </h2>
          <p className="text-gray-500 text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Join 50,000+ professionals who have stopped guessing and started growing with AI-architected roadmaps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => onStart('Basic')}
              className="px-12 py-6 bg-primary text-white font-black rounded-2xl text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20"
            >
              Get Started Now
            </button>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <ShieldCheck size={18} className="text-emerald-500" />
              No credit card required
            </div>
          </div>
        </motion.div>
      </section>

      {/* Built By Section */}
      <section className="py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.4em]">
            Built BY <span className="text-gray-900">ATSFY Technologies</span>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="connect" className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-2 text-gray-900 font-black text-2xl tracking-tighter font-display uppercase">
            <div className="p-1.5 rounded-lg bg-primary text-white">
              <Zap size={20} />
            </div>
            CAREERPATH
          </div>
          <div className="flex gap-12 text-sm font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            © 2026 CAREERPATH. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
