import { useState } from 'react';
import FanChart from './FanChart';
import HistogramChart from './HistogramChart';
import RiskBreakdown from './RiskBreakdown';
import AIExplanation from './AIExplanation';

export default function ResultsDashboard({ results, explanation, horizon, onReset, onModify }) {
  const { summaryStats, fanChartData, histogramData, riskContributions, percentiles } = results;
  const [activeTab, setActiveTab] = useState('all'); // all, charts, risk, synthesis

  const formatMoney = (val) => {
    if (val == null || isNaN(val)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const negPercent = summaryStats?.negativeNetWorthPercent ?? 0;
  const underStartPercent = summaryStats?.lessThanStartingPercent ?? 0;
  const medianNetWorth = summaryStats?.median ?? 0;
  const startNetWorth = summaryStats?.startingNetWorth ?? 15000;
  const netDelta = medianNetWorth - startNetWorth;

  const getRuinRiskTier = (p) => {
    if (p < 2) return { label: 'Low Risk (<2%)', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60' };
    if (p < 8) return { label: 'Moderate Risk (2-8%)', color: 'text-yellow-400 bg-yellow-950/80 border-yellow-800/60' };
    return { label: 'High Insolvency Risk (>8%)', color: 'text-rose-400 bg-rose-950/80 border-rose-800/60' };
  };

  const riskTier = getRuinRiskTier(negPercent);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="fintech-card rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Monte Carlo Analysis Complete
            </span>
            <span className="text-slate-600 text-xs">|</span>
            <span className="text-[11px] font-mono text-slate-400">
              {(summaryStats?.totalSimulations || 10000).toLocaleString()} Timelines over {horizon} Years
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight mt-1">
            Stochastic Outcome Distribution
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onModify}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            Adjust Parameters
          </button>
          <button
            onClick={onReset}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
          >
            New Scenario
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Median Final Net Worth */}
        <div className="fintech-card rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                Median Outcome (50th %ile)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                P50
              </span>
            </div>
            <div className={`text-2xl sm:text-3xl font-mono font-bold tracking-tight mt-2 tabular-nums ${medianNetWorth >= 0 ? 'text-white' : 'text-rose-400'}`}>
              {formatMoney(medianNetWorth)}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between">
            <span>Net Growth vs Start:</span>
            <span className={`font-mono font-semibold ${netDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netDelta >= 0 ? '+' : ''}{formatMoney(netDelta)}
            </span>
          </div>
        </div>

        {/* Probability of Negative Net Worth */}
        <div className="fintech-card rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                Risk of Insolvency
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${riskTier.color}`}>
                {riskTier.label.split(' ')[0]}
              </span>
            </div>
            <div className={`text-2xl sm:text-3xl font-mono font-bold tracking-tight mt-2 tabular-nums ${negPercent === 0 ? 'text-emerald-400' : negPercent < 5 ? 'text-yellow-400' : 'text-rose-400'}`}>
              {negPercent.toFixed(1)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between">
            <span>Under Initial Savings:</span>
            <span className="font-mono text-slate-300 font-semibold">{underStartPercent.toFixed(1)}% of runs</span>
          </div>
        </div>

        {/* Downside 10th Percentile */}
        <div className="fintech-card rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                Downside Tail (10th %ile)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                P10
              </span>
            </div>
            <div className={`text-2xl sm:text-3xl font-mono font-bold tracking-tight mt-2 tabular-nums ${(percentiles?.p10 ?? 0) >= 0 ? 'text-slate-200' : 'text-rose-400'}`}>
              {formatMoney(percentiles?.p10)}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 mt-3">
            <span>1 in 10 chance outcome is lower</span>
          </div>
        </div>

        {/* Upside 90th Percentile */}
        <div className="fintech-card rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                Upside Potential (90th %ile)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                P90
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight mt-2 tabular-nums text-emerald-400">
              {formatMoney(percentiles?.p90)}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 mt-3">
            <span>1 in 10 chance outcome is higher</span>
          </div>
        </div>

      </div>

      {/* Primary Visualizations */}
      <div className="space-y-6">
        {/* Fan Chart: Trajectory Bands Over Time */}
        <div className="fintech-card rounded-xl p-5 sm:p-6 border border-slate-800">
          <FanChart data={fanChartData || []} />
        </div>

        {/* Two-Column Grid: Histogram & Risk Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="fintech-card rounded-xl p-5 sm:p-6 border border-slate-800">
            <HistogramChart data={histogramData || []} percentiles={percentiles} />
          </div>
          <div className="fintech-card rounded-xl p-5 sm:p-6 border border-slate-800">
            <RiskBreakdown data={riskContributions || []} />
          </div>
        </div>
      </div>

      {/* Executive Strategic Synthesis / Advisory Briefing */}
      <AIExplanation explanation={explanation} />

      {/* Footer Navigation */}
      <div className="fintech-card-subtle rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
        <div>
          <span>Algorithm: Box-Muller Gaussian & Lognormal Monte Carlo · </span>
          <span className="text-slate-500">Seed: Deterministic Random State</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="hover:text-slate-200 underline cursor-pointer"
          >
            Export / Print PDF
          </button>
          <span>·</span>
          <button
            onClick={onReset}
            className="text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            Run Another Model →
          </button>
        </div>
      </div>
    </div>
  );
}
