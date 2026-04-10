import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Hero3D() {
  console.log('Hero3D: Rendering Placeholder...');
  return (
    <div className="w-full h-[500px] flex items-center justify-center bg-indigo-500/5 rounded-[3rem] border border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full animate-pulse" />
      <div className="relative z-10 text-indigo-400">
        <Sparkles size={120} className="animate-bounce-slow" />
      </div>
    </div>
  );
}
