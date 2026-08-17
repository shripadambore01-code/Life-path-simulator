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
      decision: "I'm considering moving to Austin, TX for a software engineering position paying $95,000, up from my current $75,000 in Chicago. My current rent is $1,400/month. I've heard Austin has gotten expensive but there's no state income tax.",
      horizon: 5
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-surface-900 mb-3">Model Your Decision</h2>
        <p className="text-lg text-surface-700">Describe a major life decision and we'll simulate thousands of possible outcomes</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="income" className="block text-xs font-bold tracking-wider text-surface-700 uppercase">Annual Income ($)</label>
              <input
                type="number"
                id="income"
                name="income"
                value={formData.income}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200"
                placeholder="e.g. 75000"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="savings" className="block text-xs font-bold tracking-wider text-surface-700 uppercase">Current Savings ($)</label>
              <input
                type="number"
                id="savings"
                name="savings"
                value={formData.savings}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200"
                placeholder="e.g. 15000"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="expenses" className="block text-xs font-bold tracking-wider text-surface-700 uppercase">Monthly Expenses ($)</label>
              <input
                type="number"
                id="expenses"
                name="expenses"
                value={formData.expenses}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200"
                placeholder="e.g. 3200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="block text-xs font-bold tracking-wider text-surface-700 uppercase">Current Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200"
                placeholder="e.g. Chicago, IL"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="decision" className="block text-xs font-bold tracking-wider text-surface-700 uppercase">Decision Description</label>
            <textarea
              id="decision"
              name="decision"
              value={formData.decision}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200 resize-y"
              placeholder="Describe the decision you're considering..."
            />
          </div>

          <div className="space-y-2 md:w-1/2">
            <label htmlFor="horizon" className="block text-xs font-bold tracking-wider text-surface-700 uppercase">Simulation Horizon</label>
            <select
              id="horizon"
              name="horizon"
              value={formData.horizon}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200 bg-white"
            >
              <option value={3}>3 Years</option>
              <option value={5}>5 Years</option>
              <option value={7}>7 Years</option>
              <option value={10}>10 Years</option>
            </select>
          </div>

          <div className="pt-6 border-t border-surface-200 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-px transition-all duration-200 flex items-center justify-center gap-2"
            >
              Analyze My Decision
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <div className="w-full sm:w-auto">
              <DemoButton onDemo={handleDemo} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
