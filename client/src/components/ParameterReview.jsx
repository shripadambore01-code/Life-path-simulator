import { useState, useEffect } from 'react';

export default function ParameterReview({ params, scenarioInfo, onSimulate, onBack }) {
  const [editedParams, setEditedParams] = useState(params || {});

  useEffect(() => {
    if (params) setEditedParams(params);
  }, [params]);

  const handleChange = (key, value) => {
    setEditedParams(prev => ({
      ...prev,
      [key]: { ...prev[key], value: Number(value) }
    }));
  };

  const sections = Array.from(
    new Set(
      Object.values(editedParams)
        .filter(p => p && p.section)
        .map(p => p.section)
    )
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Scenario Context */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-semibold">
            Stage 2 of 3 · Parameter Audit Sheet
          </span>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight mt-0.5">
            Calibrate Stochastic Coefficients
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review and adjust statistical distributions before generating 10,000 Monte Carlo trajectories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            ← Back
          </button>
          <button
            onClick={() => onSimulate(editedParams)}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide uppercase transition shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
          >
            <span>Run 10,000 Simulations</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Analytical Derivation Rationale Banner */}
      <div className="fintech-card-subtle rounded-xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Model Calibration Rationale
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            Validated against Metro & Sector Indices
          </span>
        </div>

        {scenarioInfo?.description && (
          <p className="text-sm text-slate-300 leading-relaxed">
            {scenarioInfo.description}
          </p>
        )}

        {scenarioInfo?.assumptions?.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-semibold mb-2">
              Derived Stochastic Assumptions:
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
              {scenarioInfo.assumptions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded border border-slate-800/60">
                  <span className="text-blue-400 font-mono text-xs">•</span>
                  <span className="leading-snug">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Structured Parameters Worksheet */}
      <div className="fintech-card rounded-xl p-6 sm:p-8 space-y-8">
        {sections.map(section => (
          <div key={section} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                {section}
              </h3>
              <span className="text-[11px] font-mono text-slate-300">Editable Values</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(editedParams)
                .filter(([, p]) => p && p.section === section)
                .map(([key, param]) => (
                  <div
                    key={key}
                    className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <label className="text-xs font-medium text-slate-300 leading-tight block">
                        {param.label}
                      </label>
                      {param.source === 'user' ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 uppercase tracking-wider shrink-0">
                          User Spec
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/50 uppercase tracking-wider shrink-0">
                          Calibrated
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        step={param.value < 1 ? "0.001" : param.value < 100 ? "0.1" : "1"}
                        value={param.value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full rounded-md bg-slate-950 border border-slate-700/80 px-3 py-1.5 text-sm text-white font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                    </div>

                    <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                      {param.description}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Bottom CTA Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-mono uppercase tracking-wider font-semibold transition"
          >
            ← Edit Base Input
          </button>
          <button
            onClick={() => onSimulate(editedParams)}
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Execute 10,000 Monte Carlo Timelines</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
