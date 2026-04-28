import React from 'react';
import { Panel } from '../components/Panel';
import { 
  TrendingUp, 
  Globe, 
  BarChart, 
  Share2, 
  Tv, 
  Youtube, 
  MessageSquare
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart as ReBarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

const ecosystemData = [
  { name: 'TV', value: 45 },
  { name: 'TikTok', value: 30 },
  { name: 'YouTube', value: 15 },
  { name: 'Other', value: 10 },
];

const trajectoryData = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  momentum: 50 + Math.sin(i * 0.5) * 20 + Math.random() * 5,
  volatility: 30 + Math.cos(i * 0.8) * 10
}));

const Markets: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-auto">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-4xl font-black tracking-tighter uppercase mb-1">Global Markets</h1>
           <p className="text-[10px] text-muted font-mono uppercase tracking-[2px]">Real-time trajectory & Ecosystem Dispersion</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 h-[400px]">
        {/* Global Trajectory */}
        <Panel title="Global Trajectory" className="col-span-8" glow="cyan-glow">
           <div className="p-6 h-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={trajectoryData}>
                    <defs>
                       <linearGradient id="colorMom" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <XAxis hide />
                    <YAxis hide />
                    <Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #333'}} />
                    <Area type="monotone" dataKey="momentum" stroke="#00f0ff" strokeWidth={3} fill="url(#colorMom)" />
                    <Area type="monotone" dataKey="volatility" stroke="#ff00ff" strokeWidth={1} strokeDasharray="5 5" fill="none" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </Panel>

        {/* Ecosystem Share */}
        <Panel title="Platform Ecosystem" className="col-span-4" glow="lattice-glow">
           <div className="p-6 h-full flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                 <PieChart>
                    <Pie
                       data={ecosystemData}
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                    >
                       {ecosystemData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00f0ff' : '#ff00ff'} />
                       ))}
                    </Pie>
                 </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 w-full space-y-2">
                 {ecosystemData.map((d, i) => (
                   <div key={d.name} className="flex justify-between text-[11px] font-mono border-b border-white/5 pb-1">
                      <span className="text-muted">{d.name} Shares</span>
                      <span className="font-bold">{d.value}%</span>
                   </div>
                 ))}
              </div>
           </div>
        </Panel>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <MetricBox 
            title="TV Viewing Share" 
            value="34.8%" 
            diff="-2.4%" 
            icon={<Tv size={16} className="text-accent" />} 
            desc="Year-over-year linear television displacement" 
         />
         <MetricBox 
            title="TikTok Shop GMV" 
            value="1.2B" 
            diff="+15.2%" 
            icon={<MessageSquare size={16} className="text-cyan" />} 
            desc="Daily recurring commerce velocity (est.)" 
         />
         <MetricBox 
            title="Cord-Cutting Rate" 
            value="6.2M" 
            diff="+0.8%" 
            icon={<Youtube size={16} className="text-pink-500" />} 
            desc="Annual household transition to IP-exclusivity" 
         />
      </div>
    </div>
  );
};

const MetricBox: React.FC<{ title: string; value: string; diff: string; icon: React.ReactNode; desc: string }> = ({ title, value, diff, icon, desc }) => (
  <Panel title={title}>
     <div className="p-5">
        <div className="flex items-center justify-between mb-2">
           <div className="text-2xl font-black">{value}</div>
           <div className={`text-[10px] font-bold ${diff.startsWith('+') ? 'text-green' : 'text-accent'}`}>{diff}</div>
        </div>
        <div className="text-[10px] text-muted uppercase tracking-wider mb-4 h-8">{desc}</div>
        <div className="w-full h-1 bg-border/20 rounded-full overflow-hidden">
           <div className="h-full bg-cyan/40 w-2/3" />
        </div>
     </div>
  </Panel>
);

export default Markets;
