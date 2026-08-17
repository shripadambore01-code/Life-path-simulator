import { runSimulation } from './simulation/engine.js';

const dummyParams = {
  "monthlyIncome": 6250,
  "monthlyExpenses": 4000,
  "currentSavings": 15000,
  "annualRaiseRate": 0.03,
  "annualRaiseSigma": 0.02,
  "monthlyJobLossProbability": 0.003,
  "unemploymentDurationMean": 3,
  "unemploymentDurationSigma": 2,
  "unemploymentIncomeRatio": 0.4,
  "annualRentIncrease": 0.04,
  "annualRentIncreaseSigma": 0.02,
  "monthlyShockProbability": 0.02,
  "shockMedian": 2000,
  "shockSigma": 1,
  "monthlyInflationMean": 0.0025,
  "monthlyInflationSigma": 0.001,
  "jobLossShockMultiplier": 2.5,
  "reemploymentPayCutProbability": 0.15,
  "reemploymentPayCutRange": [0.1, 0.2]
};

const options = {
  "numSimulations": 1000,
  "horizonMonths": 60
};

console.log('Starting simulation...');
const startTime = Date.now();
const result = runSimulation(dummyParams, options);
const endTime = Date.now();

console.log(`Simulation took ${endTime - startTime}ms`);
console.log('Summary Stats:', result.summaryStats);
console.log('Fan Chart Length:', result.fanChartData.length);
console.log('Fan Chart Month 0:', result.fanChartData[0]);
console.log('Fan Chart Month 60:', result.fanChartData[60]);
