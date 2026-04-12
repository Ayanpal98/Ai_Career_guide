import React from 'react';
import {
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

const data = [
  { subject: 'Technical', A: 120, fullMark: 150 },
  { subject: 'Soft Skills', A: 98, fullMark: 150 },
  { subject: 'Leadership', A: 86, fullMark: 150 },
  { subject: 'Strategy', A: 99, fullMark: 150 },
  { subject: 'Innovation', A: 85, fullMark: 150 },
  { subject: 'Market Knowledge', A: 65, fullMark: 150 },
];

export default function SkillsRadar() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="#F27D26"
            fill="#F27D26"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
