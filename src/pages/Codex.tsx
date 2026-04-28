import React from 'react';
import { Panel } from '../components/Panel';
import { Shield, Book, Terminal, Code, Cpu, Locke, Zap } from 'lucide-react';

const Codex: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-10 space-y-10 overflow-auto custom-scrollbar blueprint-grid bg-vignette">
       {/* SCANLINE EFFECT */}
       <div className="scanline" />

      <header className="flex justify-between items-end border-b-2 border-cyan/40 pb-8">
        <div>
          <div className="text-[10px] font-mono text-cyan/60 uppercase tracking-[4px] mb-2">Nexus.System.Codex [0x06]</div>
          <h1 className="text-6xl font-black tracking-tighter text-glow-cyan uppercase leading-none">SYSTEM_LOGIC_CODEX</h1>
          <p className="text-[11px] text-muted/60 font-mono mt-6 tracking-[5px] uppercase font-black">
             L4 Protection · Logic Invariants · Protocol Documentation · Canonical Schema
          </p>
        </div>
        <div className="text-right">
           <div className="text-[10px] font-mono text-cyan/40 font-black uppercase tracking-[3px] mb-2">AUTH_TOKEN: OMEGA</div>
           <Shield size={32} className="text-cyan ml-auto filter drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]" />
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        {/* Core Protocol */}
        <div className="col-span-8 space-y-10">
           <Panel title="Engineering Mappings [PROTOCOL_PHI]" glow="cyan-glow">
              <div className="p-10 space-y-12">
                 <LogicBlock 
                    title="DECISION SEEDING [Φ_CANONICAL]" 
                    code="seed = (prev_hash * 1.61803) % uint256;"
                    mapping="Maps physical clock ticks to deterministic pseudo-random sequences for lattice initialization. Enforces causality."
                 />
                 <LogicBlock 
                    title="TRIPLE-CORE VALIDATION [SYNC_GATE]" 
                    code="assert(sha256(decision) && sha256(state) && sha256(visual));"
                    mapping="Enforces triple-redundancy check before signing state snapshots. Any divergence triggers an immediate WORLD_DRIFT failsafe."
                 />
                 <LogicBlock 
                    title="ENVELOPE CANON [X-LAYER]" 
                    code="envelope = { payload, proof, signature, metadata_hash };"
                    mapping="Canonical data structure for inter-node communication. Proof must match current lattice topology or be discarded."
                 />
                 <LogicBlock 
                    title="RECURSIVE DRIFT_CORRECTION" 
                    code="correction = ∫(observed - target) dt * signal_gain;"
                    mapping="Automatic entropy suppression algorithm that maintains lattice stability across high-frequency volatility events."
                 />
              </div>
           </Panel>

           <Panel title="System Invariants [BLUEPRINT_S]">
              <div className="p-8 grid grid-cols-2 gap-6">
                 <InvariantItem label="Memory Safety" value="POINTER_ISOLATION_ACTIVE" status="READY" />
                 <InvariantItem label="Clock Drift" value="MAX_TOLERANCE_1MS" status="NOMINAL" />
                 <InvariantItem label="Replay Guard" value="NONCE_CHECK_ENABLED" status="ACTIVE" />
                 <InvariantItem label="Lattice Sync" value="PHI_ENFORCED_V3" status="SECURE" />
                 <InvariantItem label="Kernel Lock" value="HARDWARE_LEVEL_0" status="ACTIVE" />
                 <InvariantItem label="Identity Mesh" value="ECC_P521_ACTIVE" status="VERIFIED" />
              </div>
           </Panel>
        </div>

        {/* Sidebar: Function Mappings */}
        <div className="col-span-4 space-y-10">
           <Panel title="L4 Protection Functions [STACK_01]">
              <div className="p-8 space-y-6">
                 <FunctionMap label="STABILIZE" desc="Injects negative entropy to counter chaotic drift and maintain node harmony." icon={<Zap size={14}/>} />
                 <FunctionMap label="BOOST" desc="Amplifies signal confidence through multi-node consensus to reach peak threshold." icon={<TrendingUp size={14}/>}/>
                 <FunctionMap label="SIMULATE" desc="Branches current state into 2^32 parallel outcome vectors for risk assessment." icon={<Cpu size={14}/>}/>
                 <FunctionMap label="TRACE" desc="Recursively follows data lineage back to genesis block for total transparency." icon={<Terminal size={14}/>}/>
                 <FunctionMap label="ENFORCE" desc="Imposes strict schema constraints on all incoming mutation packets." icon={<Shield size={14}/>}/>
                 <FunctionMap label="LOCK" desc="Emergency halt on all mutation gates to prevent catastrophic failures." danger icon={<ShieldAlert size={14}/>}/>
              </div>
           </Panel>
           
           <div className="p-10 bg-cyan/10 border-2 border-cyan/40 relative overflow-hidden group">
              <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity" />
              <div className="flex items-center gap-4 mb-6 text-cyan">
                 <Shield size={32} className="text-glow-cyan animate-pulse"/>
                 <span className="font-black uppercase tracking-[6px] text-sm">OMEGA_INTEGRITY</span>
              </div>
              <p className="text-[11px] leading-relaxed text-white font-mono uppercase font-black tracking-widest relative z-10">
                 The OMEGA layer is a deterministic execution environment where all state transitions are publicly verifiable and cryptographically sound. No mutation shall occur without a valid PHI constant.
              </p>
           </div>
           
           <div className="p-8 bg-black/40 border border-cyan/10 flex flex-col gap-4">
              <div className="text-[10px] font-black text-muted/40 uppercase tracking-[4px]">System_Metadata</div>
              <div className="space-y-2">
                 <div className="flex justify-between text-[9px] font-mono"><span className="opacity-40">SCHEMA_VER:</span> <span>9.1.4-OMEGA</span></div>
                 <div className="flex justify-between text-[9px] font-mono"><span className="opacity-40">BLUEPRINT_HASH:</span> <span>8FB4...AA22</span></div>
                 <div className="flex justify-between text-[9px] font-mono"><span className="opacity-40">DEPLOY_STATE:</span> <span className="text-green">CANONICAL</span></div>
              </div>
           </div>
        </div>
      </div>

       {/* FOOTER PLATE */}
       <div className="mt-12 pt-8 border-t-2 border-cyan/20 flex justify-between items-start text-[10px] font-mono text-muted uppercase opacity-40 font-black tracking-[4px]">
         <div>
            Nexus_Plate_06 // Logic_System_Documentation<br/>
            SOURCE: CORE_ENGINE // ACCESS: SOVEREIGN
         </div>
         <div className="text-right">
            DOC_REV: 172.A<br/>
            VERIFICATION_REQ: PHI_CONSTANT
         </div>
      </div>
    </div>
  );
};

