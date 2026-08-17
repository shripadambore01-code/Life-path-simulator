import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function FanChart({ data }) {
  // Transform data for stacked areas
  const chartData = data.map(d => ({
    ...d,
    band_10_25: Math.max(0, d.p25 - d.p10),
    band_25_50: Math.max(0, d.p50 - d.p25),
    band_50_75: Math.max(0, d.p75 - d.p50),
    band_75_90: Math.max(0, d.p90 - d.p75),
  }));

  const formatMoney = (val) => {
    if (val == null || isNaN(val)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      const startNW = chartData[0]?.p50 || 0;
      const medianGrowth = point.p50 - startNW;
      const year = (point.month / 12).toFixed(1);

      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-4 rounded-xl shadow-2xl text-xs font-mono backdrop-blur-md min-w-[240px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-white uppercase tracking-wider">
              Month {label} ({year} Yrs)
            </span>
            <span className="text-[10px] text-slate-400">10k Runs</span>
          </div>

          <div className="space-y-1.5 tabular-nums">
            <div className="flex justify-between items-center text-slate-400">
              <span>90th %ile (Upside):</span>
              <span className="text-emerald-400 font-semibold">{formatMoney(point.p90)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>75th %ile:</span>
              <span className="text-slate-300">{formatMoney(point.p75)}</span>
            </div>
            <div className="flex justify-between items-center text-white bg-slate-800/80 px-1.5 py-0.5 rounded font-bold border border-slate-700/60">
              <span>50th %ile (Median):</span>
              <span className="text-blue-400">{formatMoney(point.p50)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>25th %ile:</span>
              <span className="text-slate-300">{formatMoney(point.p25)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>10th %ile (Downside):</span>
              <span className="text-rose-400 font-semibold">{formatMoney(point.p10)}</span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex justify-between text-[10px] text-slate-400">
            <span>Cumulative Median Delta:</span>
            <span className={medianGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {medianGrowth >= 0 ? '+' : ''}{formatMoney(medianGrowth)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Chart Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
            Net Worth Trajectory Dispersion (Fan Chart)
          </h3>
          <p className="text-xs text-slate-400">
            Monthly stochastic net worth bounds over simulation horizon
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-500 inline-block"></span>
            <span className="text-slate-300">Median (P50)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-500/30 rounded-xs inline-block"></span>
            <span className="text-slate-400">25th–75th %ile</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-500/15 rounded-xs inline-block"></span>
            <span className="text-slate-400">10th–90th %ile</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis
              dataKey="month"
              tickFormatter={(val) => val === 0 ? 'Month 0' : val % 12 === 0 ? `Yr ${val/12}` : ''}
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            />
            <YAxis
              tickFormatter={(val) => {
                if (Math.abs(val) >= 1000000) return `$${(val/1000000).toFixed(1)}M`;
                if (Math.abs(val) >= 1000) return `$${(val/1000).toFixed(0)}k`;
                return `$${val}`;
              }}
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              width={75}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.6} />

            {/* Base offset to p10 */}
            <Area type="monotone" dataKey="p10" stackId="1" stroke="none" fill="transparent" activeDot={false} />

            {/* Quartile bands */}
            <Area type="monotone" dataKey="band_10_25" stackId="1" stroke="none" fill="#3b82f6" fillOpacity={0.12} activeDot={false} />
            <Area type="monotone" dataKey="band_25_50" stackId="1" stroke="none" fill="#3b82f6" fillOpacity={0.28} activeDot={false} />
            <Area type="monotone" dataKey="band_50_75" stackId="1" stroke="none" fill="#3b82f6" fillOpacity={0.28} activeDot={false} />
            <Area type="monotone" dataKey="band_75_90" stackId="1" stroke="none" fill="#3b82f6" fillOpacity={0.12} activeDot={false} />

            {/* Median line on top */}
            <Area type="monotone" dataKey="p50" stroke="#3b82f6" strokeWidth={2.5} fill="none" activeDot={{ r: 5, fill: '#60a5fa', stroke: '#1e3a8a', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
