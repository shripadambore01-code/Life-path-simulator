import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import simulateRouter from './routes/simulate.js';
import analyzeRouter from './routes/analyze.js';
import explainRouter from './routes/explain.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/simulate', simulateRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/explain', explainRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
