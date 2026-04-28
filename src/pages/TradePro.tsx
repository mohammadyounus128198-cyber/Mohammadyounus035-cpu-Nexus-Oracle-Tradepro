import React, { useState } from 'react';
import { Panel } from '../components/Panel';
import { useTrade } from '../context/TradeContext';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Search, 
  BarChart2, 
  List,
  Target,
  Zap,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { OrderSide } from '../lib/engine';

const TradePro: React.FC = () => {
  const { quotes, portfolio, teInstance } = useTrade();
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [orderQty, setOrderQty] = useState(1);
  const [orderSide, setOrderSide] = useState<OrderSide>('BUY');

  const q = quotes.get(selectedSymbol);
  
  const handleTrade = async () => {
    if (!q) return;
    try {
      await teInstance.submitOrder({
        symbol: selectedSymbol,
        side: orderSide,
        type: 'MARKET',
        qty: orderQty,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-full grid grid-cols-12 gap-1 p-1 bg-border/20 blueprint-grid bg-vignette overflow-auto custom-scrollbar">
      {/* SCANLINE EFFECT */}
      <div className="scanline" />

      {/* Left Column: Watchlist */}
      <div className="col-span-3 flex flex-col bg-bg/80 backdrop-blur-md space-y-1 border-r border-cyan/20">
         <Panel title="Market Watch [PLATE_01]" className="flex-1 rounded-none border-0 pt-6">
            <div className="px-5 pb-4 border-b border-cyan/10">
               <div className="relative group">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan/40 group-focus-within:text-cyan transition-colors" />
                  <input 
                    type="text" 
                    placeholder="SCAN_TICKERS..." 
                    className="w-full bg-black/60 border border-cyan/10 rounded-lg py-3 pl-11 pr-4 text-[10px] font-mono tracking-widest focus:border-cyan/50 focus:outline-none transition-all placeholder:opacity-30"
                  />
               </div>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
               {Array.from(quotes.values()).map(quote => (
                 <button 
                   key={quote.symbol}
                   onClick={() => setSelectedSymbol(quote.symbol)}
                   className={`w-full p-5 flex items-center justify-between border-b border-cyan/5 hover:bg-cyan/5 transition-all group ${selectedSymbol === quote.symbol ? 'bg-cyan/10 border-l-[3px] border-l-cyan' : ''}`}
                 >
                    <div className="text-left">
                       <div className="text-lg font-black tracking-tighter group-hover:text-cyan transition-colors">{quote.symbol}</div>
                       <div className="text-[9px] text-muted/60 font-mono font-black uppercase tracking-widest">{quote.symbol === 'BTC' ? 'Digital_Core' : 'Legacy_Asset'}</div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-mono font-black text-white group-hover:text-cyan transition-colors">${(Number(quote.price || 0) / 100).toFixed(2)}</div>
                       <div className={`text-[10px] font-mono font-bold flex items-center justify-end gap-1 ${quote.changePercent >= 0 ? 'text-green text-glow-green' : 'text-accent text-glow-red'}`}>
                          {quote.changePercent >= 0 ? <Plus size={10}/> : <TrendingDown size={10}/>}
                          {Math.abs(quote.changePercent).toFixed(2)}%
                       </div>
                    </div>
                 </button>
               ))}
            </div>
         </Panel>
      </div>

      {/* Center Column: Charts & Depth */}
      <div className="col-span-6 flex flex-col bg-bg/40 backdrop-blur-sm space-y-1">
         <Panel title={`${selectedSymbol} Trajectory Map [PLATE_02]`} className="h-[450px] rounded-none border-0 pt-6" glow="cyan-glow">
            <div className="px-8 h-full flex flex-col">
               <div className="flex justify-between items-start mb-8">
                  <div>
                      <div className="text-[10px] font-mono text-cyan/40 uppercase tracking-[5px] mb-2">Live Price Action</div>
                      <div className="text-6xl font-black tracking-tighter leading-none text-glow-cyan">
                         ${q ? (Number(q.price || 0) / 100).toFixed(2) : '—'}
                      </div>
                      <div className="flex items-center gap-6 mt-4 text-[10px] font-mono font-black text-muted/60 uppercase tracking-[2px]">
                         <span className="flex items-center gap-2"><TrendingUp size={14} className="text-green" /> VOL: 1.2M </span>
                         <span className="flex items-center gap-2"><Activity size={14} className="text-cyan" /> DELTA: +0.22% </span>
                      </div>
                  </div>
                  <div className="flex gap-1 p-1 bg-black/40 border border-cyan/10 rounded-lg">
                     {['1M', '5M', '15M', '1H', '1D'].map(tf => (
                       <button key={tf} className={`px-3 py-1.5 rounded text-[9px] font-black transition-all ${tf === '1M' ? 'bg-cyan text-black' : 'text-muted hover:text-white'}`}>
                          {tf}
                       </button>
                     ))}
                  </div>
               </div>
               
               <div className="flex-1 h-[250px] relative">
                  <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={Array.from({length: 50}, (_, i) => ({ price: (q?.price || 15000) + Math.random() * 500 - 250 }))}>
                        <defs>
                           <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <XAxis hide />
                        <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                        <Tooltip contentStyle={{display: 'none'}} />
                        <Area type="stepAfter" dataKey="price" stroke="#00f0ff" strokeWidth={3} fill="url(#colorPrice)" />
                        <ReferenceLine y={q?.price || 15000} stroke="#ff00ff" strokeDasharray="3 3" opacity={0.3} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </Panel>

         <div className="grid grid-cols-2 gap-1 flex-1">
            <Panel title="Order Matrix" className="rounded-none border-0 pt-4">
               <div className="px-5 text-[10px] font-mono h-full flex flex-col pt-2 pb-5">
                  <div className="flex justify-between text-muted/40 font-black tracking-[2px] border-b border-cyan/5 mb-4 pb-2">
                     <span>BID_PRICE</span>
                     <span>UNIT_DENSITY</span>
                  </div>
                  <div className="space-y-1.5 flex-1 overflow-auto custom-scrollbar">
                     {Array.from({length: 6}).map((_, i) => (
                       <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-accent/5 p-1 rounded transition-colors border-l-2 border-transparent hover:border-l-accent">
                          <span className="text-accent/80 font-black">{(Number(q?.price || 0) / 100 + (6-i)*0.05).toFixed(2)}</span>
                          <div className="flex items-center gap-2">
                             <div className="w-16 h-1 bg-accent/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-accent/40" style={{width: `${70 - i * 10}%`}} />
                             </div>
                             <span className="text-muted/60 text-[9px]">{(1000 + i * 250).toLocaleString()}</span>
                          </div>
                       </div>
                     ))}
                     <div className="py-4 text-center">
                        <div className="text-2xl font-black font-mono text-white tracking-widest text-glow-cyan border-y border-cyan/10 py-2 bg-cyan/5 relative overflow-hidden">
                           <div className="scanline absolute inset-0 opacity-10" />
                           {(Number(q?.price || 0) / 100).toFixed(2)}
                        </div>
                     </div>
                     {Array.from({length: 6}).map((_, i) => (
                       <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-green/5 p-1 rounded transition-colors border-l-2 border-transparent hover:border-l-green">
                          <span className="text-green/80 font-black">{(Number(q?.price || 0) / 100 - (i+1)*0.05).toFixed(2)}</span>
                          <div className="flex items-center gap-2">
                             <div className="w-16 h-1 bg-green/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-green/40" style={{width: `${40 + i * 10}%`}} />
                             </div>
                             <span className="text-muted/60 text-[9px]">{(800 + i * 300).toLocaleString()}</span>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </Panel>
            <Panel title="Historical Tape" className="rounded-none border-0 pt-4">
               <div className="px-5 space-y-2 overflow-auto custom-scrollbar pt-2 pb-5 h-full">
                  <div className="flex justify-between text-muted/40 font-black tracking-[2px] border-b border-cyan/5 mb-4 pb-2">
                     <span>OPER_TYPE</span>
                     <span>COORD_VAL</span>
                  </div>
                  {portfolio?.tradeHistory.slice(-15).reverse().map(trade => (
                    <div key={trade.id} className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 py-3 hover:bg-white/5 transition-colors group">
                       <div className="flex flex-col">
                          <span className={`${trade.side === 'BUY' ? 'text-green text-glow-green' : 'text-accent text-glow-red'} font-black tracking-widest`}>{trade.side}</span>
                          <span className="text-[8px] text-muted/40 font-bold">{new Date(trade.timestamp).toLocaleTimeString()}</span>
                       </div>
                       <div className="text-right flex flex-col gap-0.5">
                          <div className="font-black text-white group-hover:text-cyan transition-colors">{trade.qty.toLocaleString()} UNIT</div>
                          <div className="text-muted/60 text-[9px]">${(trade.price/100).toFixed(2)}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </Panel>
         </div>
      </div>

      {/* Right Column: Execution */}
      <div className="col-span-3 flex flex-col bg-bg/80 backdrop-blur-md space-y-1 border-l border-cyan/20 px-1">
         <Panel title="Terminal Interface [PLATE_03]" glow="lattice-glow" className="h-fit rounded-none border-0 pt-6">
            <div className="p-8 space-y-8">
               <div className="flex p-1.5 bg-black/60 rounded-xl border border-cyan/10 ring-1 ring-cyan/5">
                  <button 
                    onClick={() => setOrderSide('BUY')}
                    className={`flex-1 py-4 rounded-lg text-[10px] font-black tracking-[4px] transition-all duration-300 ${orderSide === 'BUY' ? 'bg-green text-black shadow-[0_0_20px_rgba(0,255,136,0.2)]' : 'text-muted/60 hover:text-white'}`}
                  >
                     BUY_ORD
                  </button>
                  <button 
                    onClick={() => setOrderSide('SELL')}
                    className={`flex-1 py-4 rounded-lg text-[10px] font-black tracking-[4px] transition-all duration-300 ${orderSide === 'SELL' ? 'bg-accent text-black shadow-[0_0_20px_rgba(255,51,51,0.2)]' : 'text-muted/60 hover:text-white'}`}
                  >
                     SELL_ORD
                  </button>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black text-muted uppercase tracking-[3px]">
                        <span>UNIT_QUANTITY</span>
                        <span className="text-cyan opacity-40 font-mono">MAX: 1000</span>
                     </div>
                     <div className="relative group">
                        <input 
                          type="number" 
                          value={orderQty}
                          onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-black/60 border border-cyan/20 rounded-2xl py-6 px-8 font-mono text-4xl font-black text-white focus:border-cyan focus:ring-1 focus:ring-cyan/20 focus:outline-none transition-all shadow-[inset_0_0_30px_rgba(0,0,0,0.4)]"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-40 group-focus-within:opacity-100">
                           <button onClick={() => setOrderQty(q => q+1)} className="hover:text-cyan p-1"><ArrowUpRight size={14}/></button>
                           <button onClick={() => setOrderQty(q => Math.max(1, q-1))} className="hover:text-cyan p-1"><ArrowDownRight size={14}/></button>
                        </div>
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black text-muted uppercase tracking-[3px]">
                        <span>EXECUTION_PROTOCOL</span>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        {['MARKET', 'LIMIT'].map(t => (
                          <button key={t} className={`py-3 rounded-lg border-2 text-[10px] font-black tracking-widest transition-all ${t === 'MARKET' ? 'bg-cyan/5 border-cyan shadow-[0_0_15px_rgba(0,240,255,0.1)] text-cyan' : 'border-cyan/10 text-muted/40 hover:border-cyan/30 hover:text-cyan/60'}`}>
                             {t}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="pt-8 border-t border-cyan/10 space-y-4">
                  <div className="flex justify-between text-[10px] font-mono font-black tracking-widest">
                     <span className="text-muted/60">ESTIMATED_VALUE</span>
                     <span className="text-white">${((orderQty * (q?.price || 0)) / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono font-black tracking-widest">
                     <span className="text-muted/40">SYSTEM_FEE [0.1%]</span>
                     <span className="text-white/60">${((orderQty * (q?.price || 0)) / 100000).toFixed(2)}</span>
                  </div>
                  
                  <button 
                    onClick={handleTrade}
                    disabled={!q}
                    className={`w-full py-7 rounded-2xl font-black uppercase tracking-[6px] text-sm transition-all transform active:scale-[0.98] mt-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group ${orderSide === 'BUY' ? 'bg-green text-black hover:bg-green/90' : 'bg-accent text-black hover:bg-accent/90'}`}
                  >
                     <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                     <span className="relative z-10 flex items-center justify-center gap-3">
                        <Zap size={16} fill="currentColor"/>
                        INJECT {orderSide}
                     </span>
                  </button>
               </div>
            </div>
         </Panel>

         <Panel title="Sovereign Holdings Matrix" className="flex-1 rounded-none border-0 pt-6">
            <div className="px-6 space-y-6 overflow-auto custom-scrollbar pb-10">
               <div className="bg-cyan/10 border-2 border-cyan/30 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-2 right-4 opacity-10 font-mono text-[8px] tracking-[4px]">PLATE_03.VALUATION</div>
                  <div className="text-[10px] font-black text-cyan uppercase tracking-[3px] mb-2 opacity-70">CASH_LIQUIDITY</div>
                  <div className="text-4xl font-black tracking-tighter text-glow-cyan leading-none font-mono">${((portfolio?.cash || 0) / 100).toLocaleString()}</div>
               </div>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                     <div className="text-[10px] font-black text-muted/60 uppercase tracking-[4px]">Holdings Stack</div>
                     <Target size={12} className="text-cyan/40 animate-pulse"/>
                  </div>
                  {portfolio?.positions.map(pos => (
                    <div key={pos.symbol} className="flex items-center justify-between p-5 bg-black/60 rounded-2xl border border-cyan/10 hover:border-cyan/40 transition-all cursor-pointer group hover:bg-cyan/5">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-cyan/5 rounded-xl flex items-center justify-center font-black text-xs border border-cyan/10 group-hover:bg-cyan/20 transition-all">
                             {pos.symbol.slice(0, 2)}
                          </div>
                          <div>
                             <div className="text-sm font-black tracking-tighter group-hover:text-cyan transition-colors">{pos.symbol}</div>
                             <div className="text-[10px] text-muted font-mono opacity-50">{pos.qty.toLocaleString()} UNIT</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className={`text-[11px] font-black font-mono tracking-tighter flex items-center justify-end gap-1 ${pos.pnl >= 0 ? 'text-green text-glow-green' : 'text-accent text-glow-red'}`}>
                             {pos.pnl >= 0 ? '+' : ''}{(pos.pnl/100).toFixed(1)}%
                          </div>
                          <div className="text-[10px] text-white/40 font-mono font-black uppercase mt-0.5">${((pos.qty * pos.currentPrice)/100).toLocaleString()}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </Panel>
      </div>
    </div>
  );
};

export default TradePro;
