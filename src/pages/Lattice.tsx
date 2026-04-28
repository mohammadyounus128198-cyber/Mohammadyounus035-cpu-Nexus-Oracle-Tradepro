import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Line, MeshWobbleMaterial, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Panel } from '../components/Panel';
import { useTrade } from '../context/TradeContext';
import { LatticeEngine, LatticeState, PipelineStage } from '../lib/latticeEngine';
import { Activity, Shield, Cpu, Zap, Hash, Database, Layers, Terminal, Radio, Share2, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- 3D Components ---

const ConnectionLine: React.FC<{ start: [number, number, number]; end: [number, number, number]; active: boolean }> = ({ start, end, active }) => {
  return (
    <Line
      points={[start, end]}
      color={active ? "#00f0ff" : "#111"}
      lineWidth={active ? 2 : 0.2}
      transparent
      opacity={active ? 0.6 : 0.05}
    />
  );
};

const Node: React.FC<{ 
  position: [number, number, number]; 
  id: string; 
  energy: number; 
  status: string;
  onHover: (id: string | null) => void;
}> = ({ position, id, energy, status, onHover }) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.position.y = position[1] + Math.sin(time + Math.random() * 10) * 0.15;
    if (status === 'active') {
       mesh.current.scale.setScalar(1 + Math.sin(time * 5) * 0.05);
    }
  });

  const color = useMemo(() => {
    if (status === 'active') return '#00f0ff';
    if (status === 'staged') return '#ff00ff';
    if (status === 'sealed') return '#00ffaa';
    return '#1a1a1a';
  }, [status]);

  return (
    <mesh
      position={position}
      ref={mesh}
      onPointerOver={() => { setHover(true); onHover(id); }}
      onPointerOut={() => { setHover(false); onHover(null); }}
    >
      <sphereGeometry args={[0.15 * (1 + energy), 32, 32]} />
      <MeshDistortMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={hovered ? 5 : 1}
        transparent
        opacity={0.8}
        distort={0.4}
        speed={2}
      />
      {status === 'active' && (
        <pointLight intensity={2} distance={3} color="#00f0ff" />
      )}
    </mesh>
  );
};

const Scene: React.FC<{ state: LatticeState; onNodeHover: (id: string | null) => void }> = ({ state, onNodeHover }) => {
  const nodePositions = useMemo(() => {
    return state.nodes.map((n, i) => {
      const angle = (i / state.nodes.length) * Math.PI * 2;
      const radius = 6 + (i % 2 === 0 ? 0.8 : -0.8);
      return [
        Math.cos(angle) * radius,
        Math.sin(i * 0.4) * 1.5,
        Math.sin(angle) * radius
      ] as [number, number, number];
    });
  }, [state.nodes.length]);

  return (
    <>
      <OrbitControls autoRotate autoRotateSpeed={0.8} enableZoom={false} enablePan={false} />
      <ambientLight intensity={0.4} />
      <pointLight position={[15, 15, 15]} intensity={2} color="#00f0ff" />
      <pointLight position={[-15, -15, -15]} intensity={1} color="#ff00ff" />
      
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <group>
          {state.nodes.map((node, i) => (
            <React.Fragment key={node.id}>
              <Node 
                position={nodePositions[i]} 
                id={node.id} 
                energy={node.energy} 
                status={node.status}
                onHover={onNodeHover}
              />
              {node.peers.map(peerId => {
                const peerIndex = state.nodes.findIndex(n => n.id === peerId);
                if (peerIndex === -1) return null;
                return (
                  <ConnectionLine 
                    key={`${node.id}-${peerId}`}
                    start={nodePositions[i]}
                    end={nodePositions[peerIndex]}
                    active={node.status === 'active' && state.nodes[peerIndex].status === 'active'}
                  />
                );
              })}
            </React.Fragment>
          ))}
          
          <Sphere args={[2.5, 64, 64]}>
            <MeshDistortMaterial
              color="#001122"
              emissive="#00b0ff"
              emissiveIntensity={0.5}
              attach="material"
              distort={0.6}
              speed={4}
              roughness={0}
              transparent
              opacity={0.15}
            />
          </Sphere>
          
          <Sphere args={[1.2, 64, 64]}>
             <MeshWobbleMaterial
               color="#00ffff"
               emissive="#00ffff"
               emissiveIntensity={2}
               factor={0.5}
               speed={5}
             />
          </Sphere>
        </group>
      </Float>
      
      <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.15} far={10} color="#00f0ff" />
      <gridHelper args={[30, 30, '#00f0ff22', '#00000000']} position={[0, -6, 0]} />
    </>
  );
};

