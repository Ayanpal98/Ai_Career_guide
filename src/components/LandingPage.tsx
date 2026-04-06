import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Sparkles, CheckCircle2, ArrowRight, Play, Users, 
  Target, BarChart3, MessageSquare, ShieldCheck, Star,
  ChevronRight, ArrowUpRight, Globe, Lock, AlertTriangle
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-black text-xl tracking-tighter">
            <div className="p-1.5 rounded-lg bg-indigo-500">
              <Zap size={18} />
            </div>
            CareerPath
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <button 
            onClick={onStart}
            className="px-6 py-2.5 bg-white text-slate-950 font-black rounded-xl text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles size={14} />
            AI-Powered Career Architect
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white tracking-tight mb-8 leading-[0.9]"
          >
            Stop Guessing.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Start Growing.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed mb-12"
          >
            The only platform that turns your career goals into a step-by-step execution roadmap with real-time AI coaching.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button 
              onClick={onStart}
              className="group flex items-center gap-3 px-10 py-5 bg-white text-slate-950 font-black rounded-2xl text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10"
            >
              Get Your Roadmap
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center gap-3 px-10 py-5 bg-white/5 text-white font-black rounded-2xl text-lg border border-white/10 hover:bg-white/10 transition-all">
              <Play size={20} fill="currentColor" />
              Watch Demo
            </button>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-24 relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10" />
            <div className="premium-border p-2 rounded-[2.5rem] bg-slate-900/50 backdrop-blur-3xl shadow-2xl overflow-hidden">
              <img 
                src="https://picsum.photos/seed/dashboard/1600/900" 
                alt="Dashboard Preview" 
                className="rounded-[2rem] w-full opacity-80 grayscale-[0.5] group-hover:grayscale-0 transition-all"
                referrerPolicy="no-referrer"
              />
              {/* Floating UI Elements */}
              <div className="absolute top-12 -left-12 glass p-6 rounded-3xl border-indigo-500/30 hidden lg:block animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-indigo-500 text-white">
                    <Target size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Next Action</div>
                    <div className="text-sm font-black text-white">Complete Portfolio Audit</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-24 -right-12 glass p-6 rounded-3xl border-emerald-500/30 hidden lg:block animate-bounce-slow [animation-delay:1s]">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500 text-white">
                    <Sparkles size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Coach</div>
                    <div className="text-sm font-black text-white">"You're 15% ahead of schedule!"</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">Google</div>
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">Meta</div>
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">Amazon</div>
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">Stripe</div>
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">Netflix</div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.3em]">Trusted by professionals at world-class companies</p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">The Career Fog is Real.</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">Most people don't lack ambition. They lack a sequence.</p>
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
              <div key={i} className="glass p-10 rounded-[3rem] border-white/5 hover:border-white/10 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 mb-8">
                  <item.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-8">
                The Solution
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
                Precision Engineering for Your Career.
              </h2>
              <p className="text-slate-400 text-xl leading-relaxed mb-12">
                We don't just give you a list of skills. We architect a sequence of actions, projects, and milestones tailored to your DNA.
              </p>
              
              <div className="space-y-6">
                {[
                  "AI-Generated Step-by-Step Roadmaps",
                  "Real-time Skill Gap Analysis",
                  "24/7 AI Career Coaching",
                  "Verified Industry Milestones"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 text-white font-bold">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <CheckCircle2 size={14} />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="glass p-8 rounded-[2.5rem] border-indigo-500/20">
                  <BarChart3 size={32} className="text-indigo-400 mb-6" />
                  <h4 className="text-xl font-bold text-white mb-2">Progress Tracking</h4>
                  <p className="text-sm text-slate-400">Visualize every step of your journey with deep analytics.</p>
                </div>
                <div className="glass p-8 rounded-[2.5rem] border-purple-500/20">
                  <MessageSquare size={32} className="text-purple-400 mb-6" />
                  <h4 className="text-xl font-bold text-white mb-2">AI Coach</h4>
                  <p className="text-sm text-slate-400">Get instant answers to your career dilemmas, anytime.</p>
                </div>
              </div>
              <div className="space-y-6 mt-12">
                <div className="glass p-8 rounded-[2.5rem] border-emerald-500/20">
                  <Target size={32} className="text-emerald-400 mb-6" />
                  <h4 className="text-xl font-bold text-white mb-2">Next Step Focus</h4>
                  <p className="text-sm text-slate-400">Never feel overwhelmed. We show you exactly what to do next.</p>
                </div>
                <div className="glass p-8 rounded-[2.5rem] border-amber-500/20">
                  <Zap size={32} className="text-amber-400 mb-6" />
                  <h4 className="text-xl font-bold text-white mb-2">Project Lab</h4>
                  <p className="text-sm text-slate-400">Build real-world projects that prove your expertise.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-24">3 Steps to Mastery.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-y-1/2 z-0" />
            
            {[
              { step: "01", title: "Define Your Goal", desc: "Tell us where you are and where you want to be. Our AI analyzes your starting point." },
              { step: "02", title: "Get Your Roadmap", desc: "Receive a custom-built, phase-by-phase plan with specific tasks and resources." },
              { step: "03", title: "Execute & Grow", desc: "Follow the daily rituals, complete tasks, and track your progress to the top." }
            ].map((item, i) => (
              <div key={i} className="relative z-10 space-y-6">
                <div className="w-20 h-20 rounded-full bg-indigo-500 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/20">
                  {item.step}
                </div>
                <h3 className="text-2xl font-black text-white">{item.title}</h3>
                <p className="text-slate-400 max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Invest in Your Future.</h2>
            <p className="text-slate-400 text-xl">Plans designed to take you from beginner to industry leader.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic */}
            <div className="glass p-12 rounded-[3rem] border-white/5 flex flex-col">
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Basic</div>
              <div className="text-5xl font-black text-white mb-8">₹0<span className="text-lg text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-12 flex-1">
                {["1 Career Roadmap", "Basic Progress Tracking", "Community Access", "Public Resources"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                    <CheckCircle2 size={16} className="text-slate-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onStart}
                className="w-full py-4 bg-white/5 text-white font-black rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
              >
                Start Free
              </button>
            </div>

            {/* Pro */}
            <div className="premium-border p-12 rounded-[3rem] bg-slate-900/50 backdrop-blur-3xl flex flex-col relative scale-105 z-10 shadow-2xl shadow-indigo-500/10">
              <div className="absolute top-0 right-12 -translate-y-1/2 px-4 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                Most Popular
              </div>
              <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Pro</div>
              <div className="text-5xl font-black text-white mb-8">₹999<span className="text-lg text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-12 flex-1">
                {[
                  "Unlimited Roadmaps",
                  "AI Skill Gap Analysis",
                  "Project Lab Access",
                  "Weekly Accountability",
                  "Priority AI Support"
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-indigo-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onStart}
                className="w-full py-4 bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                Get Pro Access
              </button>
            </div>

            {/* Premium */}
            <div className="glass p-12 rounded-[3rem] border-purple-500/20 flex flex-col">
              <div className="text-xs font-black text-purple-400 uppercase tracking-widest mb-4">Premium</div>
              <div className="text-5xl font-black text-white mb-8">₹2,499<span className="text-lg text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-12 flex-1">
                {[
                  "Everything in Pro",
                  "1:1 AI Coaching Sessions",
                  "Interview Simulation",
                  "Direct Expert Access",
                  "Placement Support",
                  "Lifetime Updates"
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                    <CheckCircle2 size={16} className="text-purple-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onStart}
                className="w-full py-4 bg-purple-500 text-white font-black rounded-2xl shadow-xl shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                Go Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto glass p-12 md:p-20 rounded-[4rem] relative overflow-hidden border-indigo-500/10">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Need 1:1 Human Guidance?</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Sometimes you need a veteran's perspective. Book a session with industry experts from top tech companies.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 text-sm font-bold text-white">₹999 / Quick Sync</div>
                <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 text-sm font-bold text-white">₹1,999 / Deep Dive</div>
              </div>
              <button className="flex items-center gap-3 px-8 py-4 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all">
                Book a Session
                <ArrowUpRight size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="https://picsum.photos/seed/expert1/400/500" alt="Expert" className="rounded-3xl w-full h-64 object-cover grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/expert2/400/400" alt="Expert" className="rounded-3xl w-full h-48 object-cover grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-4 mt-8">
                <img src="https://picsum.photos/seed/expert3/400/400" alt="Expert" className="rounded-3xl w-full h-48 object-cover grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/expert4/400/500" alt="Expert" className="rounded-3xl w-full h-64 object-cover grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Success Stories.</h2>
            <p className="text-slate-400 text-xl">Real people. Real growth. Real results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rahul Sharma",
                role: "SDE at Amazon",
                text: "I was stuck in a mid-level role for 3 years. CareerPath's roadmap showed me exactly which system design skills I was missing. 4 months later, I landed my dream role.",
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
              <div key={i} className="glass p-10 rounded-[3rem] border-white/5 relative">
                <div className="flex items-center gap-4 mb-8">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full grayscale" referrerPolicy="no-referrer" />
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{t.role}</div>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed italic">"{t.text}"</p>
                <div className="absolute top-10 right-10 text-indigo-500/20">
                  <Star size={40} fill="currentColor" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-32 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-5xl font-black text-white mb-2">94%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Goal Completion Rate</div>
          </div>
          <div>
            <div className="text-5xl font-black text-white mb-2">50k+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Professionals</div>
          </div>
          <div>
            <div className="text-5xl font-black text-white mb-2">₹12L</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Avg. Salary Hike</div>
          </div>
          <div>
            <div className="text-5xl font-black text-white mb-2">4.9/5</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">User Satisfaction</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Start building your career today.
          </h2>
          <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Join 50,000+ professionals who have stopped guessing and started growing with AI-architected roadmaps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onStart}
              className="px-12 py-6 bg-white text-slate-950 font-black rounded-2xl text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10"
            >
              Get Started Now
            </button>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
              <ShieldCheck size={18} className="text-emerald-500" />
              No credit card required
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter">
            <div className="p-1.5 rounded-lg bg-indigo-500">
              <Zap size={20} />
            </div>
            CareerPath
          </div>
          <div className="flex gap-12 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
          <div className="text-sm font-bold text-slate-600 uppercase tracking-widest">
            © 2026 CareerPath AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
