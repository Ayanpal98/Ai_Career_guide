import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerRoadmap, SubscriptionPlan, UserProfile, ChatMessage, ConsultationPackage } from '../types';
import { chatWithCoach } from '../services/gemini';
import SkillsRadar from './SkillsRadar';
import { 
  LayoutDashboard, Map as MapIcon, ListTodo, BarChart3, MessageSquare, Settings, 
  CheckCircle2, Circle, ChevronRight, Lock, Sparkles, Zap, Award, Target, TrendingUp,
  AlertTriangle, Calendar, ExternalLink, ArrowUpRight, Play, Clock, Send, Loader2, User,
  Briefcase, Globe, Camera, HelpCircle, X, LogOut, Info, Newspaper, LineChart, ArrowRight
} from 'lucide-react';

interface DashboardProps {
  roadmap: CareerRoadmap;
  profile: UserProfile;
  onUpdateRoadmap: (updated: Partial<CareerRoadmap>) => void;
  onUpdateProfile: (updated: UserProfile) => void;
  onBackToLanding: () => void;
  onEditProfile: () => void;
  onBook: (pkg: ConsultationPackage) => void;
  onSignOut: () => void;
}

console.log('Dashboard.tsx: Module evaluating...');

export default function Dashboard({ 
  roadmap, 
  profile, 
  onUpdateRoadmap, 
  onUpdateProfile, 
  onBackToLanding, 
  onEditProfile, 
  onBook,
  onSignOut
}: DashboardProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'roadmap' | 'tasks' | 'progress' | 'coach' | 'strategy'>('overview');
  const [completedTasks, setCompletedTasks] = React.useState<Record<string, boolean>>({});
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false);

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
      <div className="flex items-center gap-3 text-white font-black text-2xl tracking-tighter mb-4 font-display uppercase">
        <div className="p-2 rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
          <Zap size={24} />
        </div>
        Career Path
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
          <div className="text-sm font-black text-white truncate">{profile.fullName || 'User Profile'}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{profile.email || profile.level}</div>
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
          onClick={onEditProfile}
          className="flex items-center gap-4 px-5 py-3 rounded-2xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
        >
          <Settings size={20} />
          <span className="text-sm">Edit Profile</span>
        </button>
        <button
          onClick={onSignOut}
          className="flex items-center gap-4 px-5 py-3 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-sm">Sign Out</span>
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
              UPI: <span className="text-white select-all cursor-pointer">8798610548@ybl</span>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 text-[8px] font-bold text-white/40 text-center uppercase tracking-widest">
              Built BY ATSFY Technologies
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderHeader = () => (
    <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-[0.3em]">
          <div className="w-8 h-[1px] bg-indigo-500" />
          Executive Dashboard
        </div>
        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.85] font-serif italic text-3d">
          Welcome back, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 not-italic">
            {profile.fullName?.split(' ')[0] || 'Architect'}
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">{roadmap.summary}</p>
      </div>
      
      <div className="glass-card p-8 rounded-[2.5rem] min-w-[320px] relative overflow-hidden border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">System Velocity</span>
          <span className="text-3xl font-black text-white">{progress}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
            <TrendingUp size={14} />
            <span>Optimal Growth</span>
          </div>
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            {roadmap.plan} Tier
          </div>
        </div>
      </div>
    </header>
  );

  const renderOverview = () => (
    <div className="space-y-10">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Overall Progress', value: `${progress}%`, icon: TrendingUp, color: 'indigo' },
          { label: 'Tasks Completed', value: `${Object.values(completedTasks).filter(Boolean).length}/${roadmap.phases.reduce((acc, p) => acc + p.tasks.length, 0)}`, icon: CheckCircle2, color: 'emerald' },
          { label: 'Market Demand', value: 'High', icon: LineChart, color: 'amber' },
          { label: 'Current Level', value: profile.level, icon: Award, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[2rem] border-white/5 group transition-all bg-white/[0.01] relative overflow-hidden card-3d">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity depth-2">
              <stat.icon size={64} />
            </div>
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-6 depth-2`}>
              <stat.icon className={`text-${stat.color}-400`} size={20} />
            </div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 font-mono depth-1">{stat.label}</div>
            <div className="text-4xl font-black text-white font-mono tracking-tighter depth-1">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Roadmap Preview */}
        <div className="lg:col-span-8 space-y-10">
          <div className="glass-card p-10 rounded-[3rem] border-white/5 relative overflow-hidden bg-white/[0.01] card-3d">
            <div className="absolute top-0 right-0 p-12 opacity-5 depth-3">
              <MapIcon size={200} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div className="depth-1">
                  <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Roadmap Velocity</h3>
                  <p className="text-slate-400 text-lg font-medium">You are currently on track to reach your goal in {profile.timeline}.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('roadmap')}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 depth-2"
                >
                  <ArrowUpRight size={24} />
                </button>
              </div>
              
              <div className="space-y-6 depth-1">
                {roadmap.phases.slice(0, 2).map((phase, i) => (
                  <div key={i} className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 flex items-center gap-8 group hover:bg-white/[0.05] transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0 font-black text-2xl text-indigo-400">
                      0{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xl text-white font-black mb-2 truncate">{phase.title}</div>
                      <div className="text-sm text-slate-500 font-bold uppercase tracking-widest">{phase.tasks.length} strategic milestones</div>
                    </div>
                    <div className="hidden md:block w-40 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '40%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-amber-500/20">
                  <Newspaper className="text-amber-400" size={24} />
                </div>
                <h4 className="text-xl font-black text-white tracking-tight">Market Intelligence</h4>
              </div>
              <div className="space-y-6">
                {[
                  'Demand for React experts is up 12% this quarter.',
                  'AI integration skills are now a top priority for recruiters.',
                  'Remote roles in your target industry have stabilized.'
                ].map((insight, i) => (
                  <div key={i} className="flex gap-4 text-slate-400 leading-relaxed font-medium">
                    <div className="mt-2 w-2 h-2 rounded-full bg-amber-500 shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                    {insight}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-purple-500/20">
                  <Info className="text-purple-400" size={24} />
                </div>
                <h4 className="text-xl font-black text-white tracking-tight">Next Milestone</h4>
              </div>
              <div className="p-8 rounded-[2rem] bg-purple-500/10 border border-purple-500/20 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Target size={100} />
                </div>
                <div className="relative z-10">
                  <div className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-4">Priority Execution</div>
                  <div className="text-2xl font-black text-white mb-8 leading-tight">{roadmap.phases[0].tasks[0]}</div>
                  <button 
                    onClick={() => setActiveTab('tasks')}
                    className="w-full py-5 bg-purple-500 text-white font-black rounded-2xl text-sm hover:scale-105 transition-all shadow-xl shadow-purple-500/20"
                  >
                    Execute Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Radar & Profile Stats */}
        <div className="lg:col-span-4 space-y-10">
          <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-white/[0.01]">
            <h4 className="text-xl font-black text-white mb-8 tracking-tight">Skills Architecture</h4>
            <div className="py-4">
              <SkillsRadar />
            </div>
            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-white">84</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Skill Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-indigo-400">+12%</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Growth</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 opacity-5 group-hover:scale-110 transition-transform">
              <MessageSquare size={160} />
            </div>
            <div className="relative z-10">
              <h4 className="text-xl font-black text-white mb-4 tracking-tight">AI Coach Tip</h4>
              <p className="text-slate-400 leading-relaxed mb-8 font-medium">
                "Based on your progress, I recommend focusing on the 'System Design' module next. It's a key requirement for the roles you're targeting."
              </p>
              <button 
                onClick={() => setActiveTab('coach')}
                className="flex items-center gap-3 text-indigo-400 font-black text-sm hover:gap-5 transition-all uppercase tracking-widest"
              >
                Ask Coach <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
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
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] font-mono">Phase {i + 1}</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              <h3 className="text-4xl font-black text-white mb-6 tracking-tighter font-display uppercase italic">{phase.title}</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 font-serif opacity-80 italic">"{phase.description}"</p>
              
              <div className="flex flex-wrap gap-2">
                {(phase.skills || []).map((skill, j) => (
                  <span key={j} className="px-3 py-1.5 bg-white/5 rounded-lg text-[10px] font-black text-slate-400 border border-white/5 uppercase tracking-widest font-mono">
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
        <div className="flex items-center gap-3 font-black text-white mb-6 uppercase tracking-[0.4em] text-[10px] font-mono">
          <Calendar size={16} className="text-indigo-400" />
          Daily Rituals
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>
        {(roadmap.actionPlan?.daily || []).map((task, i) => (
          <div key={i} className="p-8 glass-card rounded-[2.5rem] space-y-4 relative overflow-hidden group border-white/5 hover:border-indigo-500/20">
            <div className={`absolute top-0 right-0 px-4 py-1 text-[9px] font-black uppercase tracking-widest rounded-bl-xl font-mono ${
              task.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 
              task.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {task.difficulty}
            </div>
            <h4 className="text-xl font-black text-white leading-tight tracking-tight">{task.task}</h4>
            <div className="flex items-center gap-4 text-[10px] text-slate-500 font-black uppercase tracking-widest font-mono">
              <span className="flex items-center gap-1.5"><Clock size={12} /> {task.timeRequired}</span>
              <span className="flex items-center gap-1.5"><Target size={12} /> {task.outcome}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-3 font-black text-white mb-6 uppercase tracking-[0.4em] text-[10px] font-mono">
          <TrendingUp size={16} className="text-purple-400" />
          Weekly Sprints
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>
        {(roadmap.actionPlan?.weekly || []).map((task, i) => (
          <div key={i} className="p-8 glass-card rounded-[2.5rem] space-y-4 relative overflow-hidden group border-white/5 hover:border-purple-500/20">
            <div className={`absolute top-0 right-0 px-4 py-1 text-[9px] font-black uppercase tracking-widest rounded-bl-xl font-mono ${
              task.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 
              task.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {task.difficulty}
            </div>
            <h4 className="text-xl font-black text-white leading-tight tracking-tight">{task.task}</h4>
            <div className="flex items-center gap-4 text-[10px] text-slate-500 font-black uppercase tracking-widest font-mono">
              <span className="flex items-center gap-1.5"><Clock size={12} /> {task.timeRequired}</span>
              <span className="flex items-center gap-1.5"><Target size={12} /> {task.outcome}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-3 font-black text-white mb-6 uppercase tracking-[0.4em] text-[10px] font-mono">
          <Award size={16} className="text-amber-400" />
          Monthly Milestones
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>
        {(roadmap.actionPlan?.monthly || []).map((task, i) => (
          <div key={i} className="p-8 glass-card rounded-[2.5rem] space-y-4 relative overflow-hidden group border-white/5 hover:border-amber-500/20">
            <div className={`absolute top-0 right-0 px-4 py-1 text-[9px] font-black uppercase tracking-widest rounded-bl-xl font-mono ${
              task.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 
              task.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {task.difficulty}
            </div>
            <h4 className="text-xl font-black text-white leading-tight tracking-tight">{task.task}</h4>
            <div className="flex items-center gap-4 text-[10px] text-slate-500 font-black uppercase tracking-widest font-mono">
              <span className="flex items-center gap-1.5"><Clock size={12} /> {task.timeRequired}</span>
              <span className="flex items-center gap-1.5"><Target size={12} /> {task.outcome}</span>
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
          { title: 'Quick Sync', duration: '30 min', price: '₹999', desc: 'Laser-focused session for specific roadblocks or resume audits.', features: ['Career path review', 'Resume feedback', 'Q&A session'], color: 'indigo', upiId: '8798610548@ybl' },
          { title: 'Deep Dive', duration: '60 min', price: '₹1,999', desc: 'Comprehensive strategy session to unlock your full potential.', features: ['Mock interview', 'Detailed roadmap review', 'Networking strategy', 'Portfolio audit'], color: 'purple', upiId: '8798610548@ybl' },
          { title: 'Premium Package', duration: '3 Sessions', price: '₹4,999', desc: 'High-touch guidance for those aiming for the top 1% of their field.', features: ['End-to-end guidance', 'Placement support', 'Direct WhatsApp access', 'Priority booking'], color: 'emerald', upiId: '8798610548@ybl' },
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
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-[calc(100vh-300px)]">
                    <div className="lg:col-span-8 flex flex-col glass-card rounded-[3rem] overflow-hidden border-white/5 relative bg-white/[0.01]">
                      {!isPremium && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-center bg-[#020617]/80 backdrop-blur-md">
                          <div className="p-6 rounded-3xl bg-purple-500/20 text-purple-400 mb-8 border border-purple-500/30">
                            <Lock size={40} />
                          </div>
                          <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Premium Intelligence</h3>
                          <p className="text-slate-400 max-w-sm mb-10 text-lg font-medium leading-relaxed">The AI Coach Chat is fully unlocked for Premium users. Get direct, strategic guidance from our most advanced models.</p>
                          <button className="px-10 py-5 bg-purple-500 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-purple-500/30 uppercase tracking-widest text-sm">
                            Upgrade to Premium
                          </button>
                        </div>
                      )}
                      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20">
                            <Sparkles size={28} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-white tracking-tight">Career Architect AI</h3>
                            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                              Neural Engine Online
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            GPT-4o Optimized
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                        {messages.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40">
                            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                              <MessageSquare size={40} />
                            </div>
                            <div className="space-y-2">
                              <p className="text-white font-black text-xl">System Initialized</p>
                              <p className="text-slate-400 max-w-xs font-medium">Ask me anything about your roadmap, skill gaps, or long-term career strategy.</p>
                            </div>
                          </div>
                        )}
                        {messages.map((msg, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex gap-5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                              <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-xl ${
                                msg.role === 'user' ? 'bg-slate-800 text-slate-400 border border-white/5' : 'bg-indigo-500 text-white'
                              }`}>
                                {msg.role === 'user' ? <User size={24} /> : <Sparkles size={24} />}
                              </div>
                              <div className={`p-6 rounded-3xl text-base leading-relaxed font-medium shadow-2xl ${
                                msg.role === 'user' 
                                  ? 'bg-white/5 text-slate-200 rounded-tr-none border border-white/5' 
                                  : 'bg-indigo-500/10 text-slate-200 border border-indigo-500/20 rounded-tl-none'
                              }`}>
                                {msg.text}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="flex gap-5 max-w-[85%]">
                              <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-xl">
                                <Loader2 size={24} className="animate-spin" />
                              </div>
                              <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 rounded-tl-none">
                                <div className="flex gap-1.5">
                                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      <form onSubmit={handleSendMessage} className="p-10 bg-white/[0.02] border-t border-white/5">
                        <div className="relative group">
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

                    <div className="lg:col-span-4 space-y-10">
                      <section className="glass-card p-10 rounded-[3rem] border-purple-500/20 relative overflow-hidden bg-white/[0.01]">
                        <div className="absolute -right-8 -top-8 opacity-5">
                          <Award size={160} />
                        </div>
                        <h4 className="text-xl font-black text-white mb-8 flex items-center gap-4 tracking-tight">
                          <div className="p-2 rounded-xl bg-purple-500/20">
                            <Award size={24} className="text-purple-400" />
                          </div>
                          Strategic Prep
                        </h4>
                        <p className="text-slate-400 text-base leading-relaxed mb-8 font-medium">{roadmap.interviewPrep?.strategy}</p>
                        <div className="space-y-4">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">High-Probability Questions</div>
                          {roadmap.interviewPrep?.questions.slice(0, 2).map((q, i) => (
                            <div key={i} className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 text-slate-300 italic text-sm leading-relaxed relative group hover:border-purple-500/30 transition-all">
                              <Sparkles size={14} className="absolute -top-2 -right-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              "{q}"
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="glass-card p-10 rounded-[3rem] border-emerald-500/20 bg-white/[0.01]">
                        <h4 className="text-xl font-black text-white mb-8 flex items-center gap-4 tracking-tight">
                          <div className="p-2 rounded-xl bg-emerald-500/20">
                            <Target size={24} className="text-emerald-400" />
                          </div>
                          Real-time Sync
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                          Your Career Architect AI monitors your inputs and adjusts your roadmap in real-time. 
                          Mention any new constraints or achievements to trigger a system-wide recalibration.
                        </p>
                        <div className="mt-8 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active Monitoring</span>
                        </div>
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
