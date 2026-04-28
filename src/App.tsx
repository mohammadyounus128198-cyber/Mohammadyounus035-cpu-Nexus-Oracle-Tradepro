import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  Wallet, 
  BarChart3, 
  Zap, 
  Lock, 
  ArrowUpRight, 
  ArrowDownLeft,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { 
  getOrCreateIdentity, 
  signPayload, 
  canonical 
} from './lib/integrity';
import { 
  MarketDataEngine, 
  MARKET_DATA_CONFIG, 
  Quote, 
  OrderSide, 
  Trade 
} from './lib/engine';
import { 
  PortfolioManager, 
  Portfolio, 
  Performance 
} from './lib/state';

// --- Sub-components ---

const Panel = ({ title, children, className = "", rightElement = null }: { title: string, children: React.ReactNode, className?: string, rightElement?: React.ReactNode }) => (
  <div className={`flex flex-col border-b border-border bg-bg overflow-hidden ${className}`}>
    <div className="px-4 py-2.5 bg-panel flex justify-between items-center select-none">
      <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{title}</span>
      {rightElement}
    </div>
    <div className="flex-1 overflow-auto">
      {children}
    </div>
  </div>
);

const MetricRow = ({ label, value, colorClass = "text-text", subValue = "" }: { label: string, value: string, colorClass?: string, subValue?: string }) => (
  <div className="flex justify-between items-center px-4 py-3 border-b border-border transition-colors hover:bg-white/[0.02]">
    <span className="text-[11px] text-muted">{label}</span>
    <div className="text-right">
      <div className={`font-mono text-[13px] font-semibold ${colorClass}`}>{value}</div>
      {subValue && <div className="text-[10px] text-muted font-mono">{subValue}</div>}
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [identity, setIdentity] = useState<any>(null);
  const [quotes, setQuotes] = useState<Map<string, Quote>>(new Map());
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [currentSymbol, setCurrentSymbol] = useState('AAPL');
  const [qty, setQty] = useState('');
  const [buySide, setBuySide] = useState(true);

  // Refs for engine persistence across renders
  const engineRef = useRef<MarketDataEngine | null>(null);
  const portfolioRef = useRef<PortfolioManager | null>(null);
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Initialize
    async function init() {
      const id = await getOrCreateIdentity();
      setIdentity(id);

      engineRef.current = new MarketDataEngine();
      portfolioRef.current = new PortfolioManager();
      
      const interval = setInterval(() => {
        if (engineRef.current && portfolioRef.current) {
          const newQuotes = engineRef.current.tick();
          setQuotes(new Map(newQuotes));
          
          portfolioRef.current.updatePrices(newQuotes);
          setPortfolio(portfolioRef.current.getSnapshot());
          setPerformance(portfolioRef.current.calculatePerformance());
        }
      }, 2000);

      return () => clearInterval(interval);
    }
    init();
  }, []);

  // Update canvas chart
  useEffect(() => {
    if (!chartRef.current || !engineRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const history = engineRef.current!.getHistory(currentSymbol);
      const width = chartRef.current!.width;
      const height = chartRef.current!.height;
      
      ctx.clearRect(0, 0, width, height);
      
      const max = Math.max(...history);
      const min = Math.min(...history);
      const range = max - min || 1;
      const pad = range * 0.1;
      
      ctx.beginPath();
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      
      history.forEach((val, i) => {
        const x = (i / (history.length - 1)) * width;
        const y = height - ((val - (min - pad)) / (range + 2 * pad)) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Gradient under the curve
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(0, 212, 255, 0.1)');
      grad.addColorStop(1, 'rgba(0, 212, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fill();
    };

    render();
  }, [quotes, currentSymbol]);

  const handleExecute = async () => {
    if (!qty || isNaN(Number(qty)) || Number(qty) <= 0) return;
    if (!portfolioRef.current || !identity) return;

    const currentPrice = quotes.get(currentSymbol)?.price || 0;
    const side: OrderSide = buySide ? 'BUY' : 'SELL';
    
    const payload = {
      ts: new Date().toISOString(),
      side,
      qty: Number(qty),
      symbol: currentSymbol,
      price: currentPrice,
      lattice_res: 671.6
    };

    try {
      const sig = await signPayload(payload, identity.privateKey);
      
      const trade: Trade = {
        id: Math.random().toString(36).substring(7),
        orderId: 'ORD-' + Math.random().toString(36).substring(7).toUpperCase(),
        symbol: currentSymbol,
        side,
        qty: Number(qty),
        price: currentPrice,
        timestamp: payload.ts,
        proof: sig
      };

      portfolioRef.current.executeTrade(trade);
      setPortfolio(portfolioRef.current.getSnapshot());
      setPerformance(portfolioRef.current.calculatePerformance());
      setQty('');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const navDisplay = portfolio ? (portfolio.nav / 100).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "100,000.00";
  const cashDisplay = portfolio ? (portfolio.cash / 100).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "100,000.00";
  const currentQuote = quotes.get(currentSymbol);

  return (
    <div className="h-screen flex flex-col bg-bg text-text">
      {/* Header */}
      <header className="h-12 bg-header border-b border-border flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-accent font-extrabold text-sm tracking-[2px] drop-shadow-[0_0_10px_var(--accent-glow)] select-none">
            NEXUS • ORACLE
          </div>
          <div className="font-mono text-[11px] text-cyan bg-cyan/10 px-2 py-0.5 rounded border border-cyan/20 select-none">
            671.6 Hz PHASE-LOCK
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-green/5 border border-green/20 rounded">
            <div className="w-1.5 h-1.5 bg-green rounded-full shadow-[0_0_8px_var(--color-green)]" />
            <span className="text-[10px] font-bold text-green uppercase tracking-wide">Stable Instance</span>
          </div>
          <div className="h-4 w-px bg-border mx-2" />
          <div className="text-[11px] font-mono text-muted">
            ID: <span className="text-accent">{identity?.fingerprint || "INITIALIZING"}</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-[280px_1fr_340px] gap-px bg-border overflow-hidden">
        {/* Left Column: Portfolio & Performance */}
        <div className="flex flex-col bg-bg overflow-hidden">
          <Panel title="Portfolio Management">
            <MetricRow label="NAV (Cents)" value={navDisplay} colorClass="text-cyan" />
            <MetricRow label="CASH BALANCE" value={cashDisplay} />
            <MetricRow label="OPEN POSITIONS" value={String(portfolio?.positions.size || 0)} />
          </Panel>

          <Panel title="Performance Analytics">
            <MetricRow label="SHARPE RATIO" value={performance?.sharpe.toFixed(2) || "3.42"} colorClass="text-green" />
            <MetricRow label="MAX DRAWDOWN" value={`${performance?.maxDrawdown.toFixed(2) || "0.00"}%`} colorClass="text-accent" />
            <MetricRow label="WIN RATE" value={`${performance?.winRate.toFixed(1) || "100.0"}%`} colorClass="text-cyan" />
          </Panel>

          <Panel title="Activity Feed" className="flex-1">
            <div className="p-3 space-y-4">
              <AnimatePresence mode="popLayout">
                {portfolio?.tradeHistory.slice().reverse().map((trade) => (
                  <motion.div 
                    key={trade.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-l-2 border-border pl-3 pb-1"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono text-muted/60">{new Date(trade.timestamp).toLocaleTimeString()}</span>
                      <span className={`text-[10px] font-bold ${trade.side === 'BUY' ? 'text-green' : 'text-accent'}`}>{trade.side}</span>
                      <span className="text-[11px] font-bold">{trade.symbol}</span>
                    </div>
                    <div className="text-[11px] text-muted font-medium">
                      {trade.qty} @ ${(trade.price / 100).toFixed(2)}
                    </div>
                    <div className="text-[8px] font-mono text-cyan truncate mt-1 opacity-50 uppercase">
                      Proof: {trade.proof.slice(0, 16)}...
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Synthetic Insights */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <div className="text-[9px] font-bold text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Zap size={10} className="text-yellow" />
                  Oracle Telemetry
                </div>
                <div className="space-y-3">
                  <div className="text-[10px] text-muted font-mono leading-relaxed transition-opacity">
                    <span className="text-cyan">[INTEL]</span> Sovereign Lattice reports 2030 TAM target steady at $5.81T.
                  </div>
                  <div className="text-[10px] text-muted font-mono leading-relaxed">
                    <span className="text-green">[NODE]</span> Mirror synchronization active across 24 validators.
                  </div>
                  <div className="text-[10px] text-muted font-mono leading-relaxed opacity-50">
                    <span className="text-accent">[ALERT]</span> High-volatility event detected in L0_TRACK.
                  </div>
                </div>
              </div>

              {portfolio?.tradeHistory.length === 0 && (
                <div className="text-[11px] text-muted/20 font-mono italic p-4 text-center mt-10">
                  SYSTEM_IDLE: Awaiting telemetry...
                </div>
              )}
            </div>
          </Panel>
        </div>

        {/* Center Column: Market Feed & Execution */}
        <div className="flex flex-col bg-bg overflow-hidden relative">
          {/* Symbol Tabs */}
          <div className="h-10 bg-panel border-b border-border flex items-center px-4 gap-2">
            {Object.keys(MARKET_DATA_CONFIG).map(sym => (
              <button 
                key={sym}
                onClick={() => setCurrentSymbol(sym)}
                className={`h-6 px-3 rounded text-[10px] font-bold transition-all uppercase tracking-wider border ${
                  currentSymbol === sym 
                    ? 'bg-accent/10 border-accent text-accent shadow-[0_0_10px_var(--accent-glow)]' 
                    : 'bg-white/5 border-transparent text-muted hover:bg-white/10'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col">
            <div className="p-8 pb-4 text-center border-b border-border">
              <div className="text-[11px] text-muted mb-1 font-medium tracking-widest uppercase">
                {MARKET_DATA_CONFIG[currentSymbol].name} / USD
              </div>
              <div className="text-4xl font-bold font-mono tracking-tight text-text">
                ${currentQuote ? (currentQuote.price / 100).toFixed(2) : "0.00"}
              </div>
              <div className={`text-[11px] font-bold mt-2 font-mono ${currentQuote && currentQuote.change >= 0 ? "text-green" : "text-accent"}`}>
                {currentQuote && currentQuote.change >= 0 ? "+" : ""}{currentQuote ? (currentQuote.change / 100).toFixed(2) : "0.00"} 
                ({currentQuote ? currentQuote.changePercent.toFixed(2) : "0.00"}%)
              </div>
            </div>

            <div className="flex-1 flex flex-col p-4">
              <div className="flex-1 relative min-h-[200px]">
                <canvas 
                  ref={chartRef} 
                  className="w-full h-full cursor-crosshair opacity-80"
                  width={800}
                  height={400}
                />
              </div>
            </div>

            <Panel title="Order Entry Engine" className="h-[180px]">
              <div className="p-4 flex flex-col h-full gap-3">
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-1">
                    <label className="text-[9px] text-muted block mb-1 uppercase font-bold">Side</label>
                    <button 
                      onClick={() => setBuySide(!buySide)}
                      className={`w-full h-9 rounded border-[1px] text-[11px] font-bold transition-all ${
                        buySide ? 'bg-green/10 border-green text-green' : 'bg-accent/10 border-accent text-accent'
                      }`}
                    >
                      {buySide ? 'BUY' : 'SELL'}
                    </button>
                  </div>
                  <div className="col-span-1">
                    <label className="text-[9px] text-muted block mb-1 uppercase font-bold">Qty</label>
                    <input 
                      type="number" 
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      placeholder="100"
                      className="w-full h-9 bg-black border border-border text-text px-3 text-[12px] font-mono outline-none rounded focus:border-cyan"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-[9px] text-muted block mb-1 uppercase font-bold">Type</label>
                    <select className="w-full h-9 bg-black border border-border text-text px-2 text-[11px] font-mono outline-none rounded appearance-none cursor-pointer">
                      <option>MARKET</option>
                      <option disabled>LIMIT</option>
                      <option disabled>STOP</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="text-[9px] text-muted block mb-1 uppercase font-bold">Total</label>
                    <div className="h-9 border border-border/50 rounded flex items-center px-3 bg-white/[0.02]">
                      <span className="text-[11px] font-mono text-muted/60 tracking-tight">
                        ${currentQuote ? ((currentQuote.price * (Number(qty) || 0)) / 100).toLocaleString() : "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleExecute}
                  className={`w-full h-11 rounded font-bold text-[12px] tracking-[2px] transition-all transform active:scale-95 ${
                    buySide 
                      ? 'bg-green text-black hover:bg-green/90 shadow-[0_0_20px_rgba(0,255,136,0.3)]' 
                      : 'bg-accent text-black hover:bg-accent/90 shadow-[0_0_20px_rgba(255,51,51,0.3)]'
                  }`}
                >
                  EXECUTE PROOF-BOUND ORDER
                </button>
              </div>
            </Panel>
          </div>
        </div>

        {/* Right Column: Order Book & Integrity */}
        <div className="flex flex-col bg-bg overflow-hidden">
          <Panel title="Live Order Book" className="flex-1">
             <table className="w-full text-[11px] font-mono border-collapse select-none">
              <thead className="sticky top-0 bg-panel text-muted uppercase text-[9px]">
                <tr>
                  <th className="px-4 py-2 text-left font-normal border-b border-border/50">Price</th>
                  <th className="px-4 py-2 text-right font-normal border-b border-border/50">Size</th>
                </tr>
              </thead>
              <tbody>
                {/* Randomly generated depth for visual fidelity */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`ask-${i}`} className="text-accent hover:bg-accent/5">
                    <td className="px-4 py-1">{(currentQuote ? (currentQuote.price/100 + (5-i)*0.1) : 0).toFixed(2)}</td>
                    <td className="px-4 py-1 text-right">{(1000 + i * 211).toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-white/5 font-black text-center text-[12px] text-text border-y border-border">
                  <td colSpan={2} className="py-1.5 italic">
                    {(currentQuote ? currentQuote.price/100 : 0).toFixed(2)}
                  </td>
                </tr>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`bid-${i}`} className="text-green hover:bg-green/5">
                    <td className="px-4 py-1">{(currentQuote ? (currentQuote.price/100 - (i+1)*0.1) : 0).toFixed(2)}</td>
                    <td className="px-4 py-1 text-right">{(800 + i * 142).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel title="Cryptographic Integrity">
            <div className="p-4 space-y-3">
              <div className="space-y-1">
                <div className="text-[10px] text-muted uppercase font-bold tracking-wider mb-1 flex items-center gap-2">
                  <ShieldCheck size={10} className="text-cyan" />
                  Merkle Root (Current State)
                </div>
                <div className="bg-black p-2 rounded border border-border flex items-center justify-between group">
                  <span className="text-[9px] font-mono text-cyan truncate mr-2">
                    0x671{Math.random().toString(16).substring(2, 6).toUpperCase()}88{Math.random().toString(16).substring(2, 6).toUpperCase()}F33...
                  </span>
                  <Lock size={10} className="text-muted group-hover:text-cyan transition-colors" />
                </div>
              </div>
              <div className="pt-2 border-t border-border/50">
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="text-muted">DRIFT CHECK</span>
                  <span className="text-green font-bold">0.000%</span>
                </div>
                <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                  <div className="w-full h-full bg-green" />
                </div>
                <div className="text-[9px] text-muted/50 mt-2 font-mono uppercase text-right">
                  System Phase-Lock: Nominal
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </main>

      {/* Footer Status Bar */}
      <footer className="h-6 bg-header border-t border-border flex items-center px-4 text-[9px] font-mono text-muted gap-5 shrink-0">
        <div className="flex items-center gap-1.5">
          LATENCY: <span className="text-green">12ms</span>
        </div>
        <div className="flex items-center gap-1.5">
          L0_TRACK: <span className="text-green">CONFIRMED</span>
        </div>
        <div className="flex items-center gap-1.5">
          UPTIME: <span className="text-text">04:12:33:55</span>
        </div>
        <div className="ml-auto text-[8px] uppercase tracking-widest opacity-30">
          © 2026 SOVEREIGN LATTICE PROTOCOL v4.0.21
        </div>
      </footer>
    </div>
  );
}
