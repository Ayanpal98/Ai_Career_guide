export type SubscriptionPlan = 'Basic' | 'Pro' | 'Premium';

export interface UserProfile {
  plan: SubscriptionPlan;
  careerGoal: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  currentSkills: string;
  education: string;
  hoursPerDay: string;
  timeline: '3 months' | '6 months' | '1 year';
  constraints: string;
  avatar?: string;
}

export interface RoadmapPhase {
  title: string;
  description: string;
  skills: string[];
  tasks: string[];
  projects: string[];
  timeEstimate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface ExecutionTask {
  id: string;
  task: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeRequired: string;
  outcome: string;
  completed: boolean;
}

export interface ActionPlan {
  daily: ExecutionTask[];
  weekly: ExecutionTask[];
  monthly: ExecutionTask[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface CoachResponse {
  message: string;
  updatedRoadmap?: Partial<CareerRoadmap>;
}

export interface CareerRoadmap {
  plan: SubscriptionPlan;
  summary: string;
  skillGapAnalysis: string[];
  strengths: string[];
  phases: RoadmapPhase[];
  actionPlan: ActionPlan;
  resources: { title: string; link: string; type: string }[];
  realityCheck: string;
  nextStep: string;
  projects?: string[];
  // Premium features
  resumeGuidance?: string;
  portfolioStrategy?: string;
  networkingStrategy?: string;
  interviewPrep?: { questions: string[]; strategy: string };
  personalBranding?: string;
  incomeRoadmap?: string;
  accountabilityPrompts?: string[];
}

export interface ConsultationPackage {
  title: string;
  price: string;
  duration: string;
  desc: string;
  features: string[];
  color: string;
  popular?: boolean;
  upiId?: string;
}
