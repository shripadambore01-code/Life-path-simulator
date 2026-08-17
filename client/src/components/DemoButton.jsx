export default function DemoButton({ onDemo, onSelectScenario }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onDemo('austin')}
        className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center gap-2 shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
        Load Example: Austin Relocation ($75k → $95k)
      </button>
    </div>
  );
}
