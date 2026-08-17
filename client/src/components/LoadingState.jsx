export default function LoadingState({ title, subtitle }) {
  return (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 bg-primary-200 rounded-full animate-ping opacity-75"></div>
        <div className="relative flex items-center justify-center w-24 h-24 bg-primary-600 rounded-full shadow-lg">
          <svg className="w-12 h-12 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
      </div>
      <h2 className="text-3xl font-display font-bold text-surface-900 mb-4">{title}</h2>
      <p className="text-lg text-surface-600 mb-8 max-w-md mx-auto">{subtitle}</p>
      
      <div className="flex justify-center gap-2">
        <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
        <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
      </div>
    </div>
  );
}
