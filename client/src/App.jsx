import { useState } from 'react';
import InputForm from './components/InputForm';
import ParameterReview from './components/ParameterReview';
import LoadingState from './components/LoadingState';
import ResultsDashboard from './components/ResultsDashboard';

function App() {
  const [appState, setAppState] = useState('idle'); // idle, analyzing, reviewing, simulating, results, error
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
        throw new Error(errData.error || 'Parameter synthesis failed');
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
        throw new Error(errData.error || 'Simulation engine failed');
      }
      const data = await response.json();
      setResults(data);
      setAppState('results');

      // Kick off AI qualitative briefing in background
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
          console.error('Explanation synthesis failed:', err);
          setExplanation('Qualitative briefing could not be generated. All empirical numerical outputs and distributions above remain fully verified.');
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
    <div className="min-h-screen bg-paper-100 font-sans text-ink-900 selection:bg-paper-300">
      {/* Institutional Top Navbar */}
      <header className="bg-white border-b border-[#e5e2da] sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-ink-950 rounded flex items-center justify-center text-white font-serif font-bold text-sm tracking-tight shadow-xs">
              LP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-semibold tracking-tight text-ink-950 text-base">
                  LifePath Simulator
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-paper-200 text-ink-600 rounded">
                  v1.0 Stochastic
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {appState !== 'idle' && (
              <button
                onClick={resetToIdle}
                className="text-xs font-mono text-ink-600 hover:text-ink-950 transition-colors cursor-pointer"
              >
                ← Restart Dossier
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-ink-400 border-l border-[#e5e2da] pl-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>10k Path Engine Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {appState === 'idle' && (
          <InputForm onSubmit={handleAnalyze} />
        )}

        {appState === 'analyzing' && (
          <LoadingState 
            title="Extracting Parameters & Econometric Bounds" 
            subtitle="Translating narrative context into structured stochastic variables and cost-of-living assumptions."
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
            title="Sampling 10,000 Stochastic Future Timelines" 
            subtitle="Iterating multi-factor Box-Muller random walks, correlated employment shocks, and inflation dynamics."
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
          <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-lg border border-crimson-200 text-center space-y-4 shadow-xs">
            <div className="w-10 h-10 mx-auto rounded-full bg-crimson-50 text-crimson-600 flex items-center justify-center font-mono font-bold text-sm">
              !
            </div>
            <h2 className="text-xl font-serif text-ink-950">Simulation Interrupted</h2>
            <p className="text-xs text-ink-600 font-sans leading-relaxed">{error}</p>
            <button 
              onClick={resetToIdle}
              className="inline-flex items-center justify-center px-5 py-2 text-xs font-mono uppercase tracking-wider bg-ink-950 text-white rounded hover:bg-ink-800 transition-colors cursor-pointer"
            >
              Return to Intake
            </button>
          </div>
        )}
      </main>

      {/* Institutional Editorial Footer */}
      <footer className="border-t border-[#e5e2da] bg-white py-6 mt-16 text-center">
        <div className="max-w-5xl mx-auto px-4 text-[11px] font-mono text-ink-500 space-y-1">
          <p>LifePath Simulator • Correlated Bayesian Monte Carlo Modeling • Powered by Google Gemini</p>
          <p className="text-ink-400">For scenario evaluation and risk modeling purposes only.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
