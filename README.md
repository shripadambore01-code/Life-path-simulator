# LifePath Simulator

> **Quantitative Decision Modeling** — Empirical Monte Carlo simulation meets AI. Model thousands of correlated stochastic timelines for your major financial and life decisions.

![Status](https://img.shields.io/badge/status-Production%20Ready-emerald)
![License](https://img.shields.io/badge/license-MIT-blue)
![Vercel](https://img.shields.io/badge/deploy-Vercel%20Ready-black)

---

## What is this?

LifePath Simulator helps you weigh life-altering decisions (changing jobs, relocating cities, starting a business, taking loans) by projecting **10,000 Monte Carlo stochastic sample paths** to reveal the true distribution of financial outcomes — instead of relying on a static, single-point guess.

**Architecture Workflow:**
1. **Scenario Intake**: Describe your baseline situation and proposed decision in plain language.
2. **Econometric Parameter Synthesis**: Google Gemini extracts and bounds structured parameters (state tax impacts, cost-of-living differentials, industry risk factors).
3. **Pure Math Monte Carlo Engine**: Runs 10,000 randomized 60-month timelines using Box-Muller normal sampling, log-normal shock events, and correlated unemployment matrices.
4. **Editorial Results Dashboard**: Visualizes the outcome distribution via Financial Times–style Fan Charts, probability density histograms, and risk attribution breakdowns.
5. **Executive Strategic Briefing**: Generates qualitative analysis and risk mitigation recommendations without generic AI gimmicks.

---

## 🚀 One-Click Deployment

### Option A: Deploy to Vercel (Recommended)

1. Fork or import this repository into your [Vercel Dashboard](https://vercel.com/new).
2. Set the following **Environment Variable** in Vercel:
   - `GEMINI_API_KEY`: Your Google Gemini API Key ([Get one here](https://aistudio.google.com/apikey))
3. Click **Deploy**.
   - *The included `vercel.json` and `api/index.js` automatically configure both the Vite frontend build and the serverless Express API.*

### Option B: Deploy to Render / Railway / Fly.io

1. Create a new **Web Service** pointing to your repository.
2. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment Variable**: `GEMINI_API_KEY=your_key_here`
3. Click **Deploy**. Express will serve the built React app and all `/api/*` endpoints on a single unified port.

---

## 💻 Local Development

### Prerequisites
- Node.js 18+ (tested on Node 20 / 22 / 24)
- A [Google Gemini API Key](https://aistudio.google.com/apikey)

### 1. Clone and Install
```bash
git clone https://github.com/shripadambore01-code/Life-path-simulator.git
cd Life-path-simulator
npm install
npm run install:all
```

### 2. Configure Environment
Create a `.env` file in the `server/` directory (or in root):
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

### 3. Run Locally

**Option 1: Unified Production Mode**
```bash
npm run build
npm start
# App available at http://localhost:3001
```

**Option 2: Development Mode (Hot Reloading)**
```bash
# Terminal 1: Backend API
cd server && node index.js

# Terminal 2: Frontend Vite
cd client && npm run dev
# Frontend live at http://localhost:5173 (proxies /api to 3001)
```

---

## 📐 Monte Carlo Stochastic Model

### Mathematical Variables & Distributions

| Variable | Distribution | Default Parameterization |
|---|---|---|
| Annual Career Raises | $\mathcal{N}(\mu=3\%, \sigma=2\%)$ | Clamped between $-5\%$ and $+20\%$ |
| Involuntary Job Loss | $\text{Bernoulli}(p=0.3\%/\text{mo})$ | $\approx 3.5\%$ annual probability |
| Unemployment Duration | $\text{LogNormal}(\mu=3\text{mo}, \sigma=2\text{mo})$ | Clamped 1 to 24 months |
| Expense / Rent Escalation | $\mathcal{N}(\mu=4\%, \sigma=2\%)$ | Annual adjustment |
| Tail Shock Expenses | $\text{LogNormal}(\text{median}=\$2,000, \sigma=1.0)$ | Low-probability, high-impact ($500–$15,000) |
| Inflation Drift | $\mathcal{N}(\mu=0.25\%/\text{mo}, \sigma=0.1\%/\text{mo})$ | $\approx 3.0\%$ annualized inflation |

### Correlated Stress Factors
- **Job Loss ➔ Reserves Depletion**: Monthly expenses draw down liquid savings directly with partial UI replacement.
- **Job Loss ➔ Shock Multiplier**: Shock event probability increases by $2.5\times$ during unemployment (deferred maintenance, stress health costs).
- **Job Loss ➔ Re-employment Pay Cut**: $15\%$ probability of accepting a $10–20\%$ lower compensation upon market re-entry.
- **Macroeconomic Regime Shifts**: Hidden quarterly economic state transitions (Expansion / Neutral / Contraction) modulating raise rates and layoff hazards in unison.

---

## 🏛️ Hallmark Editorial Design System

- **Typography**: Editorial serif (*Newsreader*, *Instrument Serif*) paired with tabular monospaced figures (*JetBrains Mono*) and high-legibility sans (*Inter*).
- **Palette**: Natural warm paper (`#faf9f6` / `#f4f1ea`), deep ink black (`#09090b`), British racing green (`#047857`), and oxide crimson (`#b91c1c`).
- **Visualizations**: Financial Times–style stacked confidence interval fan charts, outcome density histograms, and risk factor attribution matrices.

---

## 📄 License

MIT © [Shripad Ambore](https://github.com/shripadambore01-code)
