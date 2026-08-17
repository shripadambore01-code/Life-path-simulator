import { useState } from 'react';

const PRESETS = [
  {
    id: 'austin',
    title: 'Austin Tech Relocation',
    subtitle: '$75k Chicago → $95k Austin SWE',
    data: {
      income: 75000,
      savings: 15000,
      expenses: 3200,
      location: "Chicago, IL",
      decision: "I'm considering moving from Chicago to Austin, TX for a software engineering position paying $95,000, up from my current $75,000 in Chicago. My current rent is $1,400/month. I've heard Austin housing has gotten pricier but Texas has no state income tax.",
      horizon: 5
    }
  },
  {
    id: 'startup',
    title: 'Early-Stage Startup Leap',
    subtitle: '$140k Corp PM → $50k Founder',
    data: {
      income: 140000,
      savings: 45000,
      expenses: 4800,
      location: "San Francisco, CA",
      decision: "I'm considering leaving my $140,000/yr corporate PM role in SF to join an early-stage B2B AI startup as a co-founder with a reduced salary of $50,000/yr and 12% equity. I want to model my 5-year runway risk and chances of capital depletion.",
      horizon: 5
    }
  },
  {
    id: 'mba',
    title: 'Full-Time MBA Pivot',
    subtitle: '$80k Analyst → 2-Yr Study → $160k',
    data: {
      income: 80000,
      savings: 30000,
      expenses: 3000,
      location: "New York, NY",
      decision: "I am evaluating leaving my $80k job to pursue a 2-year top-tier full-time MBA. Tuition and living costs will require taking $120,000 in student loans over 2 years with zero income. Target post-MBA consulting compensation is $160,000/yr.",
      horizon: 7
    }
  }
];

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

  const handleSelectPreset = (preset) => {
    setFormData(preset.data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Introduction */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-semibold">
              Stochastic Decision Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mt-1">
              Model Your Life Decision
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Deterministic spreadsheets assume everything goes right. LifePath runs 10,000 randomized Monte Carlo timelines modeling correlated labor shocks, unexpected liabilities, and macroeconomic cycles.
            </p>
          </div>
        </div>

        {/* Preset Selector Strip */}
        <div className="mt-6">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">
            Load Quick-Start Benchmark Scenarios:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-left p-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all group"
              >
                <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                  {preset.title}
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                  {preset.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Input Form Card */}
      <div className="fintech-card rounded-xl p-6 sm:p-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Baseline Financial Position */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded bg-blue-950 text-blue-400 font-mono text-xs flex items-center justify-center font-bold border border-blue-800/60">
                1
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Baseline Financial Parameters (Current State)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="income" className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                  Annual Gross Income
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-slate-400 font-mono text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="income"
                    name="income"
                    value={formData.income}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg bg-slate-900 border border-slate-700/80 pl-7 pr-3 py-2.5 text-sm text-white font-mono placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    placeholder="75,000"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="savings" className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                  Liquid Reserve / Savings
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-slate-400 font-mono text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="savings"
                    name="savings"
                    value={formData.savings}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg bg-slate-900 border border-slate-700/80 pl-7 pr-3 py-2.5 text-sm text-white font-mono placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    placeholder="15,000"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="expenses" className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                  Monthly Total Burn
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-slate-400 font-mono text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="expenses"
                    name="expenses"
                    value={formData.expenses}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg bg-slate-900 border border-slate-700/80 pl-7 pr-3 py-2.5 text-sm text-white font-mono placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    placeholder="3,200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="location" className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                  Current Metro Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  placeholder="Chicago, IL"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Decision Qualitative Specification */}
          <div className="border-t border-slate-800 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded bg-blue-950 text-blue-400 font-mono text-xs flex items-center justify-center font-bold border border-blue-800/60">
                2
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                The Decision Under Consideration
              </h3>
            </div>

            <div className="space-y-2">
              <label htmlFor="decision" className="block text-xs text-slate-400">
                Describe the career pivot, relocation, compensation changes, debt obligations, or business leap in detail:
              </label>
              <textarea
                id="decision"
                name="decision"
                value={formData.decision}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-3 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition leading-relaxed resize-y"
                placeholder="Example: I'm evaluating moving to Austin for a $95k software role vs staying in Chicago at $75k. Current rent is $1,400. Factoring in Texas zero state tax and tech labor volatility..."
              />
            </div>
          </div>

          {/* Section 3: Time Horizon & Execution */}
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <label htmlFor="horizon" className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold whitespace-nowrap">
                Simulation Horizon:
              </label>
              <select
                id="horizon"
                name="horizon"
                value={formData.horizon}
                onChange={handleChange}
                className="rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
              >
                <option value={3}>3 Years (36 Monthly Intervals)</option>
                <option value={5}>5 Years (60 Monthly Intervals)</option>
                <option value={7}>7 Years (84 Monthly Intervals)</option>
                <option value={10}>10 Years (120 Monthly Intervals)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Calibrate Simulation Parameters</span>
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Footer Info Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">10,000 Iterations</div>
          <div className="text-xs text-slate-400 mt-0.5">High-iteration Monte Carlo sampling for accurate tail distribution capture.</div>
        </div>
        <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Correlated Risk Matrix</div>
          <div className="text-xs text-slate-400 mt-0.5">Simulates co-dependent shocks: job loss triggers higher health & auto shock variance.</div>
        </div>
        <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Transparent Audit Sheet</div>
          <div className="text-xs text-slate-400 mt-0.5">Review and override all derived coefficients before launching stochastic execution.</div>
        </div>
      </div>
    </div>
  );
}
