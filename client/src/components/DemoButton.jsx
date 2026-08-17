export default function DemoButton({ onDemo }) {
  return (
    <button
      type="button"
      onClick={onDemo}
      className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono tracking-wide text-ink-700 bg-paper-100 hover:bg-paper-200 border border-paper-400/80 rounded-md transition-all cursor-pointer shadow-xs active:scale-[0.99]"
      title="Populate with standard benchmark relocation scenario"
    >
      <svg className="w-3.5 h-3.5 text-ink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      Load Benchmark Scenario
    </button>
  );
}
