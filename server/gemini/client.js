import { GoogleGenAI } from "@google/genai";

let ai;
function getClient() {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
}

export async function analyzeDecision(userInput, structuredFields) {
    const client = getClient();

    const prompt = `You are a financial analyst. Analyze this user's decision and their current financial situation. Based on the details, estimate the parameters needed for a Monte Carlo financial simulation.

USER'S DECISION: "${userInput}"

USER'S STRUCTURED DATA:
- Annual Income: $${structuredFields.income || 'not provided'}
- Current Savings: $${structuredFields.savings || 'not provided'}
- Monthly Expenses: $${structuredFields.expenses || 'not provided'}
- Location: ${structuredFields.location || 'not provided'}

INSTRUCTIONS:
1. Use the user's provided data where available.
2. For the NEW scenario (after the decision), estimate income, expenses, and other parameters based on the decision description.
3. Consider location-specific cost of living, industry job stability, and economic factors.
4. Be realistic and slightly conservative in estimates.

Return ONLY valid JSON (no markdown fences, no explanation text) with EXACTLY these fields:
{
  "monthlyIncome": <number - NEW monthly income after decision, calculated from annual>,
  "monthlyExpenses": <number - NEW estimated monthly expenses after decision>,
  "currentSavings": <number - current savings>,
  "annualRaiseRate": <number 0-0.2, e.g. 0.03 for 3%>,
  "annualRaiseSigma": <number 0-0.1, e.g. 0.02>,
  "monthlyJobLossProbability": <number 0-0.02, e.g. 0.003 for 0.3% monthly>,
  "unemploymentDurationMean": <number 1-12 months>,
  "unemploymentDurationSigma": <number 1-6>,
  "unemploymentIncomeRatio": <number 0-0.7, fraction of salary from unemployment benefits>,
  "annualRentIncrease": <number 0-0.1, e.g. 0.04 for 4%>,
  "annualRentIncreaseSigma": <number 0-0.05>,
  "monthlyShockProbability": <number 0-0.05, e.g. 0.02>,
  "shockMedian": <number 500-5000, median unexpected expense>,
  "shockSigma": <number 0.5-2.0, log-normal spread>,
  "monthlyInflationMean": <number, e.g. 0.0025 for ~3% annual>,
  "monthlyInflationSigma": <number, e.g. 0.001>,
  "jobLossShockMultiplier": <number 1.5-4.0>,
  "reemploymentPayCutProbability": <number 0-0.3>,
  "reemploymentPayCutRange": [<min fraction>, <max fraction>],
  "scenarioDescription": "<brief 1-2 sentence description of what was analyzed>",
  "inferredAssumptions": ["<assumption 1>", "<assumption 2>", ...]
}`;

    const result = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    let text = result.text.trim();
    // Strip markdown code fences if present
    if (text.startsWith('```json')) {
        text = text.slice(7);
    } else if (text.startsWith('```')) {
        text = text.slice(3);
    }
    if (text.endsWith('```')) {
        text = text.slice(0, -3);
    }

    return JSON.parse(text.trim());
}

export async function explainResults(summaryStats, riskContributions, percentiles, userContext) {
    const client = getClient();

    const prompt = `You are a financial advisor explaining Monte Carlo simulation results to a non-technical person. Write a clear, empathetic, and actionable 3-4 paragraph explanation.

SIMULATION RESULTS:
- Median final net worth: $${summaryStats.median?.toFixed(0)}
- Mean final net worth: $${summaryStats.mean?.toFixed(0)}
- Standard deviation: $${summaryStats.stddev?.toFixed(0)}
- Probability of negative net worth: ${summaryStats.negativeNetWorthPercent?.toFixed(1)}%
- Probability of ending below starting savings: ${summaryStats.lessThanStartingPercent?.toFixed(1)}%
- Starting net worth: $${summaryStats.startingNetWorth?.toFixed(0)}
- 10th percentile (worst likely): $${percentiles?.p10?.toFixed(0)}
- 25th percentile: $${percentiles?.p25?.toFixed(0)}
- 50th percentile (median): $${percentiles?.p50?.toFixed(0)}
- 75th percentile: $${percentiles?.p75?.toFixed(0)}
- 90th percentile (best likely): $${percentiles?.p90?.toFixed(0)}

TOP RISK FACTORS:
${JSON.stringify(riskContributions, null, 2)}

USER'S SCENARIO:
${JSON.stringify(userContext)}

Cover these points:
1. What the median outcome means in practical terms for their daily life
2. The biggest risks and how likely they are — be specific about which scenarios lead to bad outcomes
3. What specific actions would most improve their financial odds
4. An honest, balanced assessment of whether this decision looks favorable

Write in a warm, professional tone. Use dollar amounts. Do NOT use markdown formatting or headers — just clean paragraphs.`;

    const result = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return result.text;
}
