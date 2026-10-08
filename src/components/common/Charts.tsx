import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';

// 1. OEE Radial Speedometer Gauge
interface OEEGaugeProps {
  score: number;
  label: string;
  availability: number;
  performance: number;
  quality: number;
}

export const OEEGauge: React.FC<OEEGaugeProps> = ({
  score,
  label,
  availability,
  performance,
  quality
}) => {
  const radius = 64;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 85) return '#10b981'; // Green (World class >= 85%)
    if (val >= 70) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose/Red
  };

  const mainColor = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/80 rounded-xl border border-slate-800">
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          {/* Track */}
          <circle
            stroke="#1e293b"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress */}
          <circle
            stroke={mainColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black font-mono text-white tracking-tight">
            {score.toFixed(1)}%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </span>
        </div>
      </div>

      {/* 3 Pillars Sub-metrics */}
      <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-3 border-t border-slate-800 text-center text-xs">
        <div>
          <div className="text-[10px] text-slate-400 font-medium">Availability</div>
          <div className="font-mono font-bold text-slate-200">{availability.toFixed(1)}%</div>
          <div className="w-full bg-slate-800 h-1 rounded mt-1 overflow-hidden">
            <div className="bg-cyan-500 h-full rounded" style={{ width: `${availability}%` }} />
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 font-medium">Performance</div>
          <div className="font-mono font-bold text-slate-200">{performance.toFixed(1)}%</div>
          <div className="w-full bg-slate-800 h-1 rounded mt-1 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded" style={{ width: `${performance}%` }} />
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 font-medium">Quality</div>
          <div className="font-mono font-bold text-slate-200">{quality.toFixed(1)}%</div>
          <div className="w-full bg-slate-800 h-1 rounded mt-1 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded" style={{ width: `${quality}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Production vs Plan Comparison Bar Chart
interface ProdVsPlanProps {
  data: {
    label: string;
    planned: number;
    produced: number;
    good: number;
    scrap: number;
  }[];
}

export const ProductionVsPlanChart: React.FC<ProdVsPlanProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data.length) {
    return <div className="text-xs text-slate-500 py-8 text-center">No production records found</div>;
  }

  const maxVal = Math.max(...data.map(d => Math.max(d.planned, d.produced)), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-slate-700" /> Planned
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-cyan-500" /> Produced
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500" /> Good Qty
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-rose-500" /> Scrap
        </span>
      </div>

      <div className="space-y-3">
        {data.map((item, idx) => {
          const plannedPct = (item.planned / maxVal) * 100;
          const producedPct = (item.produced / maxVal) * 100;
          const achievement = item.planned > 0 ? (item.produced / item.planned) * 100 : 0;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-200">{item.label}</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {achievement.toFixed(1)}% Achieved
                </span>
              </div>

              {/* Bar 1: Planned */}
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-1">
                <span className="w-16 shrink-0 text-slate-400">Plan:</span>
                <div className="flex-1 bg-slate-900 h-2.5 rounded overflow-hidden">
                  <div
                    className="bg-slate-600 h-full rounded transition-all duration-500"
                    style={{ width: `${plannedPct}%` }}
                  />
                </div>
                <span className="w-16 text-right font-medium text-slate-300">
                  {item.planned.toLocaleString()}
                </span>
              </div>

              {/* Bar 2: Actual Good & Scrap Stack */}
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span className="w-16 shrink-0 text-cyan-400">Actual:</span>
                <div className="flex-1 bg-slate-900 h-3 rounded overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${(item.good / maxVal) * 100}%` }}
                    title={`Good: ${item.good}`}
                  />
                  <div
                    className="bg-rose-500 h-full transition-all duration-500"
                    style={{ width: `${(item.scrap / maxVal) * 100}%` }}
                    title={`Scrap: ${item.scrap}`}
                  />
                </div>
                <span className="w-16 text-right font-bold text-white">
                  {item.produced.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 3. Pareto Downtime Category Chart
interface DowntimeParetoProps {
  categories: {
    category: string;
    minutes: number;
    count: number;
  }[];
}

export const DowntimeParetoChart: React.FC<DowntimeParetoProps> = ({ categories }) => {
  if (!categories.length) {
    return <div className="text-xs text-slate-500 py-8 text-center">No downtime incidents recorded</div>;
  }

  // Sort descending
  const sorted = [...categories].sort((a, b) => b.minutes - a.minutes);
  const totalMinutes = sorted.reduce((acc, c) => acc + c.minutes, 0);

  let cumulative = 0;
  const paretoData = sorted.map(c => {
    cumulative += c.minutes;
    const cumulativePct = totalMinutes > 0 ? (cumulative / totalMinutes) * 100 : 0;
    return {
      ...c,
      pctOfTotal: totalMinutes > 0 ? (c.minutes / totalMinutes) * 100 : 0,
      cumulativePct
    };
  });

  const maxMin = Math.max(...sorted.map(s => s.minutes), 1);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800">
        <span>Reason Category</span>
        <span>Duration / Cumul. %</span>
      </div>

      <div className="space-y-2.5">
        {paretoData.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                {item.category} ({item.count} events)
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-amber-400">
                  {(item.minutes / 60).toFixed(1)}h ({item.minutes}m)
                </span>
                <span className="text-slate-400 text-[10px]">
                  ({item.cumulativePct.toFixed(0)}% cum.)
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex relative">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(item.minutes / maxMin) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Machine OEE Ranking Bar Chart
interface MachineOEERankProps {
  machines: {
    id: string;
    code: string;
    name: string;
    oee: number;
    status: string;
  }[];
  title?: string;
}

export const MachineOEERankChart: React.FC<MachineOEERankProps> = ({ machines, title }) => {
  // Sort ascending for lowest OEE or descending
  const sorted = [...machines].sort((a, b) => a.oee - b.oee);

  const getBarColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-2.5">
      {sorted.map(m => (
        <div key={m.id} className="p-2 rounded-lg bg-slate-800/40 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-mono text-[11px] text-cyan-400 font-bold">{m.code}</span>
              <span className="text-slate-300 font-medium truncate">{m.name}</span>
            </div>
            <span className="font-mono font-bold text-white ml-2">{m.oee.toFixed(1)}%</span>
          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(m.oee)}`}
              style={{ width: `${Math.min(100, m.oee)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
