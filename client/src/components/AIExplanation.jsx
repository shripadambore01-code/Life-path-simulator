export default function AIExplanation({ explanation }) {
  return (
    <div className="fintech-card rounded-xl p-6 sm:p-8 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-semibold">
              Executive Decision Briefing
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight mt-0.5">
            Qualitative Synthesis & Risk Advisory
          </h3>
        </div>

        <div className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 self-start sm:self-auto">
          Stochastic Output Synthesis
        </div>
      </div>

      {/* Body Content */}
      {!explanation ? (
        <div className="space-y-3 py-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-4">
            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Generating structured strategic synthesis from 10,000 timeline iterations...</span>
          </div>
          <div className="h-4 bg-slate-800/80 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-slate-800/80 rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-slate-800/80 rounded animate-pulse w-4/6"></div>
          <div className="h-4 bg-slate-800/80 rounded animate-pulse w-full"></div>
        </div>
      ) : (
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-sans">
          {explanation.split('\n').filter(p => p.trim() !== '').map((paragraph, i) => (
            <p key={i} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* Audit Disclaimer */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-300 font-mono">
        <div>
          <span className="text-slate-300 font-semibold">Audit Notice: </span>
          <span>Charts and metrics are computed via mathematical Monte Carlo simulation. This briefing synthesizes distribution drivers for qualitative evaluation.</span>
        </div>
        <span className="text-slate-300 shrink-0">Model: Stochastic Kernel</span>
      </div>
    </div>
  );
}
