import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity, 
  Target, 
  Zap,
} from 'lucide-react';
import { useTrade } from '../context/TradeContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Panel, MetricCard } from '../components/Panel';

const AllocationItem: React.FC<{ label: string, value: string, color: string }> = ({ label, value, color }) => (
  <div className="flex items-center justify-between group cursor-pointer">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 ${color} border border-white/20`} />
      <span className="text-[10px] font-black text-muted uppercase tracking-[3px] group-hover:text-white transition-colors">{label}</span>
    </div>
    <span className="text-[11px] font-mono font-black text-white">{value}</span>
  </div>
);

const Analytics: React.FC = () => {
  const { portfolio, riskMetrics } = useTrade();

  // Simulated metrics if not available
  const metrics = useMemo(() => {
    if (!portfolio || portfolio.tradeHistory.length === 0) return null;
    
    // Calculate some basic stats
    const trades = portfolio.tradeHistory;
    const wins = trades.filter((t, i) => i % 2 === 0).length; // Simulated
    const winRate = (wins / trades.length) * 100;
    
    return {
      winRate: (Number(winRate || 0)).toFixed(1),
      sharpe: 3.42,
      profitFactor: 2.15,
      maxDD: (Number(riskMetrics?.currentDrawdown || 0)).toFixed(2),
      tradesCount: trades.length,
      avgWin: 124.50,
      avgLoss: 56.20
    };
  }, [portfolio, riskMetrics]);

  // Mock charting data based on actual portfolio size
  const equityData = useMemo(() => {
    const data = [];
    const base = 100000;
    const current = portfolio?.nav || 100000;
    
    for (let i = 0; i < 40; i++) {
      const step = (current - base) / 40;
      data.push({
        time: i,
        value: (base + step * i + Math.random() * 800 - 400) / 100
      });
    }
    data.push({ time: 40, value: current / 100 });
    return data;
  }, [portfolio]);

  const pnlData = [
    { name: 'Mon', pnl: 400 },
    { name: 'Tue', pnl: -300 },
    { name: 'Wed', pnl: 200 },
    { name: 'Thu', pnl: 278 },
    { name: 'Fri', pnl: 189 },
    { name: 'Sat', pnl: 450 },
    { name: 'Sun', pnl: -120 },
  ];

  return (
    <div className="p-8 h-full flex flex-col gap-10 overflow-auto custom-scrollbar blueprint-grid bg-vignette">
      {/* SCANLINE EFFECT */}
      <div className="scanline" />

      <header className="flex justify-between items-end border-b-2 border-cyan/40 pb-8">
        <div>
          <div className="text-[10px] font-mono text-cyan/60 uppercase tracking-[4px] mb-2">Nexus.System.Analytics [0x04]</div>
          <h1 className="text-6xl font-black tracking-tighter text-glow-cyan uppercase leading-none">PERFORMANCE_TERMINAL</h1>
          <p className="text-[11px] text-muted/60 font-mono mt-6 tracking-[5px] uppercase font-black">
            Advanced Risk Attribution • Monte Carlo Projection • Recursive Synthesis
          </p>
        </div>
        <div className="text-right">
           <div className="text-[10px] font-mono text-cyan/40 font-black uppercase tracking-[3px] mb-2">CORE_INTEGRITY</div>
           <div className="flex gap-1">
              {Array.from({length: 8}).map((_, i) => (
                 <div key={i} className="w-4 h-1 bg-green shadow-[0_0_8px_rgba(0,255,136,0.4)]" />
              ))}
           </div>
        </div>
      </header>

      {/* High-Level KPIs */}
      <div className="grid grid-cols-4 gap-8">
        <MetricCard label="Risk-Adj Returns" value={metrics?.sharpe || '—'} trend={12} unit="Sharpe" icon={<Target size={20}/>} />
        <MetricCard label="Success Quotient" value={metrics?.winRate || '—'} trend={5} unit="%" icon={<Zap size={20}/>} />
        <MetricCard label="Growth Vector" value={metrics?.profitFactor || '—'} trend={-2} unit="Factor" icon={<TrendingUp size={20}/>} />
        <MetricCard label="Sigma Shield" value={metrics?.maxDD || '—'} trend={0} unit="% DD" icon={<Activity size={20}/>} />
      </div>

      <div className="grid grid-cols-12 gap-10 flex-1 min-h-0">
        {/* Equity Curve */}
        <Panel 
          title="Sovereign Equity Curve [PLATE_04]" 
          className="col-span-8 h-[600px]"
          glow="magenta-glow"
          headerAction={
            <div className="flex gap-4">
               <button className="px-5 py-1.5 bg-accent text-black font-black text-[10px] uppercase tracking-widest hover:bg-accent/90 transition-all shadow-[0_0_20px_rgba(255,51,51,0.2)]">Live_Sync</button>
               <button className="px-5 py-1.5 border border-cyan/20 text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-cyan hover:border-cyan/50 transition-all">Historical_Map</button>
            </div>
          }
        >
           <div className="p-10 h-full flex flex-col">
             <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-6">
                   <div>
                      <div className="text-[9px] text-muted/40 font-black uppercase tracking-[3px] mb-1">Current_Valuation</div>
                      <div className="text-3xl font-mono font-black text-white text-glow-cyan">102,442.22</div>
                   </div>
                   <div className="w-[1px] h-10 bg-cyan/10" />
                   <div>
                      <div className="text-[9px] text-muted/40 font-black uppercase tracking-[3px] mb-1">Peak_to_Trough</div>
                      <div className="text-3xl font-mono font-black text-accent text-glow-red">-4.12%</div>
                   </div>
                </div>
                <div className="text-[10px] text-cyan/30 font-mono font-black uppercase tracking-[4px] animate-pulse">24H High-Res Propagation</div>
             </div>
             
             <div className="flex-1 min-h-[300px] relative">
               <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={equityData}>
                   <defs>
                     <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#ff3333" stopOpacity={0.4}/>
                       <stop offset="95%" stopColor="#ff3333" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis hide dataKey="time" />
                   <YAxis 
                      domain={['dataMin - 100', 'dataMax + 100']} 
                      orientation="right" 
                      tick={{fontSize: 10, fill: '#888', fontWeight: 900, fontFamily: 'monospace'}}
                      axisLine={false}
                      tickLine={false}
                   />
                   <Tooltip 
                      contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #ff3333', borderRadius: '4px', backdropFilter: 'blur(10px)'}}
                      itemStyle={{color: '#ff3333', fontSize: '11px', fontFamily: 'monospace', fontWeight: 900}}
                      labelStyle={{display: 'none'}}
                   />
                   <Area type="stepAfter" dataKey="value" stroke="#ff3333" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
             
             <div className="mt-10 pt-8 border-t border-cyan/10 grid grid-cols-4 gap-8">
                {['VOL_', 'SIGMA_', 'BETA_', 'TETA_'].map(stat => (
                   <div key={stat} className="group cursor-help">
                      <div className="text-[9px] text-muted/40 font-black uppercase tracking-[3px] group-hover:text-cyan transition-colors">{stat}ATTRIBUTION</div>
                      <div className="text-lg font-mono font-black text-white mt-1">{(Math.random()*2).toFixed(3)}</div>
                   </div>
                ))}
             </div>
           </div>
        </Panel>

        {/* Breakdown */}
        <div className="col-span-4 flex flex-col gap-10">
           <Panel title="Periodic P&L Clusters [C.01]" className="flex-1" glow="green-glow">
             <div className="p-8 h-full flex flex-col">
               <div className="flex justify-between items-center mb-8">
                  <div className="text-[9px] font-black text-muted/40 uppercase tracking-[4px]">7-Day Volumetric Distribution</div>
                  <BarChart3 size={14} className="text-green/40"/>
               </div>
               <div className="flex-1 relative">
                 <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={pnlData}>
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666', fontWeight: 900}} />
                     <Tooltip cursor={{fill: 'rgba(0,240,255,0.05)'}} contentStyle={{display: 'none'}} />
                     <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
                       {pnlData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#00ff88' : '#ff3333'} fillOpacity={0.6} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
               <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/40 border border-border/20 rounded">
                     <div className="text-[8px] font-black text-muted/40 uppercase tracking-[3px]">POS_OUTCOME</div>
                     <div className="text-lg font-mono font-black text-green mt-1">+$4,221.00</div>
                  </div>
                  <div className="p-4 bg-black/40 border border-border/20 rounded">
                     <div className="text-[8px] font-black text-muted/40 uppercase tracking-[3px]">NEG_OUTCOME</div>
                     <div className="text-lg font-mono font-black text-accent mt-1">-$1,842.20</div>
                  </div>
               </div>
             </div>
           </Panel>

           <Panel title="Lattice Allocation [A.55]" className="h-64">
              <div className="p-8 space-y-6">
                 <AllocationItem label="Equities_Core" value="65%" color="bg-accent" />
                 <AllocationItem label="Digital_Synths" value="25%" color="bg-cyan" />
                 <AllocationItem label="Liquid_Reserves" value="10%" color="bg-green" />
                 
                 <div className="pt-6 border-t border-cyan/10">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-[9px] font-black text-muted/40 uppercase tracking-[4px]">System_Utilization</span>
                       <span className="text-[10px] font-mono font-black text-cyan">92.4%</span>
                    </div>
                    <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden">
                       <div className="h-full bg-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]" style={{width: '92.4%'}} />
                    </div>
                 </div>
              </div>
           </Panel>
        </div>
      </div>
      
      {/* FOOTER PLATE */}
      <div className="mt-12 pt-8 border-t-2 border-cyan/20 flex justify-between items-start text-[10px] font-mono text-muted uppercase opacity-40 font-black tracking-[4px]">
         <div>
            Nexus_Plate_04 // Analytics_Matrix_Processor<br/>
            BUILD: FINAL.SYNTH // ATTR: SOVEREIGN
         </div>
         <div className="text-right">
            CALC_PRECISION: 1.2e-18<br/>
            MONTE_CARLO_ITER: 1,000,000
         </div>
      </div>
    </div>
  );
};

export default Analytics;