const Lattice: React.FC = () => {
  const [engineState, setEngineState] = useState<LatticeState | null>(null);
  const [hashes, setHashes] = useState<any>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [operatorMode, setOperatorMode] = useState<'FREE' | 'NODE' | 'ALERT' | 'PREDICT' | 'TOP-DOWN'>('FREE');
  const engine = LatticeEngine.getInstance();
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await engine.step();
      setEngineState(result.state);
      setHashes(result.hashes);
    }, 618);
    
    return () => clearInterval(interval);
  }, []);

  if (!engineState) return <div className="h-full flex items-center justify-center text-cyan animate-pulse font-mono tracking-[10px]">INITIALIZING_SOVEREIGN_LATTICE...</div>;

  const stages: PipelineStage[] = ['DECIDE', 'EXECUTE', 'VERIFY', 'SIGN', 'BROADCAST', 'SNAPSHOT'];

  return (
    <div className="h-full flex flex-col p-8 space-y-8 relative overflow-auto custom-scrollbar blueprint-grid bg-vignette">
      {/* SCANLINE EFFECT */}
      <div className="scanline" />

      {/* HEADER OVERLAY */}
      <div className="flex justify-between items-start z-10 border-b border-cyan/20 pb-6">
        <div>
           <div className="text-[10px] font-mono text-cyan/40 uppercase tracking-[5px] mb-2">Nexus.Entity_Matrix [PLATE_04]</div>
           <h1 className="text-6xl font-black tracking-tighter uppercase mb-1 text-glow-cyan leading-none">LATTICE_CORE</h1>
           <div className="flex items-center gap-6 mt-4 text-[10px] font-mono text-muted uppercase">
              <span className="flex items-center gap-2 border border-border/40 px-2 py-1"><Cpu size={12} className="text-cyan"/> TICK: {engineState.tick}</span>
              <span className="flex items-center gap-2 border border-border/40 px-2 py-1"><Activity size={12} className="text-magenta"/> ENTROPY: 0.00012 λ</span>
              <span className="flex items-center gap-2 border border-border/40 px-2 py-1"><Layers size={12} className="text-green"/> NODES: 16_ACTIVE</span>
              <span className="flex items-center gap-2 border border-border/40 px-2 py-1"><Radio size={12} className="text-orange"/> SIGNAL: GAUSSIAN_NOMINAL</span>
           </div>
        </div>
        
        <div className="flex flex-col items-end gap-4">
           <div className="flex gap-2 p-1 bg-black/40 border border-border/20 rounded-lg">
              {['FREE', 'NODE', 'ALERT', 'PREDICT', 'TOP-DOWN'].map(mode => (
                <button 
                  key={mode}
                  onClick={() => setOperatorMode(mode as any)}
                  className={`px-4 py-2 rounded text-[10px] font-black transition-all ${operatorMode === mode ? 'bg-cyan/20 text-cyan shadow-[inset_0_0_10px_rgba(0,240,255,0.2)]' : 'text-muted hover:text-white'}`}
                >
                  {mode}
                </button>
              ))}
           </div>
           <div className="text-[9px] font-mono text-muted uppercase opacity-40">
              OPERATOR_PROTOCOL: v0.96_ALPHA
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Left Side: Integrity Info */}
        <div className="col-span-3 flex flex-col gap-8">
          <Panel title="Integrity Manifest" glow="cyan-glow">
             <div className="p-6 space-y-6 font-mono">
                <HashItem label="CORE_STATE" hash={hashes?.state} />
                <HashItem label="VISUAL_PLANE" hash={hashes?.visual} />
                
                <div className="pt-6 border-t border-border/10">
                   <div className="text-[10px] text-muted mb-3 uppercase tracking-widest font-black flex justify-between items-center">
                      <span>ED25519 Sign</span>
                      <Shield size={12} className="text-green"/>
                   </div>
                   <div className="p-4 bg-black/60 rounded border border-cyan/10 text-[9px] break-all text-cyan/70 leading-relaxed font-bold">
                      {hashes?.signature || 'COMPUTING_EVP_SIGNATURE...'}
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                   <div className="bg-green/5 border border-green/20 p-2 text-center">
                      <div className="text-[8px] text-muted uppercase">Latency</div>
                      <div className="text-[10px] text-green font-bold">0.4ms</div>
                   </div>
                   <div className="bg-cyan/5 border border-cyan/20 p-2 text-center">
                      <div className="text-[8px] text-muted uppercase">Health</div>
                      <div className="text-[10px] text-cyan font-bold">100%</div>
                   </div>
                </div>
             </div>
          </Panel>

          <Panel title="Node Telemetry">
             <div className="p-6 space-y-6">
                {hoveredNode ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                     <div className="text-[10px] font-black text-cyan mb-4 flex items-center gap-2">
                        <Terminal size={14}/> TARGET_ID: {hoveredNode}
                     </div>
                     {engineState.nodes.find(n => n.id === hoveredNode) && (
                        <div className="space-y-3">
                           <MetricRow label="Energy Flux" value={(engineState.nodes.find(n => n.id === hoveredNode)!.energy * 100).toFixed(4) + '%'} color="text-cyan" />
                           <MetricRow label="Current Status" value={engineState.nodes.find(n => n.id === hoveredNode)!.status.toUpperCase()} color="text-green" />
                           <MetricRow label="Peer Count" value={engineState.nodes.find(n => n.id === hoveredNode)!.peers.length.toString()} color="text-magenta" />
                           <MetricRow label="Drift Theta" value={(Math.random() * 0.001).toFixed(6)} color="text-orange" />
                        </div>
                     )}
                  </motion.div>
                ) : (
                  <div className="text-center py-10">
                     <div className="w-12 h-12 border-2 border-dashed border-border/20 rounded-full mx-auto mb-4 animate-spin flex items-center justify-center">
                        <Box size={16} className="text-muted/20"/>
                     </div>
                     <div className="text-[10px] text-muted uppercase tracking-[3px] italic opacity-40">
                        Scan nodes for deep telemetry
                     </div>
                  </div>
                )}
             </div>
          </Panel>
        </div>

        {/* Center: 3D Visualization */}
        <div className="col-span-6 bg-black/20 border border-border/30 rounded-2xl relative overflow-hidden group shadow-[inset_0_0_100px_rgba(0,240,255,0.05)]">
           <Canvas camera={{ position: [0, 8, 15], fov: 40 }} className="w-full h-full">
              <Scene state={engineState} onNodeHover={setHoveredNode} />
           </Canvas>
           
           {/* COORDINATE OVERLAYS */}
           <div className="absolute top-6 left-6 pointer-events-none opacity-40 font-mono text-[8px] text-cyan space-y-1">
              <div>[R_X: {Math.sin(engineState.tick * 0.1).toFixed(4)}]</div>
              <div>[R_Y: {Math.cos(engineState.tick * 0.1).toFixed(4)}]</div>
              <div>[R_Z: 0.6180]</div>
           </div>

           <div className="absolute top-6 right-6 pointer-events-none opacity-40 font-mono text-[8px] text-magenta space-y-1 text-right">
              <div>SYSTEM_LOAD: {(Math.random() * 5 + 12).toFixed(2)}%</div>
              <div>NET_PRESSURE: NOMINAL</div>
           </div>
           
           {/* Stage Indicator Overlay */}
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/80 backdrop-blur-xl px-10 py-5 rounded-full border border-cyan/20 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
              {stages.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                   <div className={`w-3 h-3 rounded-full transition-all duration-500 ${engineState.stage === s ? 'bg-cyan glow-cyan animate-pulse' : (stages.indexOf(engineState.stage) > i ? 'bg-cyan/30' : 'bg-muted/10')}`} />
                   <span className={`text-[10px] font-black tracking-widest ${engineState.stage === s ? 'text-cyan' : 'text-muted/40'}`}>{s}</span>
                   {i < stages.length - 1 && <span className="text-muted/10 text-[9px] mx-1">/</span>}
                </div>
              ))}
           </div>
        </div>

        {/* Right Side: Function Stack */}
        <div className="col-span-3 flex flex-col gap-8">
           <Panel title="Command Operations" glow="lattice-glow">
              <div className="p-6 space-y-3">
                 <FunctionBtn label="STABILIZE_CORE" active icon={<Shield size={12}/>} />
                 <FunctionBtn label="BOOST_FLUX" icon={<Zap size={12}/>} />
                 <FunctionBtn label="REPLICATE_STATE" icon={<Share2 size={12}/>} />
                 <FunctionBtn label="TRACE_LINEAGE" icon={<Activity size={12}/>} />
                 <FunctionBtn label="TERMINATE_SHELL" danger icon={<Activity size={12}/>} />
              </div>
           </Panel>

           <Panel title="Runtime Event Stream" className="flex-1">
              <div className="p-6 font-mono text-[9px] space-y-3 h-full overflow-auto custom-scrollbar">
                 <AnimatePresence mode="popLayout">
                    {Array.from({length: 12}).map((_, i) => (
                       <motion.div 
                          key={engineState.tick - i}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1 - i * 0.08, y: 0 }}
                          className="flex gap-4 border-l border-border/20 pl-4 py-1"
                       >
                          <span className="text-muted/40 font-bold shrink-0">[{engineState.tick - i}]</span>
                          <span className="text-cyan/80">LATTICE_STEP_COMPLETED: 0x{Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
                       </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </Panel>
        </div>
      </div>

      {/* MATRIX SUB_PANEL AREA */}
      <div className="grid grid-cols-4 gap-8">
         {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="plate-border bg-panel/20 p-6 flex flex-col gap-4">
               <div className="flex justify-between items-center">
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">SHELL_MATRIZ_{i + 1}</div>
                  <div className="w-2 h-2 rounded-full bg-cyan/40 animate-pulse" />
               </div>
               <div className="grid grid-cols-8 gap-1 h-12 items-end">
                  {Array.from({length: 16}).map((_, j) => (
                     <div key={j} className="w-full bg-cyan/10 border-t border-cyan/30" style={{height: `${Math.random() * 100}%`}} />
                  ))}
               </div>
               <div className="text-[9px] font-mono text-muted uppercase">LOAD_PRESSURE: NOMINAL</div>
            </div>
         ))}
      </div>
    </div>
  );
};

