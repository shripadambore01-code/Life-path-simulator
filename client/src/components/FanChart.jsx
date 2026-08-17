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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      const year = Math.floor(label / 12);
      const month = label % 12;
      return (
        <div className="bg-ink-950 text-white p-3.5 rounded border border-ink-800 shadow-lg text-xs font-mono tabular-nums space-y-2 min-w-[220px]">
          <div className="flex justify-between items-center border-b border-ink-800 pb-1.5 text-ink-300">
            <span>Month {label} {year > 0 ? `(Yr ${year}, M${month})` : ''}</span>
            <span className="text-[10px] uppercase text-ink-400">Percentiles</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-ink-300">
              <span className="text-ink-400">90th (Upside):</span>
              <span className="font-semibold text-white">{formatMoney(point.p90)}</span>
            </div>
            <div className="flex justify-between text-ink-300">
              <span className="text-ink-400">75th Percentile:</span>
              <span>{formatMoney(point.p75)}</span>
            </div>
            <div className="flex justify-between text-white border-y border-ink-800/80 py-0.5 my-0.5 font-bold">
              <span className="text-amber-400">50th (Median):</span>
              <span className="text-amber-400">{formatMoney(point.p50)}</span>
            </div>
            <div className="flex justify-between text-ink-300">
              <span className="text-ink-400">25th Percentile:</span>
              <span>{formatMoney(point.p25)}</span>
            </div>
            <div className="flex justify-between text-ink-300">
              <span className="text-ink-400">10th (Downside):</span>
              <span className="text-crimson-400 font-semibold">{formatMoney(point.p10)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 sm:p-7 space-y-4">
      {/* Chart Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 border-b border-[#f0ede6] pb-4">
        <div>
          <h3 className="text-base font-serif font-normal text-ink-950">
            Net Worth Dispersion Over Horizon
          </h3>
          <p className="text-xs text-ink-500 font-mono mt-0.5">
            10,000 monthly trajectory paths across 80% & 50% confidence intervals
          </p>
        </div>

        {/* Financial Times style Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-ink-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#71717a]/20 border border-[#71717a]/40"></span>
            <span>10th–90th (80% Range)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#3f3f46]/35 border border-[#3f3f46]/60"></span>
            <span>25th–75th (Interquartile)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-ink-950"></span>
            <span className="font-semibold text-ink-900">Median (50th)</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-84 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e7e5e4" />
            <XAxis 
              dataKey="month" 
              tickFormatter={(val) => val === 0 ? 'Start' : val % 12 === 0 ? `Yr ${val/12}` : ''}
              stroke="#a8a29e"
              tick={{ fill: '#78716c', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              tickLine={{ stroke: '#d6d3d1' }}
            />
            <YAxis 
              tickFormatter={(val) => {
                if (Math.abs(val) >= 1000000) return `$${(val/1000000).toFixed(1)}M`;
                if (Math.abs(val) >= 1000) return `$${(val/1000).toFixed(0)}k`;
                return `$${val}`;
              }}
              stroke="#a8a29e"
              tick={{ fill: '#78716c', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              tickLine={{ stroke: '#d6d3d1' }}
              width={75}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#dc2626" strokeDasharray="3 3" strokeWidth={1} label={{ value: '$0 Break-even', position: 'insideTopLeft', fill: '#dc2626', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            
            {/* Invisible bottom spacer to lift stack to p10 */}
            <Area type="monotone" dataKey="p10" stackId="1" stroke="none" fill="transparent" activeDot={false} isAnimationActive={false} />
            
            {/* Outer confidence band: p10 -> p25 */}
            <Area type="monotone" dataKey="band_10_25" stackId="1" stroke="none" fill="#71717a" fillOpacity={0.15} activeDot={false} isAnimationActive={false} />
            {/* Inner interquartile band: p25 -> p50 */}
            <Area type="monotone" dataKey="band_25_50" stackId="1" stroke="none" fill="#3f3f46" fillOpacity={0.35} activeDot={false} isAnimationActive={false} />
            {/* Inner interquartile band: p50 -> p75 */}
            <Area type="monotone" dataKey="band_50_75" stackId="1" stroke="none" fill="#3f3f46" fillOpacity={0.35} activeDot={false} isAnimationActive={false} />
            {/* Outer confidence band: p75 -> p90 */}
            <Area type="monotone" dataKey="band_75_90" stackId="1" stroke="none" fill="#71717a" fillOpacity={0.15} activeDot={false} isAnimationActive={false} />
            
            {/* Median line drawn distinctly on top */}
            <Area type="monotone" dataKey="p50" stroke="#09090b" strokeWidth={2.25} fill="none" activeDot={{ r: 4, fill: '#09090b', stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
