import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerRoadmap, SubscriptionPlan, UserProfile, ChatMessage } from '../types';
import { chatWithCoach } from '../services/gemini';
import { 
  LayoutDashboard, Map as MapIcon, ListTodo, BarChart3, MessageSquare, Settings, 
  CheckCircle2, Circle, ChevronRight, Lock, Sparkles, Zap, Award, Target, TrendingUp,
  AlertTriangle, Calendar, ExternalLink, ArrowUpRight, Play, Clock, Send, Loader2, User
} from 'lucide-react';

interface DashboardProps {
  roadmap: CareerRoadmap;
  profile: UserProfile;
  onUpdateRoadmap: (updated: Partial<CareerRoadmap>) => void;
}

export default function Dashboard({ roadmap, profile, onUpdateRoadmap }: DashboardProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'roadmap' | 'tasks' | 'progress' | 'coach'>('overview');
  const [completedTasks, setCompletedTasks] = React.useState<Record<string, boolean>>({});
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatWithCoach(input, messages, profile, roadmap);
      const coachMessage: ChatMessage = { role: 'model', text: response.message };
      setMessages(prev => [...prev, coachMessage]);
      
      if (response.updatedRoadmap) {
        onUpdateRoadmap(response.updatedRoadmap);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const calculateProgress = () => {
    const total = roadmap.phases.reduce((acc, phase) => acc + phase.tasks.length, 0);
    const completed = Object.values(completedTasks).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  const progress = calculateProgress();
  const isPro = roadmap.plan === 'Pro' || roadmap.plan === 'Premium';
  const isPremium = roadmap.plan === 'Premium';

  const renderSidebar = () => (
    <nav className="fixed left-0 top-0 bottom-0 w-72 bg-[#020617] border-r border-slate-800/50 p-8 flex flex-col gap-8 z-50">
      <div className="flex items-center gap-3 text-white font-black text-2xl tracking-tighter mb-8">
        <div className="p-2 rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
          <Zap size={24} />
        </div>
        CareerPath
      </div>

      <div className="flex flex-col gap-2">
        {[
          { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'roadmap', icon: MapIcon, label: 'Roadmap' },
          { id: 'tasks', icon: ListTodo, label: 'Tasks' },
          { id: 'progress', icon: BarChart3, label: 'Progress' },
          { id: 'coach', icon: MessageSquare, label: 'AI Coach', locked: !isPremium },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => !item.locked && setActiveTab(item.id as any)}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative group ${
              activeTab === item.id
                ? 'bg-white/5 text-white font-bold'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            } ${item.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-indigo-400' : ''} />
            <span className="text-sm">{item.label}</span>
            {item.locked && <Lock size={14} className="ml-auto" />}
            {activeTab === item.id && (
              <motion.div
                layoutId="active-nav"
                className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
            <Sparkles size={120} />
          </div>
          <div className="relative z-10">
            <div className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">{roadmap.plan} Plan</div>
            <div className="text-lg font-black mb-4">Upgrade for 1:1 Coaching</div>
            <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
              View Plans
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderHeader = () => (
    <header className="mb-12 flex items-end justify-between gap-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tight">Welcome back 👋</h1>
        <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">{roadmap.summary}</p>
      </div>
      
      <div className="glass p-6 rounded-3xl min-w-[300px] relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Progress</span>
          <span className="text-2xl font-black text-white">{progress}%</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          />
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
          <TrendingUp size={14} />
          <span>On track for {roadmap.plan} milestones</span>
        </div>
      </div>
    </header>
  );

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Next Step Panel */}
      <div className="lg:col-span-2 space-y-8">
        <section className="premium-border p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Play size={120} className="text-white" />
          </div>
          <div className="relative z-10">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4 block">Next Immediate Step</span>
            <h2 className="text-3xl font-black text-white mb-4">{roadmap.nextStep}</h2>
            <div className="flex items-center gap-6 mb-8 text-slate-400 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-indigo-400" />
                <span>Focus Area: {roadmap.phases[0].title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-indigo-400" />
                <span>~2 hours</span>
              </div>
            </div>
            <button className="flex items-center gap-3 px-8 py-4 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
              Start Now
              <ArrowUpRight size={20} />
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="glass p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6 text-amber-500 font-bold uppercase tracking-widest text-xs">
              <AlertTriangle size={18} />
              Skill Gap Analysis
            </div>
            <ul className="space-y-4">
              {roadmap.skillGapAnalysis.map((gap, i) => (
                <li key={i} className="flex gap-4 text-slate-300 text-sm leading-relaxed">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  {gap}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6 text-emerald-500 font-bold uppercase tracking-widest text-xs">
              <Award size={18} />
              Your Strengths
            </div>
            <ul className="space-y-4">
              {roadmap.strengths.map((strength, i) => (
                <li key={i} className="flex gap-4 text-slate-300 text-sm leading-relaxed">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  {strength}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* AI Coach Insights */}
      <div className="space-y-8">
        <section className="glass p-8 rounded-[2rem] border-indigo-500/20">
          <div className="flex items-center gap-3 mb-6 text-indigo-400 font-bold uppercase tracking-widest text-xs">
            <MessageSquare size={18} />
            AI Coach Insights
          </div>
          <div className="space-y-6">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-sm text-slate-300 leading-relaxed italic relative">
              <Sparkles size={16} className="absolute -top-2 -right-2 text-amber-400" />
              "{roadmap.realityCheck}"
            </div>
            {isPremium && roadmap.accountabilityPrompts && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Weekly Reflection</span>
                <p className="text-xs text-slate-400">{roadmap.accountabilityPrompts[0]}</p>
              </div>
            )}
          </div>
        </section>

        {isPro && roadmap.projects && (
          <section className="glass p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6 text-blue-400 font-bold uppercase tracking-widest text-xs">
              <Zap size={18} />
              Project Lab
            </div>
            <div className="space-y-4">
              {roadmap.projects.slice(0, 2).map((project, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-slate-400 group hover:border-blue-500/30 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-200">Project {i + 1}</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  {project}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="space-y-12">
      {roadmap.phases.map((phase, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass p-10 rounded-[3rem] relative group"
        >
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
            <div className="max-w-xl">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4 block">Phase {i + 1}</span>
              <h3 className="text-3xl font-black text-white mb-4">{phase.title}</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">{phase.description}</p>
              
              <div className="flex flex-wrap gap-3">
                {phase.skills.map((skill, j) => (
                  <span key={j} className="px-4 py-2 bg-white/5 rounded-full text-xs font-bold text-slate-300 border border-white/5">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {phase.tasks.map((task, j) => (
                <button
                  key={j}
                  onClick={() => toggleTask(`${i}-${j}`)}
                  className={`flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group/task ${
                    completedTasks[`${i}-${j}`]
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:border-indigo-500/30'
                  }`}
                >
                  <div className={`shrink-0 p-1 rounded-full ${completedTasks[`${i}-${j}`] ? 'bg-emerald-500 text-white' : 'border-2 border-slate-700'}`}>
                    {completedTasks[`${i}-${j}`] ? <CheckCircle2 size={16} /> : <div className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-bold leading-tight">{task}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderTasks = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="space-y-8">
        <div className="flex items-center gap-3 font-black text-white mb-4 uppercase tracking-widest text-xs">
          <Calendar size={18} className="text-indigo-400" />
          Daily Rituals
        </div>
        {roadmap.actionPlan.daily.map((task, i) => (
          <div key={i} className="p-8 glass rounded-[2.5rem] space-y-4 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl ${
              task.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 
              task.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {task.difficulty}
            </div>
            <h4 className="text-xl font-bold text-white leading-tight">{task.task}</h4>
            <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Clock size={14} /> {task.timeRequired}</span>
              <span className="flex items-center gap-1.5"><Target size={14} /> {task.outcome}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-3 font-black text-white mb-4 uppercase tracking-widest text-xs">
          <TrendingUp size={18} className="text-purple-400" />
          Weekly Sprints
        </div>
        {roadmap.actionPlan.weekly.map((task, i) => (
          <div key={i} className="p-8 glass rounded-[2.5rem] space-y-4 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl ${
              task.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 
              task.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {task.difficulty}
            </div>
            <h4 className="text-xl font-bold text-white leading-tight">{task.task}</h4>
            <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Clock size={14} /> {task.timeRequired}</span>
              <span className="flex items-center gap-1.5"><Target size={14} /> {task.outcome}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-3 font-black text-white mb-4 uppercase tracking-widest text-xs">
          <Award size={18} className="text-amber-400" />
          Monthly Milestones
        </div>
        {roadmap.actionPlan.monthly.map((task, i) => (
          <div key={i} className="p-8 glass rounded-[2.5rem] space-y-4 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl ${
              task.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 
              task.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {task.difficulty}
            </div>
            <h4 className="text-xl font-bold text-white leading-tight">{task.task}</h4>
            <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Clock size={14} /> {task.timeRequired}</span>
              <span className="flex items-center gap-1.5"><Target size={14} /> {task.outcome}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const [showConsultation, setShowConsultation] = React.useState(false);

  const renderConsultation = () => (
    <div className="space-y-12">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <h2 className="text-4xl font-black text-white">1:1 Expert Consultation</h2>
        <p className="text-slate-400 max-w-2xl">Get personalized guidance from industry veterans. Book a session to accelerate your career growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Quick Sync', duration: '30 min', price: '₹999', features: ['Career path review', 'Resume feedback', 'Q&A session'], color: 'indigo' },
          { title: 'Deep Dive', duration: '60 min', price: '₹1,999', features: ['Mock interview', 'Detailed roadmap review', 'Networking strategy', 'Portfolio audit'], color: 'purple' },
          { title: 'Premium Package', duration: '3 Sessions', price: '₹4,999', features: ['End-to-end guidance', 'Placement support', 'Direct WhatsApp access', 'Priority booking'], color: 'emerald' },
        ].map(pkg => (
          <div key={pkg.title} className="glass p-10 rounded-[3rem] border-white/5 hover:border-white/10 transition-all group">
            <div className={`w-12 h-12 rounded-2xl bg-${pkg.color}-500/20 flex items-center justify-center text-${pkg.color}-400 mb-6 group-hover:scale-110 transition-transform`}>
              <Calendar size={24} />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">{pkg.title}</h3>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">{pkg.duration}</div>
            <div className="text-4xl font-black text-white mb-8">{pkg.price}</div>
            <ul className="space-y-4 mb-10">
              {pkg.features.map((f, i) => (
                <li key={i} className="text-sm text-slate-400 flex items-center gap-3">
                  <CheckCircle2 size={16} className={`text-${pkg.color}-400`} />
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              pkg.color === 'indigo' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' :
              pkg.color === 'purple' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' :
              'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
            } hover:scale-105 active:scale-95`}>
              Book Now
            </button>
          </div>
        ))}
      </div>

      <div className="glass p-12 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white">Need a custom plan?</h3>
          <p className="text-slate-400">Contact our enterprise team for bulk bookings and corporate training.</p>
        </div>
        <button className="px-8 py-4 bg-white/5 text-white font-black rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
          Contact Sales
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      {renderSidebar()}
      
      <main className="ml-72 p-12 max-w-7xl mx-auto">
        <div className="flex justify-end mb-8">
          <button 
            onClick={() => setShowConsultation(!showConsultation)}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
          >
            {showConsultation ? 'Back to Dashboard' : 'Book 1:1 Consultation'}
          </button>
        </div>

        {showConsultation ? renderConsultation() : (
          <>
            {renderHeader()}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'roadmap' && renderRoadmap()}
                {activeTab === 'tasks' && renderTasks()}
                {activeTab === 'progress' && (
                  <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <BarChart3 size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-white">Analytics Coming Soon</h2>
                    <p className="text-slate-400 max-w-md">We're building a deep performance tracking system to help you visualize your career growth.</p>
                  </div>
                )}
                {activeTab === 'coach' && isPremium && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 h-[calc(100vh-300px)]">
                    <div className="lg:col-span-2 flex flex-col glass rounded-[3rem] overflow-hidden border-indigo-500/20">
                      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <Sparkles size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-white">AI Career Coach</h3>
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              Online & Ready
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                        {messages.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                            <MessageSquare size={48} className="text-indigo-400" />
                            <p className="text-slate-400 max-w-xs">Ask me anything about your roadmap, skill gaps, or career strategy.</p>
                          </div>
                        )}
                        {messages.map((msg, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                              <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                                msg.role === 'user' ? 'bg-slate-800 text-slate-400' : 'bg-indigo-500 text-white'
                              }`}>
                                {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
                              </div>
                              <div className={`p-5 rounded-2xl text-sm leading-relaxed ${
                                msg.role === 'user' 
                                  ? 'bg-white/5 text-slate-200 rounded-tr-none' 
                                  : 'bg-indigo-500/10 text-slate-200 border border-indigo-500/20 rounded-tl-none'
                              }`}>
                                {msg.text}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="flex gap-4 max-w-[80%]">
                              <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
                                <Loader2 size={20} className="animate-spin" />
                              </div>
                              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 rounded-tl-none">
                                <div className="flex gap-1">
                                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      <form onSubmit={handleSendMessage} className="p-8 bg-white/5 border-t border-white/5">
                        <div className="relative">
                          <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask a follow-up question..."
                            className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          />
                          <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-indigo-500 text-white rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                          >
                            <Send size={20} />
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="space-y-8">
                      <section className="glass p-8 rounded-[3rem] border-purple-500/20 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-5">
                          <Award size={120} />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                          <Award size={22} className="text-purple-400" /> Interview Prep
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">{roadmap.interviewPrep?.strategy}</p>
                        <div className="space-y-3">
                          {roadmap.interviewPrep?.questions.slice(0, 2).map((q, i) => (
                            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-slate-300 italic text-xs">
                              "{q}"
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="glass p-8 rounded-[3rem] border-emerald-500/20">
                        <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                          <Target size={22} className="text-emerald-400" /> Dynamic Updates
                        </h4>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          Your AI Coach can adjust your roadmap in real-time. Just mention any new constraints or progress in the chat.
                        </p>
                      </section>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </main>
    </div>
  );
}
