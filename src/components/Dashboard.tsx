import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerRoadmap, SubscriptionPlan, UserProfile, ChatMessage, ConsultationPackage } from '../types';
import { chatWithCoach } from '../services/gemini';
import { 
  LayoutDashboard, Map as MapIcon, ListTodo, BarChart3, MessageSquare, Settings, 
  CheckCircle2, Circle, ChevronRight, Lock, Sparkles, Zap, Award, Target, TrendingUp,
  AlertTriangle, Calendar, ExternalLink, ArrowUpRight, Play, Clock, Send, Loader2, User,
  Briefcase, Globe, Camera, HelpCircle, X
} from 'lucide-react';

interface DashboardProps {
  roadmap: CareerRoadmap;
  profile: UserProfile;
  onUpdateRoadmap: (updated: Partial<CareerRoadmap>) => void;
  onUpdateProfile: (updated: UserProfile) => void;
  onBackToLanding: () => void;
  onEditProfile: () => void;
  onBook: (pkg: ConsultationPackage) => void;
}

export default function Dashboard({ roadmap, profile, onUpdateRoadmap, onUpdateProfile, onBackToLanding, onEditProfile, onBook }: DashboardProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'roadmap' | 'tasks' | 'progress' | 'coach' | 'strategy'>('overview');
  const [completedTasks, setCompletedTasks] = React.useState<Record<string, boolean>>({});
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false);
  const [editedProfile, setEditedProfile] = React.useState<UserProfile>(profile);

  React.useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);
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
    <nav className="fixed left-0 top-0 bottom-0 w-72 glass-dark border-r border-white/5 p-8 flex flex-col gap-8 z-50">
      <div className="flex items-center gap-3 text-white font-black text-2xl tracking-tighter mb-4">
        <div className="p-2 rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
          <Zap size={24} />
        </div>
        Career Path builder
      </div>

      <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 mb-4">
        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-indigo-500/20 flex items-center justify-center shrink-0 border border-white/10">
          {profile.avatar ? (
            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <User size={24} className="text-indigo-400" />
          )}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-black text-white truncate">User Profile</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{profile.level}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {[
          { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'roadmap', icon: MapIcon, label: 'Roadmap' },
          { id: 'tasks', icon: ListTodo, label: 'Tasks' },
          { id: 'strategy', icon: Target, label: 'Strategy', locked: !isPro },
          { id: 'progress', icon: BarChart3, label: 'Progress' },
          { id: 'coach', icon: MessageSquare, label: 'AI Coach', locked: !isPro },
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

      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/5">
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="flex items-center gap-4 px-5 py-3 rounded-2xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
        >
          <Settings size={20} />
          <span className="text-sm">Edit Profile</span>
        </button>
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-4 px-5 py-3 rounded-2xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
        >
          <ExternalLink size={20} />
          <span className="text-sm">Exit to Home</span>
        </button>
      </div>

      <div className="mt-auto">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
            <Sparkles size={120} />
          </div>
          <div className="relative z-10">
            <div className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">{roadmap.plan} Plan</div>
            <div className="text-lg font-black mb-4">Upgrade for 1:1 Coaching</div>
            <button 
              onClick={onBackToLanding}
              className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
            >
              View Plans
            </button>
            <div className="mt-4 text-[10px] font-bold text-white/60 text-center">
              UPI: <span className="text-white select-all cursor-pointer">ayanpal0698@okaxis</span>
            </div>
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
      
      <div className="glass-card p-6 rounded-3xl min-w-[300px] relative overflow-hidden">
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
            <h2 className="text-3xl font-black text-white mb-4">{roadmap.nextStep || "Ready to begin your journey?"}</h2>
            <div className="flex items-center gap-6 mb-8 text-slate-400 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-indigo-400" />
                <span>Focus Area: {roadmap.phases?.[0]?.title || "Initial Phase"}</span>
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
          <section className="glass-card p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6 text-amber-500 font-bold uppercase tracking-widest text-xs">
              <AlertTriangle size={18} />
              Skill Gap Analysis
            </div>
            <ul className="space-y-4">
              {(roadmap.skillGapAnalysis || []).map((gap, i) => (
                <li key={i} className="flex gap-4 text-slate-300 text-sm leading-relaxed">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  {gap}
                </li>
              ))}
              {(!roadmap.skillGapAnalysis || roadmap.skillGapAnalysis.length === 0) && (
                <li className="text-slate-500 text-xs italic">No skill gaps identified yet.</li>
              )}
            </ul>
          </section>

          <section className="glass-card p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6 text-emerald-500 font-bold uppercase tracking-widest text-xs">
              <Award size={18} />
              Your Strengths
            </div>
            <ul className="space-y-4">
              {(roadmap.strengths || []).map((strength, i) => (
                <li key={i} className="flex gap-4 text-slate-300 text-sm leading-relaxed">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  {strength}
                </li>
              ))}
              {(!roadmap.strengths || roadmap.strengths.length === 0) && (
                <li className="text-slate-500 text-xs italic">Analyzing your strengths...</li>
              )}
            </ul>
          </section>
        </div>
      </div>

      {/* AI Coach Insights */}
      <div className="space-y-8">
        <section className="glass-card p-8 rounded-[2rem] border-indigo-500/20">
          <div className="flex items-center gap-3 mb-6 text-indigo-400 font-bold uppercase tracking-widest text-xs">
            <MessageSquare size={18} />
            AI Coach Insights
          </div>
          <div className="space-y-6">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-sm text-slate-300 leading-relaxed italic relative">
              <Sparkles size={16} className="absolute -top-2 -right-2 text-amber-400" />
              "{roadmap.realityCheck || "Your journey is unique. Stay focused and keep growing."}"
            </div>
            {isPremium && roadmap.accountabilityPrompts && roadmap.accountabilityPrompts.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Weekly Reflection</span>
                <p className="text-xs text-slate-400">{roadmap.accountabilityPrompts[0]}</p>
              </div>
            )}
          </div>
        </section>

        {isPro && roadmap.projects && (
          <section className="glass-card p-8 rounded-[2rem]">
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
      {(roadmap.phases || []).map((phase, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-10 rounded-[3rem] relative group"
        >
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
            <div className="max-w-xl">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4 block">Phase {i + 1}</span>
              <h3 className="text-3xl font-black text-white mb-4">{phase.title}</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">{phase.description}</p>
              
              <div className="flex flex-wrap gap-3">
                {(phase.skills || []).map((skill, j) => (
                  <span key={j} className="px-4 py-2 bg-white/5 rounded-full text-xs font-bold text-slate-300 border border-white/5">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(phase.tasks || []).map((task, j) => (
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
      {(!roadmap.phases || roadmap.phases.length === 0) && (
        <div className="text-center py-20 glass-card rounded-[3rem]">
          <p className="text-slate-500">No phases generated yet. Try updating your profile.</p>
        </div>
      )}
    </div>
  );

  const renderTasks = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="space-y-8">
        <div className="flex items-center gap-3 font-black text-white mb-4 uppercase tracking-widest text-xs">
          <Calendar size={18} className="text-indigo-400" />
          Daily Rituals
        </div>
        {(roadmap.actionPlan?.daily || []).map((task, i) => (
          <div key={i} className="p-8 glass-card rounded-[2.5rem] space-y-4 relative overflow-hidden group">
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
        {(roadmap.actionPlan?.weekly || []).map((task, i) => (
          <div key={i} className="p-8 glass-card rounded-[2.5rem] space-y-4 relative overflow-hidden group">
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
        {(roadmap.actionPlan?.monthly || []).map((task, i) => (
          <div key={i} className="p-8 glass-card rounded-[2.5rem] space-y-4 relative overflow-hidden group">
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

  const renderStrategy = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {roadmap.resumeGuidance && (
        <section className="glass-card p-8 rounded-[3rem] border-indigo-500/20">
          <div className="flex items-center gap-3 mb-6 text-indigo-400 font-bold uppercase tracking-widest text-xs">
            <Briefcase size={18} />
            Resume Guidance
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{roadmap.resumeGuidance}</p>
        </section>
      )}
      {roadmap.portfolioStrategy && (
        <section className="glass-card p-8 rounded-[3rem] border-purple-500/20">
          <div className="flex items-center gap-3 mb-6 text-purple-400 font-bold uppercase tracking-widest text-xs">
            <Globe size={18} />
            Portfolio Strategy
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{roadmap.portfolioStrategy}</p>
        </section>
      )}
      {roadmap.networkingStrategy && (
        <section className="glass-card p-8 rounded-[3rem] border-emerald-500/20">
          <div className="flex items-center gap-3 mb-6 text-emerald-400 font-bold uppercase tracking-widest text-xs">
            <User size={18} />
            Networking Strategy
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{roadmap.networkingStrategy}</p>
        </section>
      )}
      {roadmap.personalBranding && (
        <section className="glass-card p-8 rounded-[3rem] border-amber-500/20">
          <div className="flex items-center gap-3 mb-6 text-amber-400 font-bold uppercase tracking-widest text-xs">
            <Sparkles size={18} />
            Personal Branding
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{roadmap.personalBranding}</p>
        </section>
      )}
      {roadmap.incomeRoadmap && (
        <section className="glass-card p-8 rounded-[3rem] border-blue-500/20">
          <div className="flex items-center gap-3 mb-6 text-blue-400 font-bold uppercase tracking-widest text-xs">
            <TrendingUp size={18} />
            Income Roadmap
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{roadmap.incomeRoadmap}</p>
        </section>
      )}
      {isPremium && roadmap.interviewPrep && (
        <section className="glass-card p-8 rounded-[3rem] border-red-500/20">
          <div className="flex items-center gap-3 mb-6 text-red-400 font-bold uppercase tracking-widest text-xs">
            <Award size={18} />
            Interview Prep
          </div>
          <div className="space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed">{roadmap.interviewPrep.strategy}</p>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Questions</span>
              {(roadmap.interviewPrep.questions || []).map((q, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl text-xs text-slate-400 italic">"{q}"</div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );

  const [showConsultation, setShowConsultation] = React.useState(false);

  const renderProfileModal = () => (
    <AnimatePresence>
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProfileModalOpen(false)}
            className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl glass-card p-10 rounded-[3rem] relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-white">Edit Profile</h2>
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors"
              >
                <Lock size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col items-center gap-4 mb-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-white/5 border-2 border-white/10 flex items-center justify-center relative">
                    {editedProfile.avatar ? (
                      <img src={editedProfile.avatar} alt="Avatar Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={40} className="text-slate-600" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditedProfile({ ...editedProfile, avatar: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-white">Profile Picture</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Click to upload</div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Career Goal</label>
                <input
                  type="text"
                  value={editedProfile.careerGoal}
                  onChange={e => setEditedProfile({ ...editedProfile, careerGoal: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Level</label>
                  <select
                    value={editedProfile.level}
                    onChange={e => setEditedProfile({ ...editedProfile, level: e.target.value as any })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Timeline</label>
                  <select
                    value={editedProfile.timeline}
                    onChange={e => setEditedProfile({ ...editedProfile, timeline: e.target.value as any })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                  >
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Skills (comma separated)</label>
                <textarea
                  value={editedProfile.currentSkills}
                  onChange={e => setEditedProfile({ ...editedProfile, currentSkills: e.target.value })}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Education</label>
                <input
                  type="text"
                  value={editedProfile.education}
                  onChange={e => setEditedProfile({ ...editedProfile, education: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Daily Availability</label>
                  <input
                    type="text"
                    value={editedProfile.hoursPerDay}
                    onChange={e => setEditedProfile({ ...editedProfile, hoursPerDay: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Constraints</label>
                  <input
                    type="text"
                    value={editedProfile.constraints}
                    onChange={e => setEditedProfile({ ...editedProfile, constraints: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex gap-4">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onUpdateProfile(editedProfile);
                    setIsProfileModalOpen(false);
                  }}
                  className="flex-1 py-4 bg-indigo-500 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderHelpModal = () => (
    <AnimatePresence>
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsHelpModalOpen(false)}
            className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-xl glass-card p-10 rounded-[3rem] relative z-10 max-h-[80vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <HelpCircle size={24} />
                </div>
                <h2 className="text-3xl font-black text-white">Help & Support</h2>
              </div>
              <button 
                onClick={() => setIsHelpModalOpen(false)}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {[
                    { q: "How do I update my roadmap?", a: "You can update your roadmap by clicking 'Edit Profile' in the sidebar and changing your goals or skills. The AI will automatically regenerate your plan." },
                    { q: "Can I talk to a real human?", a: "Yes! You can book a 1-on-1 consultation with an industry expert through the 'Consultation' section on the landing page or dashboard." },
                    { q: "Is my data secure?", a: "Absolutely. We use industry-standard encryption and security protocols to ensure your career data and profile remain private." },
                    { q: "How does the AI Coach work?", a: "The AI Coach uses advanced language models to analyze your progress and provide real-time advice, interview prep, and strategy adjustments." }
                  ].map((faq, i) => (
                    <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5">
                      <div className="text-white font-bold mb-2">{faq.q}</div>
                      <div className="text-sm text-slate-400 leading-relaxed">{faq.a}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="pt-6 border-t border-white/5">
                <div className="p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 flex items-center justify-between gap-6">
                  <div>
                    <h4 className="text-white font-bold mb-1">Still need help?</h4>
                    <p className="text-xs text-slate-400">Our support team is available 24/7 to assist you.</p>
                  </div>
                  <button className="px-6 py-3 bg-indigo-500 text-white font-black rounded-xl text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/20">
                    Contact Support
                  </button>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderConsultation = () => (
    <div className="space-y-12">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <h2 className="text-4xl font-black text-white">1:1 Expert Consultation</h2>
        <p className="text-slate-400 max-w-2xl">Get personalized guidance from industry veterans. Book a session to accelerate your career growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Quick Sync', duration: '30 min', price: '₹999', desc: 'Laser-focused session for specific roadblocks or resume audits.', features: ['Career path review', 'Resume feedback', 'Q&A session'], color: 'indigo', upiId: 'ayanpal0698@okaxis' },
          { title: 'Deep Dive', duration: '60 min', price: '₹1,999', desc: 'Comprehensive strategy session to unlock your full potential.', features: ['Mock interview', 'Detailed roadmap review', 'Networking strategy', 'Portfolio audit'], color: 'purple', upiId: 'ayanpal0698@okaxis' },
          { title: 'Premium Package', duration: '3 Sessions', price: '₹4,999', desc: 'High-touch guidance for those aiming for the top 1% of their field.', features: ['End-to-end guidance', 'Placement support', 'Direct WhatsApp access', 'Priority booking'], color: 'emerald', upiId: 'ayanpal0698@okaxis' },
        ].map(pkg => (
          <div key={pkg.title} className="glass-card p-10 rounded-[3rem] border-white/5 group">
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
            <button 
              onClick={() => onBook(pkg)}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              pkg.color === 'indigo' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' :
              pkg.color === 'purple' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' :
              'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
            } hover:scale-105 active:scale-95`}>
              Book Now
            </button>

            {pkg.upiId && (
              <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pay via UPI</div>
                <div className="text-xs font-mono text-indigo-400 select-all cursor-pointer hover:text-indigo-300 transition-colors">
                  {pkg.upiId}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="glass-card p-12 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
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
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      {renderSidebar()}
      {renderProfileModal()}
      {renderHelpModal()}

      {/* Floating Help Button */}
      <button
        onClick={() => setIsHelpModalOpen(true)}
        className="fixed bottom-8 right-8 z-[60] p-4 bg-indigo-500 text-white rounded-2xl shadow-2xl shadow-indigo-500/40 hover:scale-110 active:scale-90 transition-all group"
      >
        <HelpCircle size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
          Need help?
        </span>
      </button>
      
      <main className="ml-72 p-12 max-w-7xl mx-auto relative z-10">
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
                {activeTab === 'strategy' && renderStrategy()}
                {activeTab === 'progress' && (
                  <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <BarChart3 size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-white">Analytics Coming Soon</h2>
                    <p className="text-slate-400 max-w-md">We're building a deep performance tracking system to help you visualize your career growth.</p>
                  </div>
                )}
                {activeTab === 'coach' && isPro && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 h-[calc(100vh-300px)]">
                    <div className="lg:col-span-2 flex flex-col glass-card rounded-[3rem] overflow-hidden border-indigo-500/20 relative">
                      {!isPremium && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-[#020617]/60 backdrop-blur-sm">
                          <div className="p-4 rounded-2xl bg-purple-500/20 text-purple-400 mb-6">
                            <Lock size={32} />
                          </div>
                          <h3 className="text-2xl font-black text-white mb-2">Premium Feature</h3>
                          <p className="text-slate-400 max-w-xs mb-8">The AI Coach Chat is fully unlocked for Premium users. Upgrade to get direct guidance.</p>
                          <button className="px-8 py-4 bg-purple-500 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-500/20">
                            Upgrade to Premium
                          </button>
                        </div>
                      )}
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
                      <section className="glass-card p-8 rounded-[3rem] border-purple-500/20 relative overflow-hidden">
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

                      <section className="glass-card p-8 rounded-[3rem] border-emerald-500/20">
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
