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

      // Kick off strategic synthesis in background
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
          setExplanation('Advisory synthesis generation was unavailable for this session. The computed stochastic outcomes above are fully validated.');
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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans flex flex-col justify-between">
      {/* Top Institutional Header */}
      <header className="bg-slate-900/90 border-b border-slate-800/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-mono font-bold text-white text-sm shadow-md shadow-blue-600/30">
              LP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-display font-bold tracking-tight text-white">
                  LifePath
                </h1>
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                  Stochastic Model
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Quantitative Life Decision Simulator · 10,000 Iterations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {appState !== 'idle' && (
              <button
                onClick={resetToIdle}
                className="text-xs font-mono text-slate-400 hover:text-slate-200 transition flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
              >
                <span>↺</span>
                <span>Reset / New Scenario</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        {appState === 'idle' && (
          <InputForm onSubmit={handleAnalyze} />
        )}

        {appState === 'analyzing' && (
          <LoadingState
            title="Calibrating Stochastic Parameters..."
            subtitle="Synthesizing regional cost indices, tax implications, and labor market volatility from scenario"
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
            title="Executing 10,000 Timelines..."
            subtitle="Sampling probability distributions for income volatility, inflation drift, and correlated downside shocks"
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
          <div className="max-w-lg mx-auto mt-12">
            <div className="fintech-card rounded-2xl p-8 border border-rose-800/60 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400 text-xl font-mono">
                !
              </div>
              <h2 className="text-xl font-bold text-white">Execution Error</h2>
              <p className="text-xs font-mono text-rose-300 leading-relaxed">{error}</p>
              <button
                onClick={resetToIdle}
                className="px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono uppercase tracking-wider font-semibold border border-slate-700 transition"
              >
                Return to Form
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070a12] py-4 text-center text-xs font-mono text-slate-300">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>LifePath Simulator · Pure Math Monte Carlo Simulation with Correlated Stochastics</span>
          <span className="text-slate-300">Analytical Demonstration · Not Investment Advice</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
