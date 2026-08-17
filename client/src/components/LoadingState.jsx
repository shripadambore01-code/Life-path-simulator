import { useState, useEffect } from 'react';

export default function LoadingState({ title, subtitle }) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Initializing Box-Muller Gaussian sampling kernel...',
    'Calibrating labor shock probability & unemployment duration...',
    'Injecting correlated expenditure shocks & inflation drift...',
    'Executing 10,000 randomized 60-month stochastic timelines...',
    'Computing terminal percentiles (P10, P25, P50, P75, P90)...',
    'Synthesizing downside sensitivity matrix...'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center">
      <div className="fintech-card rounded-2xl p-8 sm:p-10 border border-slate-800 space-y-6">
        
        {/* Sleek Spinner / Pulse Ring */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping"></div>
          <div className="w-16 h-16 rounded-full border-2 border-blue-500 border-t-transparent animate-spin flex items-center justify-center"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          </div>
        </div>

        {/* Header Text */}
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-sm mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Telemetry Log */}
        <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-left font-mono">
          <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800/80 pb-1">
            <span>Stochastic Engine Pipeline</span>
            <span className="text-blue-400 font-bold">10,000 Runs</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="truncate">{steps[stepIndex]}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
