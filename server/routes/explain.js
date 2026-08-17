import express from 'express';
import { explainResults } from '../gemini/client.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { summaryStats, riskContributions, percentiles, userContext } = req.body;
        const explanation = await explainResults(summaryStats, riskContributions, percentiles, userContext);
        res.json({ explanation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
