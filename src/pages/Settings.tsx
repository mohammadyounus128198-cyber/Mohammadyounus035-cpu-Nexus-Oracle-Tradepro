import React, { useState } from 'react';
import { Panel } from '../components/Panel';
import { useTrade } from '../context/TradeContext';
import { 
  Plus, 
  Trash2, 
  RefreshCcw, 
  Server, 
  Shield, 
  Cpu, 
  Settings as SettingsIcon,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Settings: React.FC = () => {
  const { resetSession, addTicker, removeTicker, getAvailableTickers } = useTrade();
  
  const [newTicker, setNewTicker] = useState({
    symbol: '',
    name: '',
    basePrice: 100,
    volatility: 0.02,
    drift: 0.0005
  });

  const tickers = getAvailableTickers();

  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker.symbol) return;
    addTicker({
      ...newTicker,
      basePrice: newTicker.basePrice * 100 // convert to cents
    });
    setNewTicker({
      symbol: '',
      name: '',
      basePrice: 100,
      volatility: 0.02,
      drift: 0.0005
    });
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-8 overflow-auto pb-20">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-4xl font-black tracking-tighter uppercase mb-1">Node Settings</h1>
           <p className="text-[10px] text-muted font-mono uppercase tracking-[2px]">Configuration Matrix · Simulation Control</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Simulation Control */}
        <div className="col-span-8 flex flex-col gap-8">
           <Panel title="Simulation Management" glow="cyan-glow">
              <div className="p-6">
                 <div className="mb-6 flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase text-white tracking-widest">Active Tickers</h3>
                    <div className="flex items-center gap-2 p-1 bg-black/40 border border-border/10 rounded-lg">
                       <Search size={12} className="ml-2 text-muted" />
                       <input type="text" placeholder="Filter..." className="bg-transparent border-0 text-[10px] focus:ring-0 w-32" />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <AnimatePresence>
                       {tickers.map(ticker => (
                         <motion.div 
                           key={ticker.symbol}
                           initial={{ opacity: 0, scale: 0.9 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.9 }}
                           className="p-4 bg-panel/30 border border-border/10 rounded-xl flex items-center justify-between group hover:border-cyan/30 transition-all"
                         >
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-cyan/10 border border-cyan/20 rounded-lg flex items-center justify-center font-black text-xs text-cyan">
                                  {ticker.symbol.slice(0, 2)}
                               </div>
                               <div>
                                  <div className="text-sm font-black">{ticker.symbol}</div>
                                  <div className="text-[9px] text-muted uppercase font-bold">{ticker.name}</div>
                               </div>
                            </div>
                            <button 
                              onClick={() => removeTicker(ticker.symbol)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:bg-accent/20 hover:text-accent transition-all opacity-0 group-hover:opacity-100"
                            >
                               <Trash2 size={14} />
                            </button>
                         </motion.div>
                       ))}
                    </AnimatePresence>
                 </div>
              </div>
           </Panel>

           <Panel title="Add Linear/Synthetic Vector">
              <form onSubmit={handleAddTicker} className="p-6 grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest">Ticker Symbol</label>
                    <input 
                       required
                       value={newTicker.symbol}
                       onChange={e => setNewTicker({...newTicker, symbol: e.target.value.toUpperCase()})}
                       className="w-full bg-black/40 border border-border/20 rounded-xl py-3 px-4 font-mono text-sm focus:border-cyan focus:outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest">Display Name</label>
                    <input 
                       required
                       value={newTicker.name}
                       onChange={e => setNewTicker({...newTicker, name: e.target.value})}
                       className="w-full bg-black/40 border border-border/20 rounded-xl py-3 px-4 font-mono text-sm focus:border-cyan focus:outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest">Base Price ($)</label>
                    <input 
                       type="number"
                       value={newTicker.basePrice}
                       onChange={e => setNewTicker({...newTicker, basePrice: parseFloat(e.target.value)})}
                       className="w-full bg-black/40 border border-border/20 rounded-xl py-3 px-4 font-mono text-sm focus:border-cyan focus:outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest">Volatility (σ)</label>
                    <input 
                       type="number" step="0.001"
                       value={newTicker.volatility}
                       onChange={e => setNewTicker({...newTicker, volatility: parseFloat(e.target.value)})}
                       className="w-full bg-black/40 border border-border/20 rounded-xl py-3 px-4 font-mono text-sm focus:border-cyan focus:outline-none"
                    />
                 </div>
                 <div className="col-span-2 pt-4">
                    <button 
                       type="submit"
                       className="w-full py-4 bg-cyan text-black font-black uppercase tracking-[3px] text-xs rounded-xl shadow-lg shadow-cyan/10 hover:scale-[1.02] active:scale-98 transition-all"
                    >
                       Initialize Vector
                    </button>
                 </div>
              </form>
           </Panel>
        </div>

        {/* System Settings */}
        <div className="col-span-4 space-y-8">
           <Panel title="Node Controls">
              <div className="p-6 space-y-4">
                 <SettingsRow label="Auto-Scaling" icon={<Cpu size={14}/>} active />
                 <SettingsRow label="Encryption Layer" icon={<Shield size={14}/>} active />
                 <SettingsRow label="Public API" icon={<Server size={14}/>} />
                 <div className="pt-6 border-t border-border/10">
                    <button 
                       onClick={resetSession}
                       className="w-full py-4 border border-accent/30 text-accent font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2 hover:bg-accent/10 transition-all"
                    >
                       <RefreshCcw size={14} /> Reset State Store
                    </button>
                 </div>
              </div>
           </Panel>

           <div className="p-6 bg-cyan/5 border border-cyan/20 rounded-2xl flex flex-col items-center text-center gap-4">
              <SettingsIcon size={32} className="text-cyan animate-spin-slow" />
              <div>
                 <h4 className="text-xs font-black uppercase tracking-widest text-cyan mb-1">Sub-Phasic Tuning</h4>
                 <p className="text-[9px] font-mono text-muted/60 leading-relaxed uppercase">
                    Fine-tune the lattice resonance to match local execution environment constraints.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const SettingsRow: React.FC<{ label: string; icon: React.ReactNode; active?: boolean }> = ({ label, icon, active }) => (
  <div className="flex justify-between items-center p-3 bg-black/20 border border-border/10 rounded-lg">
     <div className="flex items-center gap-3 text-[11px] font-bold text-white/80">
        <span className="text-muted/60">{icon}</span>
        {label}
     </div>
     <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${active ? 'bg-cyan' : 'bg-border/20'}`}>
        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${active ? 'right-1' : 'left-1'}`} />
     </div>
  </div>
);

export default Settings;
