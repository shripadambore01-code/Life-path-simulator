import express from 'express';
import { analyzeDecision } from '../gemini/client.js';

const router = express.Router();

// Default simulation parameters as fallback
const DEFAULTS = {
    monthlyIncome: 5000,
    monthlyExpenses: 3500,
    currentSavings: 10000,
    annualRaiseRate: 0.03,
    annualRaiseSigma: 0.02,
    monthlyJobLossProbability: 0.003,
    unemploymentDurationMean: 3,
    unemploymentDurationSigma: 2,
    unemploymentIncomeRatio: 0.4,
    annualRentIncrease: 0.04,
    annualRentIncreaseSigma: 0.02,
    monthlyShockProbability: 0.02,
    shockMedian: 2000,
    shockSigma: 1,
    monthlyInflationMean: 0.0025,
    monthlyInflationSigma: 0.001,
    jobLossShockMultiplier: 2.5,
    reemploymentPayCutProbability: 0.15,
    reemploymentPayCutRange: [0.1, 0.2]
};

// Parameter metadata for the review UI
const PARAM_META = {
    monthlyIncome: { label: 'Monthly Income', section: 'Income & Employment', description: 'Expected monthly take-home after the decision' },
    monthlyExpenses: { label: 'Monthly Expenses', section: 'Housing & Living Costs', description: 'Total monthly living expenses in new scenario' },
    currentSavings: { label: 'Current Savings', section: 'Income & Employment', description: 'Current savings/net worth starting point' },
    annualRaiseRate: { label: 'Annual Raise Rate', section: 'Income & Employment', description: 'Expected average annual raise (0.03 = 3%)' },
    annualRaiseSigma: { label: 'Raise Volatility', section: 'Income & Employment', description: 'Standard deviation of raise rate' },
    monthlyJobLossProbability: { label: 'Monthly Job Loss Prob.', section: 'Risk Factors', description: 'Probability of losing job in any given month (0.003 = 0.3%)' },
    unemploymentDurationMean: { label: 'Avg Unemployment (months)', section: 'Risk Factors', description: 'Average months to find new employment' },
    unemploymentDurationSigma: { label: 'Unemployment Duration Spread', section: 'Risk Factors', description: 'Variability in unemployment duration' },
    unemploymentIncomeRatio: { label: 'Unemployment Income Ratio', section: 'Risk Factors', description: 'Fraction of prior salary received during unemployment (0.4 = 40%)' },
    annualRentIncrease: { label: 'Annual Rent Increase', section: 'Housing & Living Costs', description: 'Expected annual rent/expense increase (0.04 = 4%)' },
    annualRentIncreaseSigma: { label: 'Rent Increase Volatility', section: 'Housing & Living Costs', description: 'Variability in annual rent increases' },
    monthlyShockProbability: { label: 'Monthly Shock Probability', section: 'Risk Factors', description: 'Chance of unexpected expense each month (0.02 = 2%)' },
    shockMedian: { label: 'Shock Expense Median ($)', section: 'Risk Factors', description: 'Typical size of an unexpected expense' },
    shockSigma: { label: 'Shock Expense Spread', section: 'Risk Factors', description: 'How variable the shock amounts are (log-normal sigma)' },
    monthlyInflationMean: { label: 'Monthly Inflation Rate', section: 'Economic Conditions', description: 'Average monthly inflation (0.0025 ≈ 3% annual)' },
    monthlyInflationSigma: { label: 'Inflation Volatility', section: 'Economic Conditions', description: 'Variability in monthly inflation' },
    jobLossShockMultiplier: { label: 'Job Loss Shock Multiplier', section: 'Risk Factors', description: 'How much job loss increases unexpected expense probability' },
    reemploymentPayCutProbability: { label: 'Re-employment Pay Cut Prob.', section: 'Risk Factors', description: 'Chance of accepting lower salary after job loss' },
    reemploymentPayCutRange: { label: 'Pay Cut Range', section: 'Risk Factors', description: 'Range of possible pay cuts [min, max] as fractions' }
};

router.post('/', async (req, res) => {
    try {
        const { userInput, structuredFields } = req.body;

        let geminiParams;
        try {
            geminiParams = await analyzeDecision(userInput, structuredFields);
        } catch (err) {
            console.error('Gemini analysis failed, using defaults:', err.message);
            // Fall back to computing from structured fields
            geminiParams = {
                ...DEFAULTS,
                monthlyIncome: structuredFields.income ? Number(structuredFields.income) / 12 : DEFAULTS.monthlyIncome,
                monthlyExpenses: structuredFields.expenses ? Number(structuredFields.expenses) : DEFAULTS.monthlyExpenses,
                currentSavings: structuredFields.savings ? Number(structuredFields.savings) : DEFAULTS.currentSavings,
                scenarioDescription: 'Using default parameters (AI analysis unavailable)',
                inferredAssumptions: ['Using conservative default assumptions due to analysis service unavailability']
            };
        }

        // Merge with defaults to ensure all fields exist
        const mergedParams = { ...DEFAULTS, ...geminiParams };

        // Determine which values came from the user vs AI
        const userProvidedKeys = new Set();
        if (structuredFields.income) userProvidedKeys.add('monthlyIncome');
        if (structuredFields.expenses) userProvidedKeys.add('monthlyExpenses');
        if (structuredFields.savings) userProvidedKeys.add('currentSavings');

        // Build the review-format params
        const reviewParams = {};
        for (const [key, meta] of Object.entries(PARAM_META)) {
            if (key === 'reemploymentPayCutRange') continue; // handle separately
            reviewParams[key] = {
                label: meta.label,
                value: mergedParams[key],
                source: userProvidedKeys.has(key) ? 'user' : 'ai',
                section: meta.section,
                description: meta.description
            };
        }

        res.json({
            params: reviewParams,
            scenarioDescription: mergedParams.scenarioDescription || 'Scenario analyzed',
            inferredAssumptions: mergedParams.inferredAssumptions || [],
            rawParams: mergedParams // Also send raw for direct simulation use
        });
    } catch (error) {
        console.error('Analyze error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
