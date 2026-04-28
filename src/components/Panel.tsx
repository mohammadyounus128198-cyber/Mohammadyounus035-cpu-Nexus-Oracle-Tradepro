import React from 'react';

interface PanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  glow?: string;
  headerAction?: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({ 
  title, 
  children, 
  className = "", 
  glow = "lattice-glow",
  headerAction
}) => (
  <div className={`bg-panel/80 border border-border/50 rounded-xl overflow-hidden flex flex-col shadow-2xl relative group backdrop-blur-md ${glow} ${className}`}>
    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    <div className="px-5 py-4 border-b border-border/50 flex justify-between items-center bg-black/20 backdrop-blur-sm z-10">
      <h3 className="text-[11px] font-black uppercase tracking-[2px] text-accent flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        {title}
      </h3>
      {headerAction ? headerAction : <div className="w-10 h-[1px] bg-border/50" />}
    </div>
    <div className="flex-1 overflow-auto z-10">
      {children}
    </div>
  </div>
);

export const MetricCard: React.FC<{ label: string; value: string | number; unit?: string; icon?: React.ReactNode; trend?: number }> = ({ label, value, unit, icon, trend }) => (
  <div className="bg-panel border border-border/50 rounded-xl p-5 shadow-lg group hover:border-accent/30 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest">
        {icon}
        {label}
      </div>
      {trend !== undefined && (
        <div className={`text-[10px] font-bold flex items-center ${trend >= 0 ? 'text-green' : 'text-accent'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-black tracking-tighter">{value}</span>
      {unit && <span className="text-[10px] font-bold text-muted/60 uppercase">{unit}</span>}
    </div>
  </div>
);
