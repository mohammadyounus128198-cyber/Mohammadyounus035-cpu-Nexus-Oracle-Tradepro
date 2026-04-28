import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Target, 
  Zap,
  TrendingUp,
  History,
  ShieldAlert
} from 'lucide-react';
import { useTrade } from '../context/TradeContext';
import { OrderSide } from '../lib/engine';
import { tradeEngine } from '../lib/tradeEngine';
import { Panel } from '../components/Panel';

// --- Sub-components (could be moved to separate files) ---

const TradeGraphic: React.FC<{ quotes: Map<string, any>, currentSymbol: string }> = ({ quotes, currentSymbol }) => {
  const q = quotes.get(currentSymbol);
  if (!q) return null;
  return (
    <div className="h-48 w-full bg-black/40 rounded-lg border border-border/20 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-full h-[1px] bg-accent/30 top-1/2" />
        <div className="absolute h-full w-[1px] bg-accent/30 left-1/2" />
      </div>
      <div className="relative text-center">
        <motion.div 
          key={q.price}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl font-mono font-black tracking-tighter"
        >
          {(Number(q.price || 0) / 100).toFixed(2)}
        </motion.div>
        <div className="text-[10px] uppercase tracking-[4px] font-bold text-muted mt-2">
          Real-time Latency: <span className="text-cyan">{(Math.random() * 2).toFixed(2)}ms</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { identity, quotes, portfolio, riskMetrics, engineEvents } = useTrade();
  const [currentSymbol, setCurrentSymbol] = useState('AAPL');
  const [qty, setQty] = useState('');
  const [buySide, setBuySide] = useState(true);

  const handleTrade = async () => {
    if (!qty || isNaN(Number(qty)) || Number(qty) <= 0) return;
    if (!portfolio || !identity) return;

    const side: OrderSide = buySide ? 'BUY' : 'SELL';
    
    try {
      tradeEngine.submitOrder({
        symbol: currentSymbol,
        side,
        type: 'MARKET',
        qty: Number(qty)
      });
      setQty('');
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col gap-8 overflow-auto custom-scrollbar blueprint-grid bg-vignette">
      {/* SCANLINE EFFECT */}
      <div className="scanline" />

      {/* Header Info */}
      <header className="flex justify-between items-end border-b-2 border-cyan/40 pb-8">
        <div>
           <div className="text-[10px] font-mono text-cyan/60 uppercase tracking-[4px] mb-2">Nexus.System.Dashboard [0x01]</div>
           <h1 className="text-6xl font-black tracking-tighter uppercase leading-none text-glow-cyan">LATTICE_CORE</h1>
           <div className="flex gap-6 mt-6">
              <div className="flex items-center gap-2 border border-border/40 px-3 py-1 text-[10px] font-mono uppercase tracking-[2px]">
                 <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
                 VERIFIED_SYNC: 671.6Hz
              </div>
              <div className="flex items-center gap-2 border border-border/40 px-3 py-1 text-[10px] font-mono uppercase tracking-[2px]">
                 <div className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                 NODE_P2P: HEALTHY
              </div>
           </div>
        </div>

        <div className="flex flex-col items-end gap-6">
          <div className="flex gap-2 p-1 bg-black/60 border border-border/20 rounded-xl ring-1 ring-cyan/10">
            {['AAPL', 'NVDA', 'TSLA', 'BTC'].map((sym) => (
              <button 
                key={sym}
                onClick={() => setCurrentSymbol(sym)}
                className={`px-5 py-2.5 rounded-lg font-mono text-[11px] font-black tracking-widest transition-all ${
                  currentSymbol === sym 
                  ? 'bg-cyan text-black shadow-[0_0_20px_rgba(0,240,255,0.3)]' 
                  : 'text-muted hover:text-white'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
          <div className="text-[10px] font-mono text-muted/40 tracking-[3px] uppercase font-black">
            SIGNAL_LATENCY: {(Math.random() * 0.4 + 0.1).toFixed(3)}ms
          </div>
        </div>
      </header>

      {/* Primary Grid */}
      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
        
        {/* Left Column: Risk & Holdings */}
        <div className="col-span-3 flex flex-col gap-8 min-h-0">
          <Panel title="Risk Shield [V.04]" glow={riskMetrics?.status === 'green' ? 'green-glow' : 'lattice-glow'}>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 border border-cyan/10 group hover:border-cyan/40 transition-colors">
                <div className="text-[9px] font-black text-muted/60 uppercase tracking-widest mb-2">Exposure</div>
                <div className="text-2xl font-mono font-black text-green tracking-tighter">{(Number(riskMetrics?.totalExposure || 0)).toFixed(2)}%</div>
              </div>
              <div className="p-4 bg-black/40 border border-cyan/10 group hover:border-cyan/40 transition-colors">
                <div className="text-[9px] font-black text-muted/60 uppercase tracking-widest mb-2">Leverage</div>
                <div className="text-2xl font-mono font-black text-cyan tracking-tighter">1.2x</div>
              </div>
              <div className="p-4 bg-black/40 border border-cyan/10 group hover:border-cyan/40 transition-colors">
                <div className="text-[9px] font-black text-muted/60 uppercase tracking-widest mb-2">VaR (95%)</div>
                <div className="text-2xl font-mono font-black text-magenta tracking-tighter">{(Number(riskMetrics?.volatilityAdjustedExposure || 0)).toFixed(2)}</div>
              </div>
              <div className="p-4 bg-black/40 border border-cyan/10 group hover:border-cyan/40 transition-colors">
                <div className="text-[9px] font-black text-muted/60 uppercase tracking-widest mb-2">Integrity</div>
                <div className="text-2xl font-mono font-black text-green tracking-tighter">100</div>
              </div>
            </div>
            
            {riskMetrics?.warnings && riskMetrics.warnings.length > 0 && (
              <div className="mx-6 mb-6 p-4 bg-accent/5 border-2 border-accent shadow-[0_0_20px_rgba(255,51,51,0.1)] rounded flex items-center gap-4 animate-pulse">
                <ShieldAlert size={20} className="text-accent shrink-0" />
                <div className="text-[10px] font-black leading-tight uppercase tracking-[2px] text-accent">
                   ALGORITHM_BREACH: {riskMetrics.warnings[0]}
                </div>
              </div>
            )}
          </Panel>

          <Panel title="Sovereign Holdings [S.99]" glow="cyan-glow">
            <div className="p-6 space-y-6 h-full flex flex-col">
              <div className="flex justify-between items-end mb-4 border-b border-cyan/10 pb-6">
                <div>
                  <div className="text-[10px] text-cyan/40 font-black uppercase tracking-[3px] mb-2">Net_Asset_Valuation</div>
                  <div className="text-4xl font-mono font-black text-white text-glow-cyan tracking-tighter leading-none">${((portfolio?.nav || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-black text-green uppercase tracking-widest">+0.42%</div>
                  <div className="text-[9px] text-muted/40 font-mono font-black uppercase mt-1">LATTICE_DRIFT</div>
                </div>
              </div>

              <div className="space-y-3 flex-1 overflow-auto custom-scrollbar">
                {portfolio?.positions.map((pos) => (
                  <div key={pos.symbol} className="p-4 bg-black/40 border border-cyan/5 hover:border-cyan/40 group transition-all flex justify-between items-center cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded border border-cyan/10 flex items-center justify-center font-black text-[10px] group-hover:bg-cyan/10 transition-colors">{pos.symbol.slice(0, 2)}</div>
                       <div>
                          <div className="text-sm font-black group-hover:text-cyan transition-colors">{pos.symbol}</div>
                          <div className="text-[9px] text-muted font-mono uppercase tracking-widest">{pos.shares} UNITS</div>
                       </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[12px] font-black font-mono tracking-tighter mb-0.5 ${pos.pnl >= 0 ? 'text-green text-glow-green' : 'text-accent text-glow-red'}`}>
                        {pos.pnl >= 0 ? '+' : ''}{(Number(pos.pnl || 0) / 100).toFixed(2)}%
                      </div>
                      <div className="text-[9px] text-muted/40 font-mono uppercase font-black tracking-widest">
                        ${(Number(pos.currentPrice || 0) / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
                {portfolio?.positions.length === 0 && (
                  <div className="text-center py-20 opacity-10">
                    <Activity size={48} className="mx-auto mb-4 animate-spin-slow" />
                    <div className="text-[11px] font-black uppercase tracking-[6px]">NULL_POSITIONS</div>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </div>

        {/* Center Column: Trade Engine */}
        <div className="col-span-6 flex flex-col gap-8">
          <Panel title="Live Execution Lattice [MATRIX_X]" className="flex-1">
             <div className="p-8 h-full flex flex-col">
                <div className="relative group">
                   <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none group-hover:opacity-100 transition-opacity duration-700" />
                   <TradeGraphic quotes={quotes} currentSymbol={currentSymbol} />
                </div>
                
                <div className="mt-12 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full relative">
                  <div className="flex gap-3 p-2 bg-black/60 border-2 border-cyan/10 rounded-2xl mb-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                    <button 
                      onClick={() => setBuySide(true)}
                      className={`flex-1 py-4 text-[11px] font-black uppercase tracking-[4px] rounded-xl transition-all duration-300 ${buySide ? 'bg-green text-black shadow-[0_0_30px_rgba(0,255,136,0.2)]' : 'text-muted/60 hover:text-white'}`}
                    >
                      LONG_VECTOR
                    </button>
                    <button 
                      onClick={() => setBuySide(false)}
                      className={`flex-1 py-4 text-[11px] font-black uppercase tracking-[4px] rounded-xl transition-all duration-300 ${!buySide ? 'bg-accent text-black shadow-[0_0_30px_rgba(255,51,51,0.3)]' : 'text-muted/60 hover:text-white'}`}
                    >
                      SHORT_VECTOR
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="relative group">
                      <div className="text-[10px] font-black text-cyan/40 uppercase tracking-[4px] mb-2 px-1">UNIT_VOLUME</div>
                      <input 
                        type="text" 
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        placeholder="000.00"
                        className="w-full bg-black/80 border-2 border-cyan/10 rounded-2xl px-8 py-8 text-5xl font-mono font-black text-white focus:outline-none focus:border-cyan/40 transition-all text-center tracking-tighter shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]"
                      />
                      <div className="absolute right-4 bottom-4 text-cyan/20 font-mono text-[8px] tracking-[3px]">SYS_UNITS</div>
                    </div>

                    <button 
                      onClick={handleTrade}
                      disabled={!qty || isNaN(Number(qty))}
                      className={`w-full py-8 rounded-2xl font-black uppercase tracking-[8px] text-xl shadow-2xl transition-all active:scale-[0.97] disabled:opacity-20 disabled:cursor-not-allowed group relative overflow-hidden ${buySide ? 'bg-green text-black hover:bg-green/90' : 'bg-accent text-black hover:bg-accent/90'}`}
                    >
                       <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12" />
                       <span className="relative z-10">{buySide ? 'AUTHORIZE_LONG' : 'AUTHORIZE_SHORT'}</span>
                    </button>
                    
                    <div className="flex justify-between items-center px-2 opacity-50">
                       <div className="flex gap-2">
                          {Array.from({length: 4}).map((_, i) => (
                             <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan/40" />
                          ))}
                       </div>
                       <div className="text-[8px] font-mono text-muted uppercase tracking-[4px]">Validation_Protocol: ACTIVE</div>
                    </div>
                  </div>
                </div>
             </div>
          </Panel>
        </div>

        {/* Right Column: Events & Terminal */}
        <div className="col-span-3 flex flex-col gap-8 min-h-0">
          <Panel title="Activity Manifest [P.01]" className="flex-1">
            <div className="p-6 space-y-6 h-full flex flex-col">
              <div className="text-[10px] font-black text-muted/40 uppercase tracking-[4px] mb-2 flex justify-between items-center">
                 <span>Signed Proofs</span>
                 <History size={12} className="opacity-40 animate-spin-slow"/>
              </div>
              <div className="space-y-3 flex-1 overflow-auto custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {portfolio?.tradeHistory.slice().reverse().map((trade) => (
                    <motion.div 
                      key={trade.id}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="p-4 bg-black/60 border border-cyan/5 hover:border-cyan/40 group transition-all cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <div className={`text-[11px] font-black uppercase tracking-[2px] transition-colors ${trade.side === 'BUY' ? 'text-green group-hover:text-green' : 'text-accent group-hover:text-accent'}`}>
                          {trade.side}_{trade.symbol}
                        </div>
                        <div className="text-[8px] font-mono text-muted/30 mt-1 uppercase tracking-widest font-bold">
                          SEC_HASH: {trade.id.slice(0, 12)}
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[12px] text-white font-black font-mono tracking-tighter">
                           {trade.qty}U
                         </div>
                         <div className="text-[9px] text-muted/40 font-mono mt-0.5">${(Number(trade.price || 0) / 100).toFixed(2)}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {(!portfolio || portfolio.tradeHistory.length === 0) && (
                  <div className="text-center py-20 opacity-10">
                    <History size={48} className="mx-auto mb-4" />
                    <div className="text-[11px] font-black uppercase tracking-[6px]">HISTORY_EMPTY</div>
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <Panel title="Nexus Event Stream [S.04]" className="h-80">
             <div className="p-6 space-y-4 overflow-auto h-full font-mono text-[9px] custom-scrollbar">
               {engineEvents.map((e, i) => (
                  <div key={i} className="border-l-2 border-cyan/10 pl-4 py-2 hover:bg-cyan/5 transition-colors group">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-muted/30 font-bold">[{new Date(e.timestamp).toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 2 })}]</span>
                       <span className="text-[8px] text-muted/10 font-bold">NODE_{Math.floor(Math.random()*16)}</span>
                    </div>
                    <div>
                       <span className={`font-black tracking-widest ${e.type.includes('Filled') ? 'text-green' : 'text-cyan'}`}>{e.type.toUpperCase()}</span>{' '}
                       <span className="text-white/60 font-medium">· {e.data.symbol} {e.data.qty || e.data.side}</span>
                    </div>
                  </div>
                ))}
                {engineEvents.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 filter grayscale grayscale-opacity-50">
                    <Activity size={24} className="mb-4 animate-pulse" />
                    <div className="text-[9px] font-black uppercase tracking-[4px]">SYNC_LISTENING...</div>
                  </div>
                )}
             </div>
          </Panel>
        </div>
      </div>

      {/* FOOTER PLATE */}
      <div className="mt-12 pt-8 border-t-2 border-cyan/20 flex justify-between items-start text-[10px] font-mono text-muted uppercase opacity-40 font-black tracking-[4px]">
         <div>
            Nexus_Plate_01 // Sovereign_System_Monitor<br/>
            COORD: G.77.ALPHA // DATA_DENSITY: HIGH
         </div>
         <div className="text-right">
            LATTICE_INTEGRITY: 100%<br/>
            SEC_ENVELOPE_LOCK: ACTIVE
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
