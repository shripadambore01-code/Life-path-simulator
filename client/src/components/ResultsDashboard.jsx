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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-display font-bold text-surface-900 mb-2">Simulation Results</h2>
        <p className="text-surface-500">
          Based on {(summaryStats?.totalSimulations || 10000).toLocaleString()} Monte Carlo simulations over {horizon} years
        </p>
      </div>

      {/* Computed Results Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-surface-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-bold tracking-wider uppercase">Computed Results</span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
            <h3 className="text-xs font-bold tracking-wider text-surface-400 uppercase mb-3">Median Net Worth</h3>
            <div className={`text-3xl font-display font-bold ${(summaryStats?.median ?? 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {formatMoney(summaryStats?.median)}
            </div>
            <p className="text-xs text-surface-400 mt-2">Most likely outcome</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
            <h3 className="text-xs font-bold tracking-wider text-surface-400 uppercase mb-3">Risk of Ruin</h3>
            <div className={`text-3xl font-display font-bold ${negPercent < 10 ? 'text-green-600' : negPercent < 30 ? 'text-yellow-500' : 'text-red-500'}`}>
              {negPercent.toFixed(1)}%
            </div>
            <p className="text-xs text-surface-400 mt-2">Chance of negative net worth</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
            <h3 className="text-xs font-bold tracking-wider text-surface-400 uppercase mb-3">Worst Case (10th)</h3>
            <div className={`text-2xl font-display font-bold ${(percentiles?.p10 ?? 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {formatMoney(percentiles?.p10)}
            </div>
            <p className="text-xs text-surface-400 mt-2">1 in 10 chance of being worse</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
            <h3 className="text-xs font-bold tracking-wider text-surface-400 uppercase mb-3">Best Case (90th)</h3>
            <div className="text-2xl font-display font-bold text-green-600">
              {formatMoney(percentiles?.p90)}
            </div>
            <p className="text-xs text-surface-400 mt-2">1 in 10 chance of being better</p>
          </div>
        </div>

        {/* Fan Chart */}
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
          <FanChart data={fanChartData || []} />
        </div>

        {/* Histogram + Risk Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
            <HistogramChart data={histogramData || []} percentiles={percentiles} />
          </div>
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
            <RiskBreakdown data={riskContributions || []} />
          </div>
        </div>
      </div>

      {/* AI Explanation Section — visually separated */}
      <AIExplanation explanation={explanation} />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 border-t border-surface-200">
        <button
          onClick={onModify}
          className="px-8 py-3 rounded-xl border-2 border-primary-600 text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
        >
          Modify Parameters
        </button>
        <button
          onClick={onReset}
          className="px-8 py-3 rounded-xl bg-surface-800 text-white font-semibold hover:bg-surface-900 shadow-sm hover:shadow-md transition-all duration-200"
        >
          Start New Analysis
        </button>
      </div>
    </div>
  );
}
