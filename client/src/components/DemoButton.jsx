export default function DemoButton({ onDemo }) {
  return (
    <button
      type="button"
      onClick={onDemo}
      className="w-full sm:w-auto px-6 py-3 rounded-lg border border-surface-300 text-surface-700 font-semibold hover:bg-surface-50 hover:text-primary-600 hover:border-primary-300 transition-all duration-200 flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
      </svg>
      Try a Demo
    </button>
  );
}
