# LifePath Simulator

> **Monte Carlo simulation meets AI** — Model thousands of possible financial outcomes for your major life decisions, instead of relying on a single guess.

![Status](https://img.shields.io/badge/status-MVP-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## What is this?

LifePath Simulator helps you make better life decisions (changing jobs, relocating, starting a business) by running **10,000 Monte Carlo simulations** to show the full range of possible financial outcomes — not just a single optimistic or pessimistic number.

**How it works:**
1. **You describe your situation** in plain English + key financial details
2. **Gemini AI** translates your description into structured simulation parameters (income, expenses, risk factors)
3. **A real Monte Carlo engine** (pure math, not LLM guessing) runs 10,000 randomized timelines
4. **Results dashboard** shows the distribution of outcomes, risk breakdown, and AI-explained insights

### Key differentiator
The simulation models **correlated risks** — for example, job loss increases the probability of stress-related unexpected expenses AND reduces re-employment income. This produces more realistic outcome distributions than naive models that treat risks as independent.

---

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React 19 + Vite 6 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Backend | Node.js + Express |
| Simulation | Custom Monte Carlo engine (pure JavaScript) |
| AI | Google Gemini API (`gemini-2.5-flash`) via `@google/genai` |
| Fonts | Inter + Plus Jakarta Sans |

---

## Quick Start

### Prerequisites
- Node.js 18+ (tested with v24)
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/shripadambore01-code/Life-path-simulator.git
cd Life-path-simulator
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

Start the server:
```bash
node index.js
# Server running on port 3001
```

### 3. Set up the frontend
Open a new terminal:
```bash
cd client
npm install
npm run dev
# Vite dev server at http://localhost:5173
```

### 4. Open the app
Navigate to **http://localhost:5173** in your browser.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                     │
│  ┌──────────┐  ┌────────────────┐  ┌────────────────────┐  │
│  │InputForm │→ │ParameterReview │→ │ ResultsDashboard    │  │
│  │          │  │ (editable)     │  │ ├─ FanChart         │  │
│  │ + Demo   │  │                │  │ ├─ Histogram        │  │
│  │   Button │  │                │  │ ├─ RiskBreakdown    │  │
│  └────┬─────┘  └───────┬────────┘  │ └─ AIExplanation    │  │
│       │                │           └─────────┬────────────┘  │
│───────│────────────────│─────────────────────│───────────────│
        │ /api/analyze   │ /api/simulate       │ /api/explain
        ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Express Backend (:3001)                      │
│                                                              │
│  ┌──────────────┐    ┌────────────────────┐                  │
│  │ Gemini Client│    │ Monte Carlo Engine │ ← Pure math,     │
│  │ (AI only)    │    │ ├─ distributions   │   no LLM calls   │
│  │              │    │ ├─ engine          │                  │
│  │              │    │ └─ statistics      │                  │
│  └──────────────┘    └────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### Clear separation of concerns
- **Gemini AI** is used ONLY for: (1) translating natural language → simulation parameters, and (2) explaining results in plain English
- **Monte Carlo engine** is pure math — Box-Muller normal sampling, log-normal distributions, Bernoulli trials. Zero LLM involvement.

---

## Monte Carlo Model

### Simulated Variables

| Variable | Distribution | Default |
|---|---|---|
| Annual raises | Normal(μ=3%, σ=2%) | Clamped -5% to +20% |
| Job loss | Bernoulli(p=0.3%/month) | ~3.5% annual |
| Unemployment duration | Normal(μ=3mo, σ=2mo) | Clamped 1-24 months |
| Rent/expense increases | Normal(μ=4%, σ=2%) | Annual |
| Unexpected expenses | Log-normal(median=$2000) | 2% monthly chance |
| Inflation | Normal(μ=0.25%/mo, σ=0.1%/mo) | ~3% annual |

### Correlated Risks
- **Job loss → savings drawdown**: No income contribution during unemployment
- **Job loss → higher shock probability**: 2.5× increase in unexpected expense probability during unemployment
- **Job loss → pay cut risk**: 15% chance of accepting 10-20% lower salary on re-employment
- **Economic cycles**: Hidden quarterly economic state (good/neutral/bad) that affects job loss probability and raise rates simultaneously

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/analyze` | Gemini-powered parameter extraction from natural language |
| POST | `/api/simulate` | Run Monte Carlo simulation (pure math) |
| POST | `/api/explain` | Gemini-powered plain-English results explanation |

---

## Demo Scenario

Click **"Try a Demo"** to load a pre-filled scenario:
> *"I'm considering moving from Chicago to Austin, TX for a software engineering position paying $95,000, up from my current $75,000. My current rent is $1,400/month. I've heard Austin has gotten expensive but there's no state income tax."*

---

## Project Structure

```
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputForm.jsx           # Decision input form
│   │   │   ├── ParameterReview.jsx     # Review/edit AI-inferred params
│   │   │   ├── ResultsDashboard.jsx    # Main results container
│   │   │   ├── FanChart.jsx            # Trajectory spread chart
│   │   │   ├── HistogramChart.jsx      # Outcome distribution
│   │   │   ├── RiskBreakdown.jsx       # Risk factor analysis
│   │   │   ├── AIExplanation.jsx       # Gemini-generated insights
│   │   │   ├── LoadingState.jsx        # Loading animations
│   │   │   └── DemoButton.jsx          # Pre-filled example
│   │   ├── App.jsx                     # State machine & routing
│   │   ├── main.jsx                    # Entry point
│   │   └── index.css                   # Tailwind v4 theme
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                     # Express backend
│   ├── simulation/
│   │   ├── engine.js                   # Monte Carlo core (pure math)
│   │   ├── distributions.js            # Probability distributions
│   │   └── statistics.js               # Percentile/summary computation
│   ├── gemini/
│   │   └── client.js                   # Gemini API wrapper
│   ├── routes/
│   │   ├── simulate.js                 # Simulation endpoint
│   │   ├── analyze.js                  # AI analysis endpoint
│   │   └── explain.js                  # AI explanation endpoint
│   ├── index.js                        # Express entry point
│   ├── .env                            # API key (not committed)
│   └── package.json
├── .gitignore
└── README.md
```

---

## License

MIT

---

*Built for hackathon demo purposes. Not financial advice.*
