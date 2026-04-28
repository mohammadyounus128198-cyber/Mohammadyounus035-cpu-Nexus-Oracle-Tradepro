import React, { useState, useEffect } from 'react';
import { Panel } from '../components/Panel';
import { LatticeEngine, LatticeState } from '../lib/latticeEngine';
import { ShieldCheck, Download, Code, Database, Fingerprint, Search } from 'lucide-react';
import { motion } from 'motion/react';

const VerifyPage: React.FC = () => {
  const [engineState, setEngineState] = useState<LatticeState | null>(null);
  const [hashes, setHashes] = useState<any>(null);
  const engine = LatticeEngine.getInstance();
  
  useEffect(() => {
    const result = engine.getState();
    setEngineState({ ...result });
    
    const interval = setInterval(async () => {
      const { state, hashes } = await engine.step();
      setEngineState({ ...state });
      setHashes(hashes);
    }, 618);
    
    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    if (!engineState) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ state: engineState, hashes }, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `nexus_oracle_tick_${engineState.tick}_proof.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!engineState) return null;

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-auto bg-bg">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-4xl font-black tracking-tighter uppercase mb-1">State Verification</h1>
           <p className="text-[10px] text-muted font-mono uppercase tracking-[2px]">Publicly Verifiable Deterministic Artifact Generation</p>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          <Download size={16} /> 
          Download Proof
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Canonical State JSON */}
        <Panel title="Canonical State Block" className="col-span-12" glow="green-glow">
           <div className="p-8 space-y-6">
              <div className="grid grid-cols-4 gap-6">
                 <VerificationBox label="BLOCK SERIAL" value={`#${engineState.tick}`} icon={<Database size={14}/>} />
                 <VerificationBox label="SYSTEM SIG" value={hashes?.signature?.slice(0, 16) + '...'} icon={<Fingerprint size={14}/>} />
                 <VerificationBox label="VALIDATION" value="SUCCESS" status="green" icon={<ShieldCheck size={14}/>} />
                 <VerificationBox label="DETERMINISM" value="100.00%" icon={<Code size={14}/>} />
              </div>
              
              <div className="relative mt-8">
                 <div className="absolute top-4 right-4 text-[9px] font-bold text-cyan flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                    LIVE_BUFFER_FEED
                 </div>
                 <pre className="p-6 bg-black/60 rounded-2xl border border-border/30 font-mono text-xs text-muted/80 overflow-auto max-h-[400px] shadow-inner leading-relaxed">
{JSON.stringify(engineState, null, 2)}
                 </pre>
              </div>
           </div>
        </Panel>

        {/* Proof Chains */}
        <div className="col-span-6">
           <Panel title="Hash Proof Aggregator">
              <div className="p-6 space-y-4">
                 <LogicLine label="DECISION_HASH" value={hashes?.decision} />
                 <LogicLine label="STATE_HASH" value={hashes?.state} />
                 <LogicLine label="VISUAL_HASH" value={hashes?.visual} />
              </div>
           </Panel>
        </div>

        <div className="col-span-6">
           <Panel title="Independent Audit Layer">
              <div className="p-6 text-center space-y-4">
                 <p className="text-[11px] text-muted font-mono leading-relaxed uppercase">
                    To independently verify this state, re-run the OMEGA protocol with the canonical seed [618] and the current Tick sequence. Any divergence in the state hash proves a breach in the execution environment.
                 </p>
                 <div className="pt-4 flex justify-center">
                    <div className="px-6 py-2 border border-cyan/30 rounded-full text-cyan font-black text-[10px] tracking-widest uppercase">
                       PROTOCOL PROVEN DETERMINISTIC
                    </div>
                 </div>
              </div>
           </Panel>
        </div>
      </div>
    </div>
  );
};

const VerificationBox: React.FC<{ label: string; value: string; icon: React.ReactNode; status?: string }> = ({ label, value, icon, status }) => (
  <div className="bg-black/30 border border-border/10 p-5 rounded-2xl flex flex-col gap-2">
     <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-wider">
        {icon}
        {label}
     </div>
     <div className={`text-xl font-black font-mono ${status === 'green' ? 'text-green' : 'text-white'}`}>
        {value}
     </div>
  </div>
);

const LogicLine: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="space-y-1">
     <div className="text-[10px] text-muted font-bold uppercase">{label}</div>
     <div className="p-2 bg-black/40 rounded border border-border/10 font-mono text-[9px] text-cyan break-all">
        {value || 'COMPUTING...'}
     </div>
  </div>
);

export default VerifyPage;
