import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function RiskBreakdown({ data }) {
  const formatPercent = (val) => `${(val * 100).toFixed(1)}%`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-surface-200 shadow-lg rounded-xl text-sm max-w-xs">
          <p className="font-bold text-surface-900 mb-2 border-b border-surface-100 pb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-danger-600 flex justify-between gap-4">
              <span>In Worst 10% of Outcomes:</span> 
              <span className="font-bold">{formatPercent(payload[0].value)}</span>
            </p>
            <p className="text-surface-500 flex justify-between gap-4">
              <span>Overall Average:</span> 
              <span>{formatPercent(payload[1].value)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full">
      <h3 className="text-lg font-bold text-surface-900 mb-1 text-center">What Drives the Worst Outcomes?</h3>
      <p className="text-xs text-surface-500 text-center mb-4">Frequency of events in bottom 10% vs overall average</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          barGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis 
            type="number" 
            tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 12 }}
            domain={[0, 'dataMax + 0.1']}
          />
          <YAxis 
            type="category" 
            dataKey="factor"
            stroke="#94a3b8"
            tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          
          <Bar dataKey="worstCaseFrequency" name="In Worst Outcomes" fill="#ef4444" radius={[0, 4, 4, 0]} />
          <Bar dataKey="normalFrequency" name="Overall Average" fill="#cbd5e1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
