import React, { useState } from 'react';
import { Panel } from '../components/Panel';
import { motion } from 'motion/react';
import { Compass, ExternalLink, Zap, Shield, Target } from 'lucide-react';

const COLS = 9;
const ROWS = 6;

const MapPage: React.FC = () => {
  const [selectedCell, setSelectedCell] = useState<{ x: number, y: number } | null>(null);

  return (
    <div className="h-full flex flex-col p-10 space-y-10 overflow-auto custom-scrollbar blueprint-grid bg-vignette">
       {/* SCANLINE EFFECT */}
      <div className="scanline" />

      <header className="flex justify-between items-end border-b-2 border-cyan/40 pb-8">
        <div>
          <div className="text-[10px] font-mono text-cyan/60 uppercase tracking-[4px] mb-2">Nexus.System.Map [0x05]</div>
          <h1 className="text-6xl font-black tracking-tighter text-glow-cyan uppercase leading-none">TRAVERSAL_MATRIX</h1>
          <p className="text-[11px] text-muted/60 font-mono mt-6 tracking-[5px] uppercase font-black">
            6×9 Platform Typology Matrix · Vector Path Analysis · Spatial Synchronization
          </p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10 flex-1 min-h-0">
        {/* Matrix Grid */}
        <div className="col-span-8 bg-black/60 border-2 border-cyan/10 relative p-12 flex items-center justify-center group overflow-hidden">
           <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity" />
           
           <div className="grid grid-cols-9 grid-rows-6 gap-3 w-full h-full max-w-5xl max-h-[700px] relative z-10">
              {Array.from({ length: ROWS }).map((_, y) => 
                Array.from({ length: COLS }).map((_, x) => (
                  <motion.button
                    key={`${x}-${y}`}
                    whileHover={{ scale: 1.05, zIndex: 50 }}
                    onClick={() => setSelectedCell({ x, y })}
                    className={`relative rounded border-2 transition-all duration-500 overflow-hidden group/cell ${
                      selectedCell?.x === x && selectedCell?.y === y 
                        ? 'bg-cyan border-cyan shadow-[0_0_25px_rgba(0,240,255,0.4)]' 
                        : (x === y ? 'bg-magenta/5 border-magenta/20' : 'bg-black/60 border-cyan/10 hover:border-cyan/40')
                    }`}
                  >
                     <div className={`absolute inset-0 opacity-10 ${x % 3 === 0 ? 'bg-cyan/40' : ''}`} />
                     {selectedCell?.x === x && selectedCell?.y === y && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                     )}
                     <span className={`absolute bottom-2 right-2 text-[8px] font-mono font-black ${selectedCell?.x === x && selectedCell?.y === y ? 'text-black' : 'text-cyan/20 group-hover/cell:text-cyan/40'}`}>
                        {x+1}:{y+1}
                     </span>
                  </motion.button>
                ))
              )}
           </div>
           
           {/* Matrix Axes Labels */}
           <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-around py-20 text-[10px] font-black text-cyan/20 uppercase vertical-text tracking-[8px]">
              TYPOLOGY_AXIS.COORD
           </div>
           <div className="absolute bottom-4 left-0 right-0 flex justify-around px-20 text-[10px] font-black text-cyan/20 uppercase tracking-[8px]">
              PLATFORM_TRAVERSAL_RANGE
           </div>
           
           {/* COORDINATE SCANNER DECORATION */}
           <div className="absolute top-4 right-10 flex gap-4 text-[9px] font-mono text-cyan/40 opacity-50">
              <span>SCAN_POS: {selectedCell ? `${selectedCell.x}:${selectedCell.y}` : 'WAITING'}</span>
              <span>VECTOR_STRENGTH: 99%</span>
           </div>
        </div>

        {/* Side Info Panel */}
        <div className="col-span-4 flex flex-col gap-10">
           <Panel title="Path Detail [CO-09]" glow="cyan-glow" className="flex-1">
              <div className="p-10 h-full flex flex-col">
                 {selectedCell ? (
                    <motion.div 
                       key={`${selectedCell.x}-${selectedCell.y}`}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       className="space-y-8"
                    >
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-cyan/10 border-2 border-cyan/20 rounded-2xl flex items-center justify-center text-cyan shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                             <Target size={32} />
                          </div>
                          <div>
                             <div className="text-[10px] text-cyan/40 font-black uppercase tracking-[4px]">ADDR_ID: {selectedCell.x}:{selectedCell.y}</div>
                             <h3 className="text-3xl font-black uppercase text-white tracking-widest mt-1">TYPOLOGY_{String.fromCharCode(65 + selectedCell.x)}</h3>
                          </div>
                       </div>
                       
                       <p className="text-xs text-muted/60 font-mono leading-relaxed font-black uppercase tracking-wider bg-cyan/5 p-4 border-l-2 border-cyan">
                          Coord intersection established. This node at path [{selectedCell.x}:{selectedCell.y}] controls the flow of predictive state between neighboring clusters. Synchronization required for traversal.
                       </p>
                       
                       <div className="space-y-4">
                          <div className="text-[10px] font-black uppercase tracking-[4px] text-cyan opacity-60 flex items-center gap-2">
                             <Zap size={14} /> Observed Constants
                          </div>
                          <div className="space-y-2">
                             <MappingItem label="Persistence" value="0.99984" />
                             <MappingItem label="Throughput" value="12.4 Gbps" />
                             <MappingItem label="Latency" value="1.2ms" />
                             <MappingItem label="Vector_Drift" value="+0.0003" />
                          </div>
                       </div>
                       
                       <div className="pt-10 border-t border-cyan/10">
                          <button className="w-full py-6 bg-cyan text-black text-[11px] font-black uppercase tracking-[6px] rounded-xl flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:bg-cyan/90 transition-all active:scale-95 group">
                             ACTIVATE_PATH 
                             <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
                          </button>
                       </div>
                    </motion.div>
                 ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10 gap-10">
                       <div className="relative">
                          <Compass size={120} className="animate-spin-slow" />
                          <div className="absolute inset-0 border-2 border-dashed border-cyan rounded-full animate-pulse" />
                       </div>
                       <span className="text-[12px] font-black uppercase tracking-[10px]">Select Coordinate</span>
                    </div>
                 )}
              </div>
           </Panel>

           <Panel title="Traversal History [LOG.SYNTH]" className="h-fit">
              <div className="p-8 space-y-4 max-h-[300px] overflow-auto custom-scrollbar">
                 <HistoryItem p="4:2" d="VERIFIED" />
                 <HistoryItem p="1:5" d="VERIFIED" />
                 <HistoryItem p="8:4" d="LOCKED" danger />
                 <HistoryItem p="2:3" d="VERIFIED" />
              </div>
           </Panel>
        </div>
      </div>

       {/* FOOTER PLATE */}
       <div className="mt-12 pt-8 border-t-2 border-cyan/20 flex justify-between items-start text-[10px] font-mono text-muted uppercase opacity-40 font-black tracking-[4px]">
         <div>
            Nexus_Plate_05 // Spatial_Mapping_Interface<br/>
            COORD_SYS: RHO.99 // MESH_STATUS: SYNCED
         </div>
         <div className="text-right">
            GRID_DENSITY: 6x9<br/>
            PATH_NODES: 54_ACTIVE
         </div>
      </div>
    </div>
  );
};

const MappingItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center text-[11px] font-mono border-b border-border/10 pb-1.5">
     <span className="text-muted/60">{label}</span>
     <span className="text-white font-bold">{value}</span>
  </div>
);

const HistoryItem: React.FC<{ p: string, d: string, danger?: boolean }> = ({ p, d, danger }) => (
  <div className="text-[10px] flex justify-between font-mono bg-black/20 p-2 border border-border/10 rounded">
     <span className="text-muted">ADDR_{p}</span>
     <span className={danger ? 'text-accent' : 'text-cyan'}>{d}</span>
  </div>
);

export default MapPage;
