import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function FanChart({ data }) {
  // Transform data for stacked areas
  const chartData = data.map(d => ({
    ...d,
    band_10_25: d.p25 - d.p10,
    band_25_50: d.p50 - d.p25,
    band_50_75: d.p75 - d.p50,
    band_75_90: d.p90 - d.p75,
  }));

  const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-surface-200 shadow-lg rounded-xl text-sm">
          <p className="font-bold text-surface-900 mb-2 border-b border-surface-100 pb-2">Month {label}</p>
          <div className="space-y-1">
            <p className="text-primary-800 flex justify-between gap-4"><span>Best Case (90th):</span> <span>{formatMoney(data.p90)}</span></p>
            <p className="text-primary-600 flex justify-between gap-4"><span>75th Percentile:</span> <span>{formatMoney(data.p75)}</span></p>
            <p className="font-bold text-surface-900 flex justify-between gap-4 mt-1 mb-1"><span>Median (50th):</span> <span>{formatMoney(data.p50)}</span></p>
            <p className="text-primary-600 flex justify-between gap-4"><span>25th Percentile:</span> <span>{formatMoney(data.p25)}</span></p>
            <p className="text-primary-800 flex justify-between gap-4"><span>Worst Case (10th):</span> <span>{formatMoney(data.p10)}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full">
      <h3 className="text-lg font-bold text-surface-900 mb-4 text-center">Net Worth Trajectories Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="month" 
            tickFormatter={(val) => val % 12 === 0 ? `Yr ${val/12}` : ''}
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(val) => `$${val > 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 12 }}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
          
          {/* Invisible base to push the stack up to p10 */}
          <Area type="monotone" dataKey="p10" stackId="1" stroke="none" fill="transparent" activeDot={false} />
          
          {/* The bands */}
          <Area type="monotone" dataKey="band_10_25" stackId="1" stroke="none" fill="#3b82f6" fillOpacity={0.15} activeDot={false} />
          <Area type="monotone" dataKey="band_25_50" stackId="1" stroke="none" fill="#3b82f6" fillOpacity={0.3} activeDot={false} />
          <Area type="monotone" dataKey="band_50_75" stackId="1" stroke="none" fill="#3b82f6" fillOpacity={0.3} activeDot={false} />
          <Area type="monotone" dataKey="band_75_90" stackId="1" stroke="none" fill="#3b82f6" fillOpacity={0.15} activeDot={false} />
          
          {/* Median line drawn on top without stacking */}
          <Area type="monotone" dataKey="p50" stroke="#2563eb" strokeWidth={3} fill="none" activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
