import FanChart from './FanChart';
import HistogramChart from './HistogramChart';
import RiskBreakdown from './RiskBreakdown';
import AIExplanation from './AIExplanation';

export default function ResultsDashboard({ results, explanation, horizon, onReset, onModify }) {
  const { summaryStats, fanChartData, histogramData, riskContributions, percentiles } = results;

  const formatMoney = (val) => {
    if (val == null || isNaN(val)) return '$0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const negPercent = summaryStats?.negativeNetWorthPercent ?? 0;
  const medianNW = summaryStats?.median ?? 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="border-b border-[#e7e5e4] pb-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-500 font-semibold">
              Step 03 / Stochastic Projection Results
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-paper-200 text-ink-700 rounded">
              {(summaryStats?.totalSimulations || 10000).toLocaleString()} Timelines
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-ink-950 mt-1 font-normal tracking-tight">
            Decision Risk & Trajectory Assessment
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onModify}
            className="px-3.5 py-1.5 text-xs font-mono text-ink-700 bg-white hover:bg-paper-100 border border-paper-400/80 rounded transition-colors cursor-pointer"
          >
            Adjust Assumptions
          </button>
          <button
            onClick={onReset}
            className="px-3.5 py-1.5 text-xs font-mono text-ink-700 bg-paper-100 hover:bg-paper-200 border border-paper-400/80 rounded transition-colors cursor-pointer"
          >
            New Scenario
          </button>
        </div>
      </div>

      {/* KPI Ledger Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Median Expected Value */}
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#e5e2da] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-ink-500 uppercase tracking-wider">
            <span>Expected Base Case</span>
            <span className="text-ink-400">50th %ile</span>
          </div>
          <div className={`text-2xl sm:text-3xl font-mono font-semibold tabular-nums mt-3 ${medianNW >= 0 ? 'text-ink-950' : 'text-crimson-600'}`}>
            {formatMoney(medianNW)}
          </div>
          <p className="text-[11px] text-ink-500 mt-2 font-sans">
            Median terminal net worth at Year {horizon}
          </p>
        </div>

        {/* Probability of Ruin */}
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#e5e2da] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-ink-500 uppercase tracking-wider">
            <span>Capital Ruin Risk</span>
            <span className="text-ink-400">&lt; $0</span>
          </div>
          <div className={`text-2xl sm:text-3xl font-mono font-semibold tabular-nums mt-3 ${negPercent < 5 ? 'text-emerald-600' : negPercent < 20 ? 'text-amber-600' : 'text-crimson-600'}`}>
            {negPercent.toFixed(1)}%
          </div>
          <p className="text-[11px] text-ink-500 mt-2 font-sans">
            Chance of reaching negative net worth
          </p>
        </div>

        {/* Downside 10th Percentile */}
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#e5e2da] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-ink-500 uppercase tracking-wider">
            <span>Tail Downside Floor</span>
            <span className="text-ink-400">10th %ile</span>
          </div>
          <div className={`text-xl sm:text-2xl font-mono font-semibold tabular-nums mt-3 ${(percentiles?.p10 ?? 0) >= 0 ? 'text-ink-800' : 'text-crimson-600'}`}>
            {formatMoney(percentiles?.p10)}
          </div>
          <p className="text-[11px] text-ink-500 mt-2 font-sans">
            1 in 10 chance of outcome at or below this level
          </p>
        </div>

        {/* Upside 90th Percentile */}
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#e5e2da] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-ink-500 uppercase tracking-wider">
            <span>Upside Potential</span>
            <span className="text-ink-400">90th %ile</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-semibold tabular-nums mt-3 text-ink-800">
            {formatMoney(percentiles?.p90)}
          </div>
          <p className="text-[11px] text-ink-500 mt-2 font-sans">
            1 in 10 chance of outcome reaching this ceiling
          </p>
        </div>
      </div>

      {/* Fan Chart Container */}
      <div className="bg-white rounded-lg border border-[#e5e2da] shadow-xs overflow-hidden">
        <FanChart data={fanChartData || []} />
      </div>

      {/* 2-Column Section: Histogram & Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-[#e5e2da] shadow-xs overflow-hidden">
          <HistogramChart data={histogramData || []} percentiles={percentiles} />
        </div>
        <div className="bg-white rounded-lg border border-[#e5e2da] shadow-xs overflow-hidden">
          <RiskBreakdown data={riskContributions || []} />
        </div>
      </div>

      {/* Executive Strategic Briefing */}
      <AIExplanation explanation={explanation} />

      {/* Institutional Action Footer */}
      <div className="pt-4 pb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={onModify}
          className="w-full sm:w-auto px-6 py-2.5 bg-white border border-[#e5e2da] hover:bg-paper-100 text-ink-800 text-xs font-mono uppercase tracking-wider rounded transition-all cursor-pointer shadow-xs active:scale-[0.99]"
        >
          Reconfigure Simulation Assumptions
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-2.5 bg-ink-950 hover:bg-ink-850 text-white text-xs font-mono uppercase tracking-wider rounded transition-all cursor-pointer shadow-xs active:scale-[0.99]"
        >
          New Decision Model
        </button>
      </div>
    </div>
  );
}
