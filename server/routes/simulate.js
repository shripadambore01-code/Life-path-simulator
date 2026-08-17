import express from 'express';
import { runSimulation } from '../simulation/engine.js';

const router = express.Router();

router.post('/', (req, res) => {
    try {
        const { params, options } = req.body;
        const horizonYears = options?.horizon || options?.horizonYears || 5;
        const numSimulations = options?.numSimulations || 10000;

        // If params come from ParameterReview (object with .value), extract values
        const simParams = {};
        for (const [key, val] of Object.entries(params)) {
            if (val && typeof val === 'object' && 'value' in val) {
                simParams[key] = Number(val.value);
            } else {
                simParams[key] = Number(val);
            }
        }

        // Ensure reemploymentPayCutRange is an array
        if (!Array.isArray(simParams.reemploymentPayCutRange)) {
            simParams.reemploymentPayCutRange = [0.1, 0.2];
        }

        console.log(`Running ${numSimulations} simulations over ${horizonYears} years...`);
        const start = Date.now();

        const result = runSimulation(simParams, {
            numSimulations,
            horizonMonths: horizonYears * 12
        });

        const elapsed = Date.now() - start;
        console.log(`Simulation completed in ${elapsed}ms`);

        res.json(result);
    } catch (error) {
        console.error('Simulation error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
