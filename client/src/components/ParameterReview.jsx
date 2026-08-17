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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Gemini Assessment Box */}
      <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 flex items-start gap-4">
        <div className="text-primary-500 mt-1 shrink-0">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-primary-900 mb-2">Gemini's Assessment</h3>
          {scenarioInfo?.description && (
            <p className="text-primary-800 text-sm leading-relaxed mb-3">{scenarioInfo.description}</p>
          )}
          {scenarioInfo?.assumptions?.length > 0 && (
            <ul className="text-primary-700 text-sm space-y-1">
              {scenarioInfo.assumptions.map((a, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">•</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          )}
          {!scenarioInfo?.description && (
            <p className="text-primary-800 text-sm leading-relaxed">
              Parameters have been estimated based on your scenario. Review and adjust any values below before running the simulation.
            </p>
          )}
        </div>
      </div>

      {/* Parameters Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          {sections.map(section => (
            <div key={section} className="space-y-4">
              <h4 className="text-sm font-bold tracking-wider text-surface-900 uppercase border-b border-surface-200 pb-2">
                {section}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(editedParams)
                  .filter(([, p]) => p && p.section === section)
                  .map(([key, param]) => (
                    <div key={key} className="bg-surface-50 p-4 rounded-xl border border-surface-200 relative group">
                      <div className="flex justify-between items-start mb-2">
                        <label className="font-semibold text-surface-900 text-sm flex items-center gap-2">
                          {param.label}
                          <div className="relative cursor-help text-surface-400 hover:text-surface-600">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-52 p-2 bg-surface-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 text-center pointer-events-none shadow-lg">
                              {param.description}
                            </div>
                          </div>
                        </label>
                        {param.source === 'user' ? (
                          <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded uppercase tracking-wider shrink-0">You Provided</span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-1 bg-primary-100 text-primary-700 rounded uppercase tracking-wider flex items-center gap-1 shrink-0">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                            </svg>
                            AI Estimated
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        step={param.value < 1 ? "0.001" : param.value < 100 ? "0.1" : "1"}
                        value={param.value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-colors text-sm"
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-surface-50 border-t border-surface-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 rounded-lg text-surface-600 font-medium hover:bg-surface-200 transition-colors"
          >
            ← Back to Edit
          </button>
          <button
            onClick={() => onSimulate(editedParams)}
            className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-px transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Run Simulation
          </button>
        </div>
      </div>
    </div>
  );
}
