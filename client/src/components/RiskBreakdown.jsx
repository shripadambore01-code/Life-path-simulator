import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function RiskBreakdown({ data }) {
  const formatPercent = (val) => `${(val * 100).toFixed(1)}%`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-ink-950 text-white p-3 rounded border border-ink-800 shadow-lg text-xs font-mono tabular-nums space-y-1.5 min-w-[200px]">
          <p className="font-semibold text-white border-b border-ink-800 pb-1">{label}</p>
          <div className="flex justify-between gap-4 text-crimson-300">
            <span>Tail Risk (Bottom 10%):</span>
            <span className="font-bold">{formatPercent(payload[0].value)}</span>
          </div>
          <div className="flex justify-between gap-4 text-ink-300">
            <span>Baseline Population:</span>
            <span>{formatPercent(payload[1].value)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 sm:p-7 space-y-4">
      <div className="border-b border-[#f0ede6] pb-4">
        <h3 className="text-base font-serif font-normal text-ink-950">
          Tail Risk Attribution Matrix
        </h3>
        <p className="text-xs text-ink-500 font-mono mt-0.5">
          Event incidence in worst 10% outcomes vs overall population average
        </p>
      </div>

      <div className="h-72 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical"
            margin={{ top: 5, right: 15, left: 20, bottom: 5 }}
            barGap={3}
          >
            <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#e7e5e4" />
            <XAxis 
              type="number" 
              tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
              stroke="#a8a29e"
              tick={{ fill: '#78716c', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              domain={[0, 1]}
            />
            <YAxis 
              type="category" 
              dataKey="factor"
              stroke="#a8a29e"
              tick={{ fill: '#27272a', fontSize: 11, fontFamily: 'Inter' }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f4f1ea' }} />
            <Legend 
              wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '10px' }} 
              formatter={(value) => <span className="text-ink-600">{value}</span>}
            />
            
            <Bar dataKey="worstCaseFrequency" name="Downside Tail (Bottom 10%)" fill="#b91c1c" radius={[0, 2, 2, 0]} />
            <Bar dataKey="normalFrequency" name="Expected Baseline" fill="#a1a1aa" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] font-mono text-ink-500 pt-2 border-t border-[#f0ede6] leading-relaxed">
        Key insight: Discrepancy highlights the primary catalyst triggering capital drawdown.
      </div>
    </div>
  );
}
