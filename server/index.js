import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import simulateRouter from './routes/simulate.js';
import analyzeRouter from './routes/analyze.js';
import explainRouter from './routes/explain.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// API Routes
app.use('/api/simulate', simulateRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/explain', explainRouter);

// Serve static frontend files if built (Production / Monolithic mode)
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// For SPA routing: fallback non-API routes to client/dist/index.html
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
        if (err) {
            next();
        }
    });
});

// Only listen if run directly (not imported as a serverless module)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