const HashItem: React.FC<{ label: string; hash?: string }> = ({ label, hash }) => (
  <div>
    <div className="text-[10px] text-muted mb-2 flex justify-between font-black uppercase tracking-widest">
      {label}
      <span className="text-[8px] opacity-40 font-mono">CRC_MATCH_OK</span>
    </div>
    <div className="bg-black/60 p-4 rounded-lg border border-cyan/20 text-[10px] text-cyan break-all leading-relaxed font-bold shadow-[inset_0_0_15px_rgba(0,240,255,0.05)]">
       {hash ? hash.slice(0, 48) + '...' : 'PENDING_ENGINE_HASH...'}
    </div>
  </div>
);

const MetricRow: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="flex justify-between items-center text-[11px] font-mono border-b border-border/10 pb-2">
    <span className="text-muted/60 uppercase tracking-widest text-[9px] font-black">{label}</span>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

const FunctionBtn: React.FC<{ label: string; active?: boolean; danger?: boolean; icon?: React.ReactNode }> = ({ label, active, danger, icon }) => (
  <button className={`w-full py-4 px-5 rounded-xl border-2 flex items-center justify-between text-[10px] font-black tracking-[4px] transition-all group ${danger ? 'border-accent/30 text-accent hover:bg-accent/10' : (active ? 'bg-cyan/10 border-cyan/40 text-cyan hover:bg-cyan/20 glow-cyan' : 'border-border/30 text-muted/60 hover:border-cyan/40 hover:text-white')}`}>
    <span>{label}</span>
    <span className="opacity-40 group-hover:opacity-100 transition-opacity">{icon}</span>
  </button>
);

export default Lattice;
