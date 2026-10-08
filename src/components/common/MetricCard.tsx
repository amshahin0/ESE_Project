import React from 'react';
import { useERP } from '../../context/ERPContext';
import { ArrowUpRight, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'good' | 'warning' | 'critical' | 'neutral';
  targetPage?: string;
  filterOverrides?: Record<string, string>;
  icon?: React.ComponentType<{ className?: string }>;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  trend,
  trendValue,
  status = 'neutral',
  targetPage,
  filterOverrides,
  icon: Icon
}) => {
  const { drillDown, isRtl, t } = useERP();

  const getStatusStyles = () => {
    switch (status) {
      case 'good':
        return {
          border: 'border-emerald-500/30 hover:border-emerald-500/50',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          glow: 'from-emerald-500/10 to-transparent',
          indicator: 'bg-emerald-500'
        };
      case 'warning':
        return {
          border: 'border-amber-500/30 hover:border-amber-500/50',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          glow: 'from-amber-500/10 to-transparent',
          indicator: 'bg-amber-500'
        };
      case 'critical':
        return {
          border: 'border-rose-500/30 hover:border-rose-500/50',
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          glow: 'from-rose-500/10 to-transparent',
          indicator: 'bg-rose-500'
        };
      default:
        return {
          border: 'border-slate-800 hover:border-cyan-500/40',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          glow: 'from-cyan-500/5 to-transparent',
          indicator: 'bg-cyan-500'
        };
    }
  };

  const styles = getStatusStyles();

  const handleCardClick = () => {
    if (targetPage) {
      drillDown(targetPage, filterOverrides);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative overflow-hidden rounded-xl bg-slate-900/90 backdrop-blur border p-4 transition-all duration-200 print-card ${styles.border} ${
        targetPage ? 'cursor-pointer hover:shadow-lg hover:shadow-cyan-950/30 hover:-translate-y-0.5' : ''
      }`}
    >
      {/* Background radial gradient accent */}
      <div className={`absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-gradient-to-br ${styles.glow} blur-xl pointer-events-none`} />

      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${styles.indicator}`} />
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide truncate max-w-[190px]">
            {title}
          </h4>
        </div>

        {targetPage && (
          <span
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-slate-800 text-cyan-400 hover:bg-slate-700"
            title={t('drilldownRecords')}
          >
            <ArrowUpRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-[-90deg]' : ''}`} />
          </span>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="font-extrabold text-2xl lg:text-3xl text-white tracking-tight font-mono">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-xs font-medium text-slate-400">{unit}</span>}
      </div>

      {/* Bottom Subtitle / Trend */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
        {subtitle && (
          <span className="text-slate-400 truncate text-[11px]">{subtitle}</span>
        )}

        {trendValue && (
          <div className="flex items-center gap-1 font-mono text-[11px] shrink-0 ml-auto">
            {trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3 text-rose-400" />}
            {trend === 'neutral' && <Minus className="w-3 h-3 text-slate-400" />}
            <span
              className={
                trend === 'up'
                  ? 'text-emerald-400'
                  : trend === 'down'
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }
            >
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
