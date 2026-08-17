import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

export default function HistogramChart({ data, percentiles }) {
  const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-surface-200 shadow-lg rounded-xl text-sm">
          <p className="font-bold text-surface-900 mb-1">{data.range}</p>
          <p className="text-surface-700">{payload[0].value.toLocaleString()} simulations</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full">
      <h3 className="text-lg font-bold text-surface-900 mb-4 text-center">Distribution of Final Net Worth</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="range" 
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
          
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.midpoint >= 0 ? '#3b82f6' : '#ef4444'} />
            ))}
          </Bar>
          
          {percentiles && (
            <>
              <ReferenceLine x={data.find(d => d.midpoint >= percentiles.p10)?.range || data[0].range} stroke="#1e40af" strokeDasharray="3 3" label={{ position: 'top', value: '10th', fill: '#1e40af', fontSize: 12 }} />
              <ReferenceLine x={data.find(d => d.midpoint >= percentiles.p50)?.range || data[Math.floor(data.length/2)].range} stroke="#1e40af" strokeDasharray="3 3" label={{ position: 'top', value: 'Median', fill: '#1e40af', fontSize: 12, fontWeight: 'bold' }} />
              <ReferenceLine x={data.find(d => d.midpoint >= percentiles.p90)?.range || data[data.length-1].range} stroke="#1e40af" strokeDasharray="3 3" label={{ position: 'top', value: '90th', fill: '#1e40af', fontSize: 12 }} />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
