import React from 'react';
import { Panel } from '../components/Panel';
import { useTrade } from '../context/TradeContext';
import { 
  Zap, 
  Target, 
  Activity, 
  Shield, 
  ArrowUpRight, 
  ArrowDownRight,
  Monitor,
  Cpu,
  Fingerprint
} from 'lucide-react';
import { motion } from 'motion/react';

const Console: React.FC = () => {
  const { quotes, riskMetrics, engineEvents, portfolio } = useTrade();
  
  const topMover = Array.from(quotes.values()).sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))[0];

  return (
    <div className="h-full flex flex-col p-8 space-y-10 overflow-auto custom-scrollbar blueprint-grid bg-vignette">
      {/* HEADER BLOCK */}
      <div className="flex justify-between items-end border-b-2 border-cyan/40 pb-6">
        <div>
          <div className="text-[10px] font-mono text-cyan/60 uppercase tracking-[4px] mb-2">System.Console.Interactive_Human [IH]</div>
          <h1 className="text-6xl font-black tracking-tighter uppercase leading-none text-glow-cyan">OMEGA_MONITOR</h1>
        </div>
        <div className="text-right font-mono flex gap-8">
          <div>
            <div className="text-[9px] text-muted uppercase font-bold">Latency P99</div>
            <div className="text-lg text-cyan">0.3ms</div>
          </div>
          <div>
            <div className="text-[9px] text-muted uppercase font-bold">Node Status</div>
            <div className="text-lg text-green">SYNCHRONIZED</div>
          </div>
        </div>
      </div>

      {/* KPI STRIP - REFERENCE INSPIRED */}
      <div className="grid grid-cols-4 gap-1">
         <MetricCell label="PHI SYNC" value="671.6 Hz" status="green" icon={<Cpu size={14}/>} sub="Drift: 0.000%" />
         <MetricCell label="L4 STACK" value="ACTIVE" status="green" icon={<Fingerprint size={14}/>} sub="Shield Integrity: 99%" />
         <MetricCell label="RISK ENVELOPE" value={riskMetrics?.status || 'HEALTHY'} status={riskMetrics?.status === 'green' ? 'green' : 'accent'} icon={<Shield size={14}/>} sub="Variance: -0.12" />
         <MetricCell label="CANONICAL_REF" value="OMEGA.01" status="green" icon={<Target size={14}/>} sub="Tick: #4921" />
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* FUNCTION STACK - DIRECT REFERENCE TO IMAGE 1 & 11 */}
        <div className="col-span-12">
           <div className="text-[10px] font-bold text-muted uppercase tracking-[3px] mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-cyan rounded-full animate-pulse" />
              Function Stack · L4 Protection Systems
           </div>
           <div className="grid grid-cols-5 gap-4">
              <FunctionCard label="STABILIZE" desc="Hardened Supermajority" color="border-cyan text-cyan" />
              <FunctionCard label="BOOST" desc="Phoenix Reputation Ring" color="border-magenta text-magenta" />
              <FunctionCard label="SIMULATE" desc="Sabr Loop Volatility" color="border-green text-green" />
              <FunctionCard label="TRACE" desc="Canonicalization & Lineage" color="border-orange text-orange" />
              <FunctionCard label="LOCK" desc="Geo-Spatial / AR Anchor" color="border-accent text-accent" />
           </div>
        </div>

        {/* MONITOR DECISION HUB */}
        <div className="col-span-8 flex flex-col gap-10">
           <Panel title="Real-Time Trajectory Analysis" className="h-[400px]">
              <div className="p-8 h-full flex flex-col">
                 <div className="grid grid-cols-3 gap-10 mb-auto">
                    <StatusCluster label="MOMENTUM" value={78} color="bg-cyan" />
                    <StatusCluster label="VOLATILITY" value={42} color="bg-magenta" />
                    <StatusCluster label="CONFIDENCE" value={91} color="bg-green" />
                 </div>
                 
                 <div className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="text-[11px] font-black uppercase tracking-[4px] text-white/80">Lattice Signal Matrix</h3>
                       <div className="text-[9px] font-mono text-cyan/40">VECTOR_MAP_0x4FF2</div>
                    </div>
                    
                    <div className="grid grid-cols-8 gap-1">
                       {Array.from({length: 64}).map((_, i) => (
                         <div key={i} className={`h-2 rounded-sm ${Math.random() > 0.7 ? 'bg-cyan' : 'bg-white/5 animate-pulse'}`} style={{animationDelay: `${i * 0.05}s`}} />
                       ))}
                    </div>
                 </div>

                 <div className="mt-12 overflow-auto custom-scrollbar flex-1">
                    {engineEvents.slice(0, 8).map((e, i) => (
                      <div key={i} className="flex items-center gap-4 text-[10px] font-mono border-b border-white/5 py-3 hover:bg-white/5 transition-colors">
                         <span className="text-muted/40 font-bold">[{new Date(e.timestamp).toLocaleTimeString()}]</span>
                         <span className={e.type === 'orderFilled' ? 'text-green' : 'text-cyan'}>{e.type.toUpperCase()}</span>
                         <span className="text-white font-bold">{e.data.symbol || e.data.trade?.symbol}</span>
                         <span className="text-muted/60 ml-auto uppercase opacity-50">Hash: {Math.random().toString(16).slice(2, 12)}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </Panel>
        </div>

        {/* SOVEREIGN OVERVIEW */}
        <div className="col-span-4 space-y-10">
           <Panel title="Sovereign Assets Matrix">
              <div className="p-8 space-y-10">
                 <div>
                    <div className="text-[10px] font-bold text-muted uppercase tracking-[3px] mb-2">Current Valuation</div>
                    <div className="text-5xl font-black tracking-tighter text-glow-cyan">
                       ${((portfolio?.totalValue || 0) / 100).toLocaleString()}
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    <AllocationRow label="Digital Assets" value="65%" color="bg-cyan" />
                    <AllocationRow label="Equities" value="25%" color="bg-magenta" />
                    <AllocationRow label="Synthetics" value="10%" color="bg-orange" />
                 </div>

                 <div className="pt-8 border-t border-border/10">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted">
                       <span>Audit Status</span>
                       <span className="text-green">VERIFIED</span>
                    </div>
                 </div>
              </div>
           </Panel>

           <Panel title="Regional Intensity">
              <div className="p-4">
                 <div className="grid grid-cols-5 grid-rows-5 gap-1 aspect-square">
                    {Array.from({length: 25}).map((_, i) => (
                      <div key={i} className={`blueprint-grid opacity-30 border border-white/5 ${i % 7 === 0 ? 'bg-cyan/40 scale-95' : ''}`} />
                    ))}
                 </div>
                 <div className="mt-4 text-[9px] text-muted font-mono text-center uppercase tracking-widest">
                    Deployment Distribution Graph [G.04]
                 </div>
              </div>
           </Panel>
        </div>
      </div>
      
      {/* FOOTER Plate Info */}
      <div className="grid grid-cols-12 gap-10">
         <div className="col-span-4">
            <Panel title="Temporal Drift Analysis">
               <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-muted uppercase">Global Entropy</span>
                     <span className="text-cyan font-mono text-xs">0.00012 λ</span>
                  </div>
                  <div className="h-20 flex items-end gap-1">
                     {Array.from({length: 20}).map((_, i) => (
                        <div key={i} className="flex-1 bg-cyan/20 border-t border-cyan/40" style={{height: `${Math.random() * 80 + 20}%`}} />
                     ))}
                  </div>
                  <div className="text-[9px] text-muted font-mono uppercase tracking-[2px] text-center border-t border-white/5 pt-2">
                     Clock Synchronization [PHASE_4]
                  </div>
               </div>
            </Panel>
         </div>
         <div className="col-span-8">
            <Panel title="Nexus Pipeline Status">
               <div className="p-6 grid grid-cols-3 gap-6">
                  {['INGRESS', 'TRANSFORM', 'EGRESS'].map(stage => (
                     <div key={stage} className="border border-white/5 p-4 bg-black/20">
                        <div className="text-[10px] font-black tracking-[3px] text-cyan mb-2">{stage}</div>
                        <div className="flex gap-1 mb-3">
                           {Array.from({length: 4}).map((_, i) => (
                              <div key={i} className="w-full h-1.5 bg-green/40 shadow-[0_0_10px_rgba(0,255,136,0.2)]" />
                           ))}
                        </div>
                        <div className="text-[9px] font-mono text-muted uppercase">Latency: {Math.random().toFixed(2)}ms</div>
                        <div className="text-[9px] font-mono text-muted uppercase">Load: {(Math.random() * 100).toFixed(1)}%</div>
                     </div>
                  ))}
               </div>
            </Panel>
         </div>
      </div>

      <div className="mt-20 pt-10 border-t border-cyan/20 flex justify-between items-start text-[9px] font-mono text-muted uppercase opacity-50">
        <div>
           PLATE II. OMEGA MONITORING ENVIRONMENT<br/>
           DATE: 2026.04.28 // SYSTEM CLOCK: 43.19.22
        </div>
        <div className="text-right">
           LICENSED TO CONTEXTUAL ENTITY [USER.01]<br/>
           ALL TRANSFORMATIONS DETERMINISTIC
        </div>
      </div>
    </div>
  );
};

const MetricCell: React.FC<{ label: string; value: string; status: string; icon: React.ReactNode; sub?: string }> = ({ label, value, status, icon, sub }) => (
  <div className="bg-panel/20 border border-cyan/10 p-5 flex items-center gap-5 backdrop-blur-md relative overflow-hidden group">
     <div className={`shrink-0 w-12 h-12 rounded border flex items-center justify-center transition-all ${status === 'green' ? 'bg-green/5 border-green/30 text-green group-hover:bg-green/10' : 'bg-accent/5 border-accent/30 text-accent group-hover:bg-accent/10'}`}>
        {icon}
     </div>
     <div>
        <div className="text-[10px] font-bold text-muted uppercase tracking-[3px] mb-1">{label}</div>
        <div className="text-xl font-black font-mono text-white tracking-tighter">{value}</div>
        {sub && <div className="text-[8px] font-mono opacity-50 uppercase mt-0.5">{sub}</div>}
     </div>
     <div className="absolute top-0 right-0 p-1 opacity-10 font-mono text-[8px]">[0x{Math.floor(Math.random()*100)}]</div>
  </div>
);

const FunctionCard: React.FC<{ label: string; desc: string; color: string }> = ({ label, desc, color }) => (
  <div className={`p-4 border-2 ${color} bg-panel/30 backdrop-blur-sm relative group cursor-pointer hover:bg-white/5 transition-all`}>
     <div className="text-[11px] font-black tracking-[4px] mb-2">{label}</div>
     <div className="text-[9px] font-medium opacity-70 uppercase leading-tight">{desc}</div>
     <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-100"><Shield size={10}/></div>
  </div>
);

const StatusCluster: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="space-y-4">
     <div className="flex justify-between items-center text-[11px] font-black text-muted tracking-[4px]">
        {label}
        <span className="text-white">{value}%</span>
     </div>
     <div className="h-2 bg-border/20 rounded-full overflow-hidden blueprint-grid border border-white/5 p-[2px]">
        <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${value}%` }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className={`h-full ${color} shadow-[0_0_15px_rgba(0,240,255,0.4)]`}
        />
     </div>
  </div>
);

const AllocationRow: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="group cursor-default">
    <div className="flex justify-between items-end text-[10px] font-bold mb-2 uppercase tracking-[2px]">
      <span className="text-muted group-hover:text-white transition-colors">{label}</span>
      <span className="font-mono text-xs">{value}</span>
    </div>
    <div className="h-1 bg-border/20 overflow-hidden flex">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: value }}
        transition={{ duration: 1, delay: 0.2 }}
        className={`h-full ${color}`} 
      />
    </div>
  </div>
);

export default Console;
