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

  const sections = Array.from(new Set(Object.values(editedParams).filter(p => p && p.section).map(p => p.section)));

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-[#e7e5e4] pb-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-ink-500 font-semibold">
            Step 02 / Parameter Inspection
          </span>
          <h2 className="text-3xl font-serif text-ink-950 mt-1 font-normal tracking-tight">
            Assumptions & Model Parameters
          </h2>
        </div>
        <button
          onClick={onBack}
          className="text-xs font-mono text-ink-500 hover:text-ink-900 transition-colors self-start sm:self-auto cursor-pointer"
        >
          ← Edit Decision Context
        </button>
      </div>

      {/* Scenario Briefing Card */}
      <div className="bg-white border border-[#e5e2da] rounded-lg p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-ink-500 font-semibold">
            Econometric Scenario Synthesis
          </span>
        </div>
        {scenarioInfo?.description && (
          <p className="text-sm font-serif italic text-ink-900 leading-relaxed text-base">
            "{scenarioInfo.description}"
          </p>
        )}
        {scenarioInfo?.assumptions?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#f0ede6]">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-ink-500 mb-2.5">
              Key Inferred Assumptions:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-700">
              {scenarioInfo.assumptions.map((a, i) => (
                <div key={i} className="flex items-start gap-2 bg-paper-50 p-2.5 rounded border border-paper-300/70">
                  <span className="text-ink-400 font-mono text-[10px] shrink-0 mt-0.5">[{i + 1}]</span>
                  <span className="leading-snug">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Parameters Matrix */}
      <div className="bg-white border border-[#e5e2da] rounded-lg shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 space-y-8">
          {sections.map(section => (
            <div key={section} className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0ede6] pb-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-ink-900 font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-700"></span>
                  {section}
                </h4>
                <span className="text-[10px] font-mono text-ink-400">Editable parameters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(editedParams)
                  .filter(([, p]) => p && p.section === section)
                  .map(([key, param]) => (
                    <div 
                      key={key} 
                      className="p-4 rounded-md border border-[#e5e2da] bg-paper-50/50 hover:bg-white hover:border-paper-400 transition-all space-y-2.5"
                    >
                      <div className="flex justify-between items-baseline gap-2">
                        <label className="text-xs font-medium text-ink-800">
                          {param.label}
                        </label>
                        {param.source === 'user' ? (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-paper-200 text-ink-700 rounded">
                            User Input
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-ink-100 text-ink-800 border border-ink-200 rounded">
                            Estimated
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          step={param.value < 1 ? "0.001" : param.value < 100 ? "0.1" : "1"}
                          value={param.value}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="w-full px-3 py-1.5 text-xs font-mono tabular-nums bg-white border border-paper-400/80 rounded focus:outline-none focus:ring-1 focus:ring-ink-900 focus:border-ink-900 transition-colors"
                        />
                      </div>

                      <p className="text-[11px] text-ink-500 leading-tight">
                        {param.description}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-paper-50 border-t border-[#e5e2da] flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-4 py-2 text-xs font-mono text-ink-600 hover:text-ink-950 transition-colors cursor-pointer"
          >
            ← Back to Intake
          </button>
          
          <button
            onClick={() => onSimulate(editedParams)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-ink-950 hover:bg-ink-850 text-white text-xs font-mono uppercase tracking-wider rounded-md transition-all shadow-xs cursor-pointer active:scale-[0.99]"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Execute 10,000 Timeline Simulation
          </button>
        </div>
      </div>
    </div>
  );
}
