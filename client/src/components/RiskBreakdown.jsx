import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function RiskBreakdown({ data }) {
  const formatPercent = (val) => `${(val * 100).toFixed(1)}%`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const worst = payload.find(p => p.dataKey === 'worstCaseFrequency')?.value || 0;
      const normal = payload.find(p => p.dataKey === 'normalFrequency')?.value || 0;
      const delta = (worst - normal) * 100;

      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs font-mono backdrop-blur-md max-w-xs">
          <p className="font-bold text-white mb-2 border-b border-slate-800 pb-1">{label}</p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-rose-400">
              <span>Worst 10% Tail Runs:</span>
              <span className="font-bold">{formatPercent(worst)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Baseline Cohort (Top 50%):</span>
              <span>{formatPercent(normal)}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-300">
              <span>Downside Sensitivity:</span>
              <span className="font-semibold text-yellow-400">+{delta.toFixed(1)}% elevated</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
            Downside Sensitivity Decomposition
          </h3>
          <p className="text-xs text-slate-400">
            Event incidence in 10th percentile worst outcomes vs baseline
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
            barGap={3}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
            <XAxis
              type="number"
              tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              domain={[0, 1]}
            />
            <YAxis
              type="category"
              dataKey="factor"
              stroke="#475569"
              tick={{ fill: '#cbd5e1', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '10px' }}
              formatter={(value) => <span className="text-slate-300">{value}</span>}
            />

            <Bar dataKey="worstCaseFrequency" name="Worst 10% Outliers" fill="#f43f5e" radius={[0, 2, 2, 0]} />
            <Bar dataKey="normalFrequency" name="Baseline Cohort" fill="#475569" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
