import { normalSample, logNormalSample, bernoulliSample, clamp, uniformSample } from './distributions.js';
import { computeFanChartData, computeHistogramData, computeRiskContributions, computeSummaryStats, computePercentiles } from './statistics.js';

export function runSimulation(params, options) {
    const numSimulations = options.numSimulations || 10000;
    const horizonMonths = options.horizonMonths || 60;
    
    const trajectories = [];
    
    for (let sim = 0; sim < numSimulations; sim++) {
        let netWorth = params.currentSavings;
        let currentIncome = params.monthlyIncome;
        let currentExpenses = params.monthlyExpenses;
        let employed = true;
        let unemployedMonths = 0;
        let unemploymentTarget = 0;
        
        let jobLossCount = 0;
        let shockCount = 0;
        let shockTotal = 0;
        let totalRaises = 0;
        
        const snapshots = [];
        snapshots.push({ month: 0, netWorth, income: currentIncome, expenses: currentExpenses, employed, hadShock: false });
        
        let economicState = 'neutral';
        
        for (let month = 1; month <= horizonMonths; month++) {
            if (month % 12 === 1) {
                const rand = Math.random();
                if (rand < 0.15) economicState = 'good';
                else if (rand < 0.30) economicState = 'bad';
                else economicState = 'neutral';
            }
            
            let currentJobLossProb = params.monthlyJobLossProbability;
            if (economicState === 'bad') currentJobLossProb *= 2;
            
            if (employed) {
                if (bernoulliSample(currentJobLossProb)) {
                    employed = false;
                    jobLossCount++;
                    unemployedMonths = 0;
                    unemploymentTarget = Math.round(clamp(normalSample(params.unemploymentDurationMean, params.unemploymentDurationSigma), 1, 24));
                }
            }
            
            let monthIncome = 0;
            if (employed) {
                monthIncome = currentIncome;
            } else {
                monthIncome = currentIncome * params.unemploymentIncomeRatio;
                unemployedMonths++;
                if (unemployedMonths >= unemploymentTarget) {
                    employed = true;
                    if (bernoulliSample(params.reemploymentPayCutProbability)) {
                        const cut = uniformSample(params.reemploymentPayCutRange[0], params.reemploymentPayCutRange[1]);
                        currentIncome = currentIncome * (1 - cut);
                    }
                }
            }
            
            if (employed && month % 12 === 0) {
                let raiseRate = params.annualRaiseRate;
                if (economicState === 'bad') {
                    raiseRate = 0;
                } else {
                    raiseRate = clamp(normalSample(params.annualRaiseRate, params.annualRaiseSigma), -0.05, 0.20);
                }
                if (raiseRate > 0) totalRaises++;
                currentIncome *= (1 + raiseRate);
            }
            
            if (month % 12 === 0) {
                const rentIncrease = normalSample(params.annualRentIncrease, params.annualRentIncreaseSigma);
                currentExpenses *= (1 + rentIncrease);
            }
            
            currentExpenses *= (1 + normalSample(params.monthlyInflationMean, params.monthlyInflationSigma));
            
            let currentShockProb = params.monthlyShockProbability;
            if (!employed) currentShockProb *= params.jobLossShockMultiplier;
            
            let shockAmount = 0;
            let hadShock = false;
            if (bernoulliSample(currentShockProb)) {
                hadShock = true;
                shockCount++;
                shockAmount = logNormalSample(params.shockMedian, params.shockSigma);
                shockTotal += shockAmount;
            }
            
            const netChange = monthIncome - currentExpenses - shockAmount;
            netWorth += netChange;
            
            snapshots.push({ month, netWorth, income: monthIncome, expenses: currentExpenses, employed, hadShock });
        }
        
        trajectories.push({
            snapshots,
            summary: { jobLossCount, shockCount, shockTotal, totalRaises }
        });
    }
    
    const fanChartData = computeFanChartData(trajectories, horizonMonths);
    const finalNetWorths = trajectories.map(t => t.snapshots[t.snapshots.length - 1].netWorth);
    const histogramData = computeHistogramData(finalNetWorths, 50);
    const summaryStats = computeSummaryStats(trajectories);
    const riskContributions = computeRiskContributions(trajectories);
    const percentiles = computePercentiles(finalNetWorths, [10, 25, 50, 75, 90]);
    
    return {
        fanChartData,
        histogramData,
        summaryStats,
        riskContributions,
        percentiles
    };
}
