import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Briefcase, 
  Target, 
  Clock, 
  GraduationCap, 
  Wrench, 
  ShieldAlert,
  Building2,
  Globe,
  IndianRupee,
  Camera,
  ArrowLeft,
  Save,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfilePageProps {
  profile: UserProfile;
  onUpdate: (updated: UserProfile) => void;
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onUpdate, onBack }) => {
  const [editedProfile, setEditedProfile] = React.useState<UserProfile>(profile);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSavedToast, setShowSavedToast] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onUpdate(editedProfile);
    setIsSaving(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile({ ...editedProfile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
    { id: 'career', label: 'Career Goals', icon: <Target size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <Globe size={18} /> },
    { id: 'skills', label: 'Skills & Education', icon: <GraduationCap size={18} /> },
  ];

  const [activeSection, setActiveSection] = React.useState('personal');

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="p-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <ArrowLeft size={20} className="text-gray-600 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-gray-900">{profile.fullName || 'User Profile'}</h1>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Manage your identity & career path</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:scale-100"
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Save size={20} />
              </motion.div>
            ) : (
              <Save size={20} />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeSection === section.id 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
              {activeSection === 'personal' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-10"
                >
                  <div className="flex items-center gap-8">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-gray-50 border-2 border-gray-100 flex items-center justify-center relative">
                        {editedProfile.avatar ? (
                          <img src={editedProfile.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User size={48} className="text-gray-300" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera size={28} className="text-white" />
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-black mb-2 text-gray-900">Profile Picture</h3>
                      <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                        Upload a professional photo to personalize your dashboard and reports.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <User size={14} /> Full Name
                      </label>
                      <input
                        type="text"
                        value={editedProfile.fullName || ''}
                        onChange={e => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Mail size={14} /> Email Address
                      </label>
                      <input
                        type="email"
                        value={editedProfile.email || ''}
                        onChange={e => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'career' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Briefcase size={14} /> Primary Career Goal
                    </label>
                    <input
                      type="text"
                      value={editedProfile.careerGoal}
                      onChange={e => setEditedProfile({ ...editedProfile, careerGoal: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Target size={14} /> Current Level
                      </label>
                      <select
                        value={editedProfile.level}
                        onChange={e => setEditedProfile({ ...editedProfile, level: e.target.value as any })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={14} /> Target Timeline
                      </label>
                      <select
                        value={editedProfile.timeline}
                        onChange={e => setEditedProfile({ ...editedProfile, timeline: e.target.value as any })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                      >
                        <option value="3 months">3 months</option>
                        <option value="6 months">6 months</option>
                        <option value="1 year">1 year</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={14} /> Daily Availability
                      </label>
                      <input
                        type="text"
                        value={editedProfile.hoursPerDay}
                        onChange={e => setEditedProfile({ ...editedProfile, hoursPerDay: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <ShieldAlert size={14} /> Constraints
                      </label>
                      <input
                        type="text"
                        value={editedProfile.constraints}
                        onChange={e => setEditedProfile({ ...editedProfile, constraints: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'preferences' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Building2 size={14} /> Target Industry
                    </label>
                    <input
                      type="text"
                      value={editedProfile.targetIndustry || ''}
                      onChange={e => setEditedProfile({ ...editedProfile, targetIndustry: e.target.value })}
                      placeholder="e.g. FinTech, Healthcare, E-commerce"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Globe size={14} /> Work Style
                      </label>
                      <select
                        value={editedProfile.workStyle || 'Remote'}
                        onChange={e => setEditedProfile({ ...editedProfile, workStyle: e.target.value as any })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                      >
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Office">In-Office</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <IndianRupee size={14} /> Salary Expectation (Annual)
                      </label>
                      <input
                        type="text"
                        value={editedProfile.salaryExpectation || ''}
                        onChange={e => setEditedProfile({ ...editedProfile, salaryExpectation: e.target.value })}
                        placeholder="e.g. ₹12,00,000 - ₹15,00,000"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'skills' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Wrench size={14} /> Current Skills (comma separated)
                    </label>
                    <textarea
                      value={editedProfile.currentSkills}
                      onChange={e => setEditedProfile({ ...editedProfile, currentSkills: e.target.value })}
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <GraduationCap size={14} /> Highest Education
                    </label>
                    <input
                      type="text"
                      value={editedProfile.education}
                      onChange={e => setEditedProfile({ ...editedProfile, education: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="mt-20 text-center">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.5em]">
            Built BY ATSFY Technologies
          </p>
        </div>
      </div>

      {/* Saved Toast */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-2xl shadow-emerald-500/20"
          >
            <CheckCircle2 size={20} />
            Profile Updated Successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
