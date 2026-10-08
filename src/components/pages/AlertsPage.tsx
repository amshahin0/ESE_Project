import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  BellRing,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  ArrowRight,
  Filter
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, markAlertRead, drillDown, t, isRtl } = useERP();

  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    return true;
  });

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <BellRing className="w-5 h-5 text-rose-400" />
            <span>{t('nav_alerts')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time threshold breaches, equipment downtime, stockouts, and work order schedule delays.
          </p>
        </div>

        {/* Severity filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Severity:</span>
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-rose-500 font-medium"
          >
            <option value="all">All Severities ({alerts.length})</option>
            <option value="critical">Critical Only</option>
            <option value="warning">Warnings Only</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
            No active alerts matching the selected filter.
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  alert.isRead ? 'bg-slate-900/50 border-slate-800 opacity-75' : 'bg-slate-900 border-slate-700'
                } ${
                  isCritical ? 'hover:border-rose-500/50' : isWarning ? 'hover:border-amber-500/50' : 'hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isCritical ? (
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                        <AlertCircle className="w-4 h-4 animate-pulse" />
                      </div>
                    ) : isWarning ? (
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                        <Info className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">
                        {isRtl ? alert.titleAr : alert.titleEn}
                      </h4>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                          isCritical
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : isWarning
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {isRtl ? alert.messageAr : alert.messageEn}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-mono">
                      <span>{alert.timestamp}</span>
                      <span>Category: {alert.category}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!alert.isRead && (
                    <button
                      onClick={() => markAlertRead(alert.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                    >
                      Acknowledge
                    </button>
                  )}

                  {alert.linkPage && (
                    <button
                      onClick={() => drillDown(alert.linkPage!)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all"
                    >
                      <span>Investigate</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
