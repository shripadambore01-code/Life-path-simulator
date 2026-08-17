import { useState } from 'react';
import InputForm from './components/InputForm';
import ParameterReview from './components/ParameterReview';
import LoadingState from './components/LoadingState';
import ResultsDashboard from './components/ResultsDashboard';

function App() {
  const [appState, setAppState] = useState('idle');
  const [userInput, setUserInput] = useState(null);
  const [simulationParams, setSimulationParams] = useState(null);
  const [scenarioInfo, setScenarioInfo] = useState(null);
  const [results, setResults] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [error, setError] = useState(null);
  const [horizon, setHorizon] = useState(5);

  const handleAnalyze = async (formData) => {
    setUserInput(formData);
    setHorizon(Number(formData.horizon) || 5);
    setAppState('analyzing');
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: formData.decision,
          structuredFields: {
            income: formData.income,
            savings: formData.savings,
            expenses: formData.expenses,
            location: formData.location
          }
        }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Analysis failed');
      }
      const data = await response.json();
      setSimulationParams(data.params);
      setScenarioInfo({
        description: data.scenarioDescription,
        assumptions: data.inferredAssumptions
      });
      setAppState('reviewing');
    } catch (err) {
      setError(err.message);
      setAppState('error');
    }
  };

  const handleSimulate = async (params) => {
    setSimulationParams(params);
    setAppState('simulating');
    setError(null);

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params,
          options: { horizon, numSimulations: 10000 }
        }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Simulation failed');
      }
      const data = await response.json();
      setResults(data);
      setAppState('results');

      // Kick off AI explanation in background
      fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summaryStats: data.summaryStats,
          riskContributions: data.riskContributions,
          percentiles: data.percentiles,
          userContext: {
            decision: userInput?.decision,
            location: userInput?.location,
            income: userInput?.income,
            horizon
          }
        }),
      })
        .then(res => res.json())
        .then(data => setExplanation(data.explanation))
        .catch(err => {
          console.error('Explanation fetch failed:', err);
          setExplanation('AI explanation could not be generated. The computed results above are still fully valid.');
        });

    } catch (err) {
      setError(err.message);
      setAppState('error');
    }
  };

  const resetToIdle = () => {
    setAppState('idle');
    setResults(null);
    setExplanation(null);
    setError(null);
  };

  const resetToReview = () => {
    setAppState('reviewing');
    setResults(null);
    setExplanation(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-surface-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight text-surface-900">LifePath Simulator</h1>
              <p className="text-[11px] text-surface-500 font-medium tracking-wide hidden sm:block">Monte Carlo Decision Modeling</p>
            </div>
          </div>
          {appState !== 'idle' && (
            <button
              onClick={resetToIdle}
              className="text-sm text-surface-500 hover:text-primary-600 font-medium transition-colors"
            >
              ← New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {appState === 'idle' && (
          <InputForm onSubmit={handleAnalyze} />
        )}

        {appState === 'analyzing' && (
          <LoadingState
            title="Analyzing your decision..."
            subtitle="Gemini AI is inferring economic parameters and risk factors from your context"
          />
        )}

        {appState === 'reviewing' && (
          <ParameterReview
            params={simulationParams}
            scenarioInfo={scenarioInfo}
            onSimulate={handleSimulate}
            onBack={resetToIdle}
          />
        )}

        {appState === 'simulating' && (
          <LoadingState
            title="Running 10,000 simulations..."
            subtitle="Modeling income changes, unexpected expenses, job market dynamics across possible futures"
          />
        )}

        {appState === 'results' && results && (
          <ResultsDashboard
            results={results}
            explanation={explanation}
            horizon={horizon}
            onReset={resetToIdle}
            onModify={resetToReview}
          />
        )}

        {appState === 'error' && (
          <div className="max-w-2xl mx-auto mt-16 text-center">
            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-10">
              <div className="w-16 h-16 mx-auto mb-6 bg-danger-500/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-surface-900 mb-3">Something went wrong</h2>
              <p className="text-surface-600 mb-8 max-w-md mx-auto">{error}</p>
              <button
                onClick={resetToIdle}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-xs text-surface-400">
        Built with Monte Carlo simulation + Gemini AI · Not financial advice
      </footer>
    </div>
  );
}

export default App;
