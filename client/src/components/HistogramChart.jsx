import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

export default function HistogramChart({ data, percentiles }) {
  const formatMoney = (val) => {
    if (val == null || isNaN(val)) return '$0';
    if (Math.abs(val) >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val.toFixed(0)}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const count = payload[0].value;
      const totalRuns = data.reduce((s, b) => s + b.count, 0) || 10000;
      const pct = ((count / totalRuns) * 100).toFixed(1);

      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs font-mono backdrop-blur-md">
          <p className="font-bold text-white mb-1 border-b border-slate-800 pb-1">
            Range: {item.range}
          </p>
          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between gap-4">
              <span>Frequency:</span>
              <span className="text-blue-400 font-semibold">{count.toLocaleString()} runs ({pct}%)</span>
            </div>
            <div className="flex justify-between gap-4 text-slate-400">
              <span>Midpoint:</span>
              <span>{formatMoney(item.midpoint)}</span>
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
            Terminal Net Worth Distribution
          </h3>
          <p className="text-xs text-slate-400">
            Outcome density binned across 10,000 iterations
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-xs inline-block"></span>
            <span className="text-slate-400">Solvent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-xs inline-block"></span>
            <span className="text-slate-400">Depleted (&lt;$0)</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis
              dataKey="range"
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              interval={Math.floor(data.length / 5)}
              angle={-20}
              textAnchor="end"
              height={40}
            />
            <YAxis
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />

            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.midpoint >= 0 ? '#3b82f6' : '#f43f5e'}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>

            {percentiles && (
              <>
                <ReferenceLine
                  x={data.find(d => d.midpoint >= percentiles.p10)?.range || data[0]?.range}
                  stroke="#f43f5e"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{ position: 'top', value: 'P10', fill: '#f43f5e', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                />
                <ReferenceLine
                  x={data.find(d => d.midpoint >= percentiles.p50)?.range || data[Math.floor(data.length / 2)]?.range}
                  stroke="#60a5fa"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  label={{ position: 'top', value: 'Median', fill: '#60a5fa', fontSize: 11, fontWeight: 'bold', fontFamily: 'JetBrains Mono' }}
                />
                <ReferenceLine
                  x={data.find(d => d.midpoint >= percentiles.p90)?.range || data[data.length - 1]?.range}
                  stroke="#34d399"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{ position: 'top', value: 'P90', fill: '#34d399', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
