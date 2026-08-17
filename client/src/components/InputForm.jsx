import { useState } from 'react';
import DemoButton from './DemoButton';

export default function InputForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    income: '',
    savings: '',
    expenses: '',
    location: '',
    decision: '',
    horizon: 5
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDemo = () => {
    setFormData({
      income: 75000,
      savings: 15000,
      expenses: 3200,
      location: "Chicago, IL",
      decision: "I am weighing a career transition from Chicago to Austin, TX for a Software Engineer position offering $95,000 base compensation (up from my current $75,000). Current rent is $1,400/mo. Texas has 0% state income tax, though Austin rents and property costs have increased.",
      horizon: 5
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="border-b border-[#e7e5e4] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-500 font-semibold">
              Step 01 / Scenario Intake
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-ink-950 mt-1 font-normal tracking-tight">
              Model a Financial Transition
            </h2>
          </div>
          <div className="pt-2 sm:pt-0">
            <DemoButton onDemo={handleDemo} />
          </div>
        </div>
        <p className="text-sm text-ink-600 font-sans mt-3 max-w-2xl leading-relaxed">
          State your baseline financial position and describe the opportunity under consideration. 
          The simulation engine will extract economic parameters and project thousands of correlated stochastic timelines.
        </p>
      </div>

      {/* Main Form Sheet */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#e5e2da] rounded-lg shadow-xs overflow-hidden">
        
        {/* Section 1: Financial Position */}
        <div className="p-6 sm:p-8 space-y-6 border-b border-[#f0ede6]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-900"></span>
            <h3 className="text-xs font-mono uppercase tracking-wider text-ink-700 font-semibold">
              Current Financial Position
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="income" className="block text-xs font-medium text-ink-700">
                Annual Gross Income ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-ink-400 font-mono text-sm">$</span>
                <input
                  type="number"
                  id="income"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  required
                  className="w-full pl-7 pr-3 py-2 text-sm font-mono tabular-nums bg-paper-50 border border-paper-400/70 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-ink-900 focus:border-ink-900 transition-colors"
                  placeholder="75,000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="savings" className="block text-xs font-medium text-ink-700">
                Current Liquid Reserves ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-ink-400 font-mono text-sm">$</span>
                <input
                  type="number"
                  id="savings"
                  name="savings"
                  value={formData.savings}
                  onChange={handleChange}
                  required
                  className="w-full pl-7 pr-3 py-2 text-sm font-mono tabular-nums bg-paper-50 border border-paper-400/70 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-ink-900 focus:border-ink-900 transition-colors"
                  placeholder="15,000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="expenses" className="block text-xs font-medium text-ink-700">
                Monthly Total Living Expenses ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-ink-400 font-mono text-sm">$</span>
                <input
                  type="number"
                  id="expenses"
                  name="expenses"
                  value={formData.expenses}
                  onChange={handleChange}
                  required
                  className="w-full pl-7 pr-3 py-2 text-sm font-mono tabular-nums bg-paper-50 border border-paper-400/70 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-ink-900 focus:border-ink-900 transition-colors"
                  placeholder="3,200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="location" className="block text-xs font-medium text-ink-700">
                Current Location (City, State)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm bg-paper-50 border border-paper-400/70 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-ink-900 focus:border-ink-900 transition-colors"
                placeholder="Chicago, IL"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Decision Context & Horizon */}
        <div className="p-6 sm:p-8 space-y-6 bg-paper-50/50">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-900"></span>
            <h3 className="text-xs font-mono uppercase tracking-wider text-ink-700 font-semibold">
              Proposed Decision & Planning Horizon
            </h3>
          </div>

          <div className="space-y-2">
            <label htmlFor="decision" className="block text-xs font-medium text-ink-700">
              Decision Narrative
            </label>
            <textarea
              id="decision"
              name="decision"
              value={formData.decision}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3.5 py-2.5 text-sm leading-relaxed bg-white border border-paper-400/70 rounded-md focus:outline-none focus:ring-1 focus:ring-ink-900 focus:border-ink-900 transition-colors resize-y font-sans placeholder:text-ink-400"
              placeholder="e.g., I'm considering relocating to Seattle for a product management offer of $130,000, up from $105,000 in Denver. Rent is expected to increase by $800/mo, and I'll need $4,000 for moving expenses..."
            />
            <p className="text-[11px] text-ink-500 font-mono">
              Mention roles, compensation deltas, locations, rent changes, or debt obligations.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label htmlFor="horizon" className="text-xs font-medium text-ink-700 whitespace-nowrap">
                Projection Horizon:
              </label>
              <select
                id="horizon"
                name="horizon"
                value={formData.horizon}
                onChange={handleChange}
                className="px-3 py-1.5 text-xs font-mono bg-white border border-paper-400/80 rounded-md focus:outline-none focus:ring-1 focus:ring-ink-900"
              >
                <option value={3}>3 Years (36 Monthly Steps)</option>
                <option value={5}>5 Years (60 Monthly Steps)</option>
                <option value={7}>7 Years (84 Monthly Steps)</option>
                <option value={10}>10 Years (120 Monthly Steps)</option>
              </select>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-ink-900 hover:bg-ink-800 text-white text-xs font-medium uppercase tracking-wider rounded-md transition-all shadow-xs cursor-pointer active:scale-[0.99]"
            >
              Synthesize Parameters
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </form>

      {/* Institutional Assurance */}
      <div className="flex items-center justify-between px-2 text-[11px] font-mono text-ink-400">
        <span>Engine: 10,000 Stochastic Iterations</span>
        <span>Correlated Multi-Factor Risk Modeling</span>
      </div>
    </div>
  );
}
