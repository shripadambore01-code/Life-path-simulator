export default function AIExplanation({ explanation }) {
  return (
    <div className="bg-white border border-[#e5e2da] rounded-lg p-6 sm:p-8 shadow-xs space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-[#f0ede6] pb-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-ink-500 font-semibold block">
            Qualitative Analysis
          </span>
          <h3 className="text-xl font-serif text-ink-950 font-normal tracking-tight mt-0.5">
            Executive Briefing & Strategic Synthesis
          </h3>
        </div>
        <div className="text-[10px] font-mono text-ink-400 bg-paper-100 px-2.5 py-1 rounded border border-paper-300">
          Source: Gemini Econometric Analysis
        </div>
      </div>

      {/* Body Content */}
      {!explanation ? (
        <div className="space-y-3.5 py-2">
          <div className="h-3.5 bg-paper-200 rounded animate-pulse w-full"></div>
          <div className="h-3.5 bg-paper-200 rounded animate-pulse w-11/12"></div>
          <div className="h-3.5 bg-paper-200 rounded animate-pulse w-4/5"></div>
          <div className="h-3.5 bg-paper-200 rounded animate-pulse w-full pt-4"></div>
          <div className="h-3.5 bg-paper-200 rounded animate-pulse w-9/12"></div>
        </div>
      ) : (
        <div className="space-y-4 font-serif text-ink-800 text-[15px] sm:text-base leading-relaxed">
          {explanation.split('\n').filter(p => p.trim() !== '').map((paragraph, i) => (
            <p key={i} className="first-of-type:font-normal first-of-type:text-ink-900">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* Provenance Footnote */}
      <div className="pt-4 border-t border-[#f0ede6] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-ink-400 gap-2">
        <span>Quantitative outputs derived from Monte Carlo engine; qualitative context synthesized by LLM.</span>
        <span className="shrink-0">LifePath Stochastic Model</span>
      </div>
    </div>
  );
}