const FunctionMap: React.FC<{ label: string; desc: string; icon?: React.ReactNode; danger?: boolean }> = ({ label, desc, icon, danger }) => (
  <div className="group cursor-default hover:bg-white/5 p-2 transition-all border-l-2 border-transparent hover:border-l-cyan">
     <div className={`text-[12px] font-black tracking-[3px] mb-2 flex items-center gap-2 ${danger ? 'text-accent text-glow-red' : 'text-cyan text-glow-cyan'}`}>
        {icon}
        {label}
     </div>
     <p className="text-[10px] text-muted/60 leading-snug font-mono uppercase font-black tracking-widest pl-6">{desc}</p>
  </div>
);

const LogicBlock: React.FC<{ title: string; code: string; mapping: string }> = ({ title, code, mapping }) => (
  <div className="space-y-4">
     <h4 className="text-xs font-black uppercase text-cyan flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-cyan rounded-full" />
        {title}
     </h4>
     <div className="p-4 bg-black/60 rounded-xl border border-border/30 font-mono text-sm shadow-inner group transition-all hover:bg-black/80">
        <code className="text-muted/80 group-hover:text-cyan transition-colors">{code}</code>
     </div>
     <p className="text-[10px] text-muted font-mono leading-relaxed pl-3 border-l border-cyan/30">
        {mapping}
     </p>
  </div>
);

const InvariantItem: React.FC<{ label: string; value: string; status: string }> = ({ label, value, status }) => (
  <div className="p-3 bg-panel/30 border border-border/10 rounded-lg flex flex-col gap-1">
     <div className="text-[8px] text-muted font-bold uppercase">{label}</div>
     <div className="text-[10px] font-bold text-white/90">{value}</div>
     <div className="text-[8px] font-bold text-green mt-1">{status}</div>
  </div>
);

export default Codex;
