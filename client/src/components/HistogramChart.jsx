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
      const entry = payload[0].payload;
      return (
        <div className="bg-ink-950 text-white p-3 rounded border border-ink-800 shadow-lg text-xs font-mono tabular-nums">
          <p className="text-ink-400 border-b border-ink-800 pb-1 mb-1.5">{entry.range}</p>
          <div className="flex justify-between gap-4">
            <span className="text-ink-300">Simulated Paths:</span>
            <span className="font-semibold text-white">{payload[0].value.toLocaleString()} runs</span>
          </div>
          <div className="flex justify-between gap-4 text-[10px] text-ink-400 pt-1">
            <span>Midpoint:</span>
            <span>{formatMoney(entry.midpoint)}</span>
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
          Terminal Net Worth Distribution
        </h3>
        <p className="text-xs text-ink-500 font-mono mt-0.5">
          Density frequency of final outcomes binned across 50 intervals
        </p>
      </div>

      <div className="h-72 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 15, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e7e5e4" />
            <XAxis 
              dataKey="range" 
              stroke="#a8a29e"
              tick={{ fill: '#78716c', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              angle={-45}
              textAnchor="end"
              height={50}
              interval={Math.floor(data.length / 6)}
            />
            <YAxis 
              stroke="#a8a29e"
              tick={{ fill: '#78716c', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f4f1ea' }} />
            
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.midpoint >= 0 ? '#27272a' : '#dc2626'} 
                  fillOpacity={entry.midpoint >= 0 ? 0.85 : 0.75}
                />
              ))}
            </Bar>
            
            {percentiles && (
              <>
                <ReferenceLine 
                  x={data.find(d => d.midpoint >= percentiles.p50)?.range || data[Math.floor(data.length/2)]?.range} 
                  stroke="#09090b" 
                  strokeDasharray="3 3" 
                  label={{ position: 'top', value: 'Median', fill: '#09090b', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 600 }} 
                />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-ink-500 pt-2 border-t border-[#f0ede6]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#27272a] rounded-xs"></span>
          <span>Positive Terminal Value</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#dc2626] rounded-xs"></span>
          <span>Capital Impairment (&lt; $0)</span>
        </div>
      </div>
    </div>
  );
}
