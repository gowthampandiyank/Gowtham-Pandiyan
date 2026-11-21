import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
}

interface PortfolioContextPayload {
  owner?: {
    name?: string;
    title?: string;
    bio?: string;
    secondaryBio?: string;
    location?: string;
    email?: string;
    linkedin?: string;
    github?: string;
    status?: string;
  };
  projects?: Array<{
    title?: string;
    category?: string;
    description?: string;
    longDescription?: string;
    technologies?: string[];
    architecture?: string;
    metrics?: Array<{ label?: string; value?: string }>;
    keyFeatures?: string[];
  }>;
  experience?: Array<{
    company?: string;
    jobTitle?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    skills?: string[];
  }>;
  skills?: Array<{
    name?: string;
    category?: string;
    proficiencyLevel?: string;
  }>;
}

const DEFAULT_PORTFOLIO_SUMMARY = `
Owner: GOWTHAM PANDIYAN KANNAN — DATA ANALYST
Location: Chennai, Tamil Nadu, India
Email: gowthampandiyan7@gmail.com
Status: Actively Modeling & Delivering Projects | Open to Data Analyst Roles
Bio: Data Analyst based in Chennai specializing in business intelligence, SQL relational data modeling, automated ETL pipelines, and executive Power BI dashboards.

Projects:
1. HR Workforce Retention & Attrition Intelligence Platform (Data Analytics)
   - Transforms 25,000+ raw employee records into executive intelligence with SQL CTEs, Power Query pipelines, PostgreSQL star-schema views, and 38 Power BI DAX measures.
   - Metrics: 25,000+ Data Points Processed, 4.2x Query Performance Boost, 94.8% Retention Model Accuracy.
2. Commercial Revenue & Multi-Channel Sales Performance Suite (Business Intelligence)
   - Multi-year sales transactions & profit margin analytics using SQL DirectQuery, PostgreSQL star schema, DAX, and Excel.
   - Metrics: $14.2M+ Total Transaction Volume, 1.4s Report Load Speed, 99.9% Profit Margin Precision, 1,280 Active Retail Nodes.
3. Global Supply Chain & Inventory Optimization Platform (Data Analytics)
   - Python Pandas + PostgreSQL + Power BI predictive inventory engine forecasting SKU stockouts across 14 distribution centers.
   - Metrics: 31.4% Stockout Reduction, $340K Carrying Cost Savings, 92.6% Forecast Accuracy, 8,400+ SKUs Monitored.
4. E-Commerce Customer Lifetime Value & RFM Segmentation Pipeline (Data Analytics)
   - Analyzes 180,000+ purchase transactions using Recency, Frequency, Monetary (RFM) quintile clustering and cohort retention heatmaps.
   - Metrics: 180,000+ Profiles Segmented, +18.2% Retention Lift, 3.8x Marketing ROI Impact, 78.4% Cohort Retention Rate.
5. Clinical Patient Readmission & Hospital Resource Utilization Analyzer (Business Intelligence)
   - Evaluates 45,000+ EHR patient admission records using SQL LEAD/LAG window functions for 30-day readmission risk scoring and bed turnover analytics.
   - Metrics: 45,000+ Records Modeled, -14.6% 30-Day Readmission Drop, 96.2% Bed Utilization Precision, $820K Cost Savings Modeled.
6. Corporate Financial Risk & Budget Variance Intelligence Suite (Financial Modeling)
   - CFO financial modeling platform using Advanced Excel, M-Code Power Query, Power BI DAX calculation groups, and EBITDA bridge waterfalls.
   - Metrics: 97.1% Forecasting Accuracy, $28.5M Budget Reconciled, -65% Reporting Cycle Time.

Experience:
1. Forte Management Services (Chennai) — Data Analyst (2024 – Present):
   Engineering end-to-end analytics solutions, PostgreSQL star-schema warehouses, DAX measures, and executive Power BI dashboards. Skills: SQL, Power BI, DAX, Advanced Excel, Data Modeling, PostgreSQL, KPI Architecture, ETL Pipelines.
2. Client Technical & Digital Solutions — Junior Data Analyst & Business Intelligence Specialist (2022 – 2024):
   Analyzed multi-million record transactional datasets, automated Power Query reporting pipelines, exploratory data analysis (EDA), and executive scorecards. Skills: Data Analysis, SQL, Power BI, Excel, Python, ETL Pipelines, Statistical Reporting, Data Quality.
`.trim();

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function formatPortfolioContext(context?: PortfolioContextPayload): string {
  if (!context || typeof context !== 'object') {
    return DEFAULT_PORTFOLIO_SUMMARY;
  }

  const sections: string[] = [];

  if (context.owner) {
    const o = context.owner;
    sections.push(
      [
        `Owner: ${sanitizeText(o.name, 120) || 'GOWTHAM PANDIYAN KANNAN'} — ${sanitizeText(o.title, 120) || 'DATA ANALYST'}`,
        o.location ? `Location: ${sanitizeText(o.location, 120)}` : '',
        o.email ? `Email: ${sanitizeText(o.email, 120)}` : '',
        o.status ? `Status: ${sanitizeText(o.status, 160)}` : '',
        o.bio ? `Bio: ${sanitizeText(o.bio, 500)}` : '',
        o.secondaryBio ? `Focus: ${sanitizeText(o.secondaryBio, 500)}` : '',
      ]
        .filter(Boolean)
        .join('\n')
    );
  }

  if (Array.isArray(context.projects) && context.projects.length > 0) {
    const projLines = context.projects.slice(0, 15).map((p, idx) => {
      const techs = Array.isArray(p.technologies)
        ? p.technologies.map((t) => sanitizeText(t, 50)).filter(Boolean).join(', ')
        : '';
      const metrics = Array.isArray(p.metrics)
        ? p.metrics
            .map((m) => `${sanitizeText(m.label, 60)}: ${sanitizeText(m.value, 40)}`)
            .filter(Boolean)
            .join(' | ')
        : '';
      const features = Array.isArray(p.keyFeatures)
        ? p.keyFeatures.slice(0, 4).map((f) => sanitizeText(f, 160)).filter(Boolean).join('; ')
        : '';
      return [
        `${idx + 1}. ${sanitizeText(p.title, 150)} (${sanitizeText(p.category, 60)})`,
        `   Summary: ${sanitizeText(p.longDescription || p.description, 500)}`,
        techs ? `   Technologies: ${techs}` : '',
        p.architecture ? `   Architecture: ${sanitizeText(p.architecture, 300)}` : '',
        metrics ? `   Metrics: ${metrics}` : '',
        features ? `   Key Features: ${features}` : '',
      ]
        .filter(Boolean)
        .join('\n');
    });
    sections.push(`Projects:\n${projLines.join('\n')}`);
  }

  if (Array.isArray(context.experience) && context.experience.length > 0) {
    const expLines = context.experience.slice(0, 10).map((e, idx) => {
      const skills = Array.isArray(e.skills)
        ? e.skills.map((s) => sanitizeText(s, 50)).filter(Boolean).join(', ')
        : '';
      return [
        `${idx + 1}. ${sanitizeText(e.jobTitle, 120)} at ${sanitizeText(e.company, 120)} (${sanitizeText(e.startDate, 40)} – ${sanitizeText(e.endDate, 40)})`,
        `   Details: ${sanitizeText(e.description, 500)}`,
        skills ? `   Skills: ${skills}` : '',
      ]
        .filter(Boolean)
        .join('\n');
    });
    sections.push(`Experience:\n${expLines.join('\n')}`);
  }

  if (Array.isArray(context.skills) && context.skills.length > 0) {
    const grouped: Record<string, string[]> = {};
    for (const skill of context.skills.slice(0, 40)) {
      const cat = sanitizeText(skill.category, 60) || 'General';
      const name = sanitizeText(skill.name, 100);
      if (!name) continue;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(
        skill.proficiencyLevel ? `${name} (${sanitizeText(skill.proficiencyLevel, 40)})` : name
      );
    }
    const skillLines = Object.entries(grouped).map(([cat, list]) => `- ${cat}: ${list.join(', ')}`);
    if (skillLines.length > 0) {
      sections.push(`Skills Inventory:\n${skillLines.join('\n')}`);
    }
  }

  return sections.length > 0 ? sections.join('\n\n') : DEFAULT_PORTFOLIO_SUMMARY;
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.json({ limit: '512kb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY?.trim();
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        res.status(503).json({
          error: 'Gemini API key is not configured on the server. Add GEMINI_API_KEY in Settings > Secrets.',
        });
        return;
      }

      const body = req.body as {
        messages?: unknown;
        portfolioContext?: PortfolioContextPayload;
      };

      if (!Array.isArray(body?.messages) || body.messages.length === 0) {
        res.status(400).json({ error: 'Please provide at least one chat message.' });
        return;
      }

      const cleanedMessages: ChatMessageInput[] = body.messages
        .slice(-12)
        .filter((item): item is ChatMessageInput => {
          if (!item || typeof item !== 'object') return false;
          const record = item as Record<string, unknown>;
          return (
            (record.role === 'user' || record.role === 'assistant') &&
            typeof record.content === 'string' &&
            record.content.trim().length > 0
          );
        })
        .map((item) => ({
          role: item.role,
          content: item.content.trim().slice(0, 2000),
        }));

      // Gemini conversation history should begin with a user turn
      while (cleanedMessages.length > 0 && cleanedMessages[0].role !== 'user') {
        cleanedMessages.shift();
      }

      if (cleanedMessages.length === 0) {
        res.status(400).json({ error: 'Please enter a valid question.' });
        return;
      }

      const portfolioSummary = formatPortfolioContext(body.portfolioContext);

      const systemInstruction = [
        'You are the concise, knowledgeable Portfolio Assistant for Gowtham Pandiyan Kannan (Data Analyst).',
        'Answer visitor questions clearly using ONLY the grounded portfolio facts below covering his projects, metrics, technical architecture, skills, work experience, and contact details.',
        'Formatting & Tone Guidelines:',
        '- Keep responses concise (typically 2 to 4 crisp sentences, or 2 to 4 short bullet points for multi-item answers).',
        '- Cite specific project names, technologies, and verified metrics from the portfolio when relevant.',
        '- Do not invent employers, certifications, tools, or metrics that are not present in the portfolio data.',
        '- If a visitor asks about something not covered in the portfolio, briefly state that it is not listed and invite them to reach out via the Contact page or email.',
        '',
        'PORTFOLIO KNOWLEDGE BASE:',
        portfolioSummary,
      ].join('\n');

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const contents = cleanedMessages.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      // Primary model with automatic free-tier fallback during high-demand (503/429) spikes
      const modelCandidates = ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'] as const;
      let responseText: string | undefined;
      let lastError: unknown;

      for (const modelName of modelCandidates) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
            },
          });
          responseText = response.text?.trim();
          lastError = undefined;
          break;
        } catch (err: unknown) {
          lastError = err;
          const errStatus = (err as { status?: number })?.status;
          const errMessage = (err as { message?: string })?.message || '';
          const isTransientOrUnavailable =
            errStatus === 503 ||
            errStatus === 429 ||
            errStatus === 404 ||
            errMessage.includes('503') ||
            errMessage.includes('UNAVAILABLE') ||
            errMessage.includes('RESOURCE_EXHAUSTED');
          if (isTransientOrUnavailable) {
            console.warn(`[/api/chat] ${modelName} unavailable (${errStatus ?? 'unknown'}), trying fallback...`);
            continue;
          }
          break;
        }
      }

      if (lastError) {
        throw lastError;
      }

      if (!responseText) {
        res.status(502).json({ error: 'The model returned an empty response. Please try again.' });
        return;
      }

      res.json({ reply: responseText });
    } catch (error: unknown) {
      const errObj = error as { status?: number; message?: string };
      const status = typeof errObj?.status === 'number' && errObj.status >= 400 ? errObj.status : 500;
      let message =
        typeof errObj?.message === 'string' && errObj.message.length > 0
          ? errObj.message
          : 'Failed to generate a response from Gemini.';

      // Extract clean human-readable message if the SDK wrapped JSON inside error.message
      if (message.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(message) as { error?: { message?: string }; message?: string };
          message = parsed?.error?.message || parsed?.message || message;
        } catch {
          // Keep original message if not valid JSON
        }
      }

      console.error('[/api/chat] Error:', message);
      res.status(status).json({ error: message });
    }
  });

  // Never let unmatched /api/* requests fall through to Vite/SPA index.html (status 200 HTML)
  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'API route not found.' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
