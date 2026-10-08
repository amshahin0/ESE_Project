import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  SlidersHorizontal,
  Globe,
  Clock,
  Gauge,
  RotateCcw,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, isRtl, t, resetAllToDefault } = useERP();

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings mock state
  const [shiftsConfig, setShiftsConfig] = useState({
    shift1Start: '07:00',
    shift1End: '15:30',
    shift2Start: '15:30',
    shift2End: '23:30',
    shift3Start: '23:30',
    shift3End: '07:00'
  });

  const [oeeTargets, setOeeTargets] = useState({
    worldClassOEE: 85,
    warningOEE: 70,
    targetAvailability: 90,
    targetPerformance: 95,
    targetQuality: 98
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
          <span>{t('nav_settings')}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          System localization, working shift hours, OEE benchmark thresholds, and ERP operational parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Localization & Language */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Language & Layout (Bilingual RTL Support)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                language === 'en'
                  ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-md'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-left">
                <div className="font-bold text-sm">English (LTR)</div>
                <div className="text-xs text-slate-400 mt-0.5">Default manufacturing terminology</div>
              </div>
              {language === 'en' && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
            </button>

            <button
              type="button"
              onClick={() => setLanguage('ar')}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                language === 'ar'
                  ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-md'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-right w-full pr-2">
                <div className="font-bold text-sm font-sans">العربية (RTL)</div>
                <div className="text-xs text-slate-400 mt-0.5 font-sans">دعم كامل لليمين لليسار ومصطلحات المصانع</div>
              </div>
              {language === 'ar' && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
            </button>
          </div>
        </div>

        {/* 2. Shift Windows Configuration */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Factory Shift Operational Windows (3 Shifts / 24h)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <div className="text-xs font-bold text-slate-200 mb-2">Shift 1 (Morning)</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">Start</span>
                  <input
                    type="time"
                    value={shiftsConfig.shift1Start}
                    onChange={e => setShiftsConfig({ ...shiftsConfig, shift1Start: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">End</span>
                  <input
                    type="time"
                    value={shiftsConfig.shift1End}
                    onChange={e => setShiftsConfig({ ...shiftsConfig, shift1End: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <div className="text-xs font-bold text-slate-200 mb-2">Shift 2 (Evening)</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">Start</span>
                  <input
                    type="time"
                    value={shiftsConfig.shift2Start}
                    onChange={e => setShiftsConfig({ ...shiftsConfig, shift2Start: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">End</span>
                  <input
                    type="time"
                    value={shiftsConfig.shift2End}
                    onChange={e => setShiftsConfig({ ...shiftsConfig, shift2End: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <div className="text-xs font-bold text-slate-200 mb-2">Shift 3 (Night)</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">Start</span>
                  <input
                    type="time"
                    value={shiftsConfig.shift3Start}
                    onChange={e => setShiftsConfig({ ...shiftsConfig, shift3Start: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">End</span>
                  <input
                    type="time"
                    value={shiftsConfig.shift3End}
                    onChange={e => setShiftsConfig({ ...shiftsConfig, shift3End: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. OEE Thresholds */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <span>OEE Target Thresholds & Status Color Triggers</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">World Class OEE (%)</label>
              <input
                type="number"
                value={oeeTargets.worldClassOEE}
                onChange={e => setOeeTargets({ ...oeeTargets, worldClassOEE: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-emerald-400 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Warning Threshold (%)</label>
              <input
                type="number"
                value={oeeTargets.warningOEE}
                onChange={e => setOeeTargets({ ...oeeTargets, warningOEE: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-amber-400 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Availability Goal (%)</label>
              <input
                type="number"
                value={oeeTargets.targetAvailability}
                onChange={e => setOeeTargets({ ...oeeTargets, targetAvailability: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-cyan-400 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Quality Goal (%)</label>
              <input
                type="number"
                value={oeeTargets.targetQuality}
                onChange={e => setOeeTargets({ ...oeeTargets, targetQuality: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Save & Reset Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={resetAllToDefault}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Mock Data to Default</span>
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings saved successfully!</span>
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all"
            >
              {t('save')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
