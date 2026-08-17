export function computePercentiles(values, percentiles) {
    if (!values.length) return {};
    const sorted = [...values].sort((a, b) => a - b);
    const result = {};
    for (const p of percentiles) {
        const index = (p / 100) * (sorted.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index - lower;
        if (upper === lower) {
            result[`p${p}`] = sorted[lower];
        } else {
            result[`p${p}`] = sorted[lower] * (1 - weight) + sorted[upper] * weight;
        }
    }
    return result;
}

export function computeFanChartData(trajectories, horizonMonths) {
    const data = [];
    for (let month = 0; month <= horizonMonths; month++) {
        const netWorths = trajectories.map(t => t.snapshots[month]?.netWorth ?? 0);
        const p = computePercentiles(netWorths, [10, 25, 50, 75, 90]);
        data.push({ month, ...p });
    }
    return data;
}

export function computeHistogramData(finalNetWorths, numBins = 50) {
    if (!finalNetWorths.length) return [];
    let min = Math.min(...finalNetWorths);
    let max = Math.max(...finalNetWorths);
    if (min === max) max = min + 1;
    const binSize = (max - min) / numBins;

    const bins = new Array(numBins).fill(0);
    for (const nw of finalNetWorths) {
        let index = Math.floor((nw - min) / binSize);
        if (index >= numBins) index = numBins - 1;
        bins[index]++;
    }

    const formatMoney = (val) => {
        if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(0)}k`;
        return `$${val.toFixed(0)}`;
    };

    return bins.map((count, i) => {
        const binMin = min + i * binSize;
        const binMax = min + (i + 1) * binSize;
        const midpoint = (binMin + binMax) / 2;
        return {
            min: binMin,
            max: binMax,
            midpoint,
            count,
            range: `${formatMoney(binMin)} – ${formatMoney(binMax)}`
        };
    });
}

export function computeRiskContributions(trajectories) {
    const finalNWs = trajectories.map(t => t.snapshots[t.snapshots.length - 1].netWorth);
    const sortedIndices = finalNWs.map((val, i) => ({ val, i })).sort((a, b) => a.val - b.val).map(x => x.i);
    const bottom10Count = Math.max(1, Math.floor(trajectories.length * 0.1));
    const top50Count = Math.max(1, Math.floor(trajectories.length * 0.5));

    const bottom10 = sortedIndices.slice(0, bottom10Count).map(i => trajectories[i]);
    const top50 = sortedIndices.slice(trajectories.length - top50Count).map(i => trajectories[i]);

    // Calculate frequencies for bottom 10% vs overall top 50%
    const avgJobLossBottom = bottom10.reduce((s, t) => s + t.summary.jobLossCount, 0) / bottom10Count;
    const avgJobLossTop = top50.reduce((s, t) => s + t.summary.jobLossCount, 0) / top50Count;

    const avgShocksBottom = bottom10.reduce((s, t) => s + t.summary.shockCount, 0) / bottom10Count;
    const avgShocksTop = top50.reduce((s, t) => s + t.summary.shockCount, 0) / top50Count;

    const avgShockTotalBottom = bottom10.reduce((s, t) => s + t.summary.shockTotal, 0) / bottom10Count;
    const avgShockTotalTop = top50.reduce((s, t) => s + t.summary.shockTotal, 0) / top50Count;

    const avgRaisesBottom = bottom10.reduce((s, t) => s + t.summary.totalRaises, 0) / bottom10Count;
    const avgRaisesTop = top50.reduce((s, t) => s + t.summary.totalRaises, 0) / top50Count;

    // Normalize to create frequency-like values (0-1 range)
    const maxJobLoss = Math.max(avgJobLossBottom, avgJobLossTop, 1);
    const maxShocks = Math.max(avgShocksBottom, avgShocksTop, 1);
    const maxShockTotal = Math.max(avgShockTotalBottom, avgShockTotalTop, 1);
    const maxRaises = Math.max(avgRaisesBottom, avgRaisesTop, 1);

    return [
        {
            factor: 'Job Loss Events',
            worstCaseFrequency: avgJobLossBottom / maxJobLoss,
            normalFrequency: avgJobLossTop / maxJobLoss
        },
        {
            factor: 'Unexpected Expenses',
            worstCaseFrequency: avgShocksBottom / maxShocks,
            normalFrequency: avgShocksTop / maxShocks
        },
        {
            factor: 'Expense Severity',
            worstCaseFrequency: avgShockTotalBottom / maxShockTotal,
            normalFrequency: avgShockTotalTop / maxShockTotal
        },
        {
            factor: 'Below-Avg Raises',
            worstCaseFrequency: 1 - (avgRaisesBottom / maxRaises),
            normalFrequency: 1 - (avgRaisesTop / maxRaises)
        }
    ];
}

export function computeSummaryStats(trajectories) {
    const finalNWs = trajectories.map(t => t.snapshots[t.snapshots.length - 1].netWorth);
    const startNW = trajectories[0].snapshots[0].netWorth;

    let sum = 0;
    let negCount = 0;
    let lessThanStartCount = 0;
    for (const nw of finalNWs) {
        sum += nw;
        if (nw < 0) negCount++;
        if (nw < startNW) lessThanStartCount++;
    }

    const mean = sum / finalNWs.length;
    const sorted = [...finalNWs].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];

    let variance = 0;
    for (const nw of finalNWs) {
        variance += (nw - mean) * (nw - mean);
    }
    variance /= finalNWs.length;
    const stddev = Math.sqrt(variance);

    return {
        mean,
        median,
        stddev,
        negativeNetWorthPercent: (negCount / finalNWs.length) * 100,
        lessThanStartingPercent: (lessThanStartCount / finalNWs.length) * 100,
        totalSimulations: finalNWs.length,
        startingNetWorth: startNW
    };
}
