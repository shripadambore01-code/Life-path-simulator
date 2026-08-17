export default function LoadingState({ title, subtitle }) {
  return (
    <div className="max-w-xl mx-auto py-20 px-6 text-center space-y-8 animate-in fade-in duration-300">
      {/* Precision Progress Indicator */}
      <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-[#e5e2da] rounded-full"></div>
        <div className="absolute inset-0 border-2 border-ink-900 rounded-full border-t-transparent animate-spin"></div>
        <span className="font-mono text-[10px] text-ink-600 font-semibold">10k</span>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-ink-500 font-semibold">
          Computation in Progress
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-ink-950 font-normal">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-ink-600 font-sans max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Progress Matrix Sub-bars */}
      <div className="p-4 bg-white border border-[#e5e2da] rounded-md shadow-xs max-w-sm mx-auto text-left space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-ink-600">
          <span>Stochastic Timeline Sampling</span>
          <span className="text-ink-900 font-medium">60 Months / Path</span>
        </div>
        <div className="w-full bg-paper-200 h-1 rounded-full overflow-hidden">
          <div className="bg-ink-900 h-full w-2/3 animate-pulse"></div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-ink-400">
          <span>Correlated shock matrices</span>
          <span>Box-Muller Normal Dist</span>
        </div>
      </div>
    </div>
  );
}
