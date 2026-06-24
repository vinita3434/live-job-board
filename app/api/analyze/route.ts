import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Default to Claude Haiku via OpenRouter; override with OPENROUTER_MODEL.
const MODEL = process.env.OPENROUTER_MODEL || "anthropic/claude-haiku-4.5";
const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const MAX_JOBS = 40; // cap per call to bound cost/latency

interface JobIn {
  id: string;
  title: string;
  company: string;
  location?: string;
  description?: string;
}

/* JSON-schema for OpenAI-compatible structured outputs (strict mode needs every
 * property listed in `required` and additionalProperties:false at each level). */
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["results"],
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "level", "experience", "fit", "reason"],
        properties: {
          id: { type: "string" },
          level: {
            type: "string",
            enum: ["Internship", "Entry", "Mid", "Senior", "Lead+", "Unclear"],
          },
          experience: { type: "string" }, // e.g. "0–2 yrs", "3–5 yrs", "not stated"
          fit: { type: "integer" }, // 0–100
          reason: { type: "string" }, // one sentence on where the candidate could have impact
        },
      },
    },
  },
} as const;

const SYSTEM = `You are a precise career-fit analyst for an EARLY-CAREER job board. Its whole purpose is to surface new-grad / entry-level roles, or roles requiring AT MOST ~4 years of experience, in these target functions:
- Product management (PM, APM, Associate PM, Product Operations, Product Owner)
- Program / project management
- Strategy & operations, business operations, business analyst, strategy/operations analyst
- AI strategy / AI strategist / AI transformation / strategy or transformation consultant
- Forward-deployed (FDE), deployment strategist, solutions/implementation consultant
- Chief of Staff and similar cross-functional generalist roles

For each job, read the description (or the title alone if no description is given) and return:
- level: the real seniority (not just the title) — Internship, Entry, Mid, Senior, Lead+ (lead/staff/principal/director and up), or Unclear.
- experience: years the JD asks for, e.g. "0–2 yrs", "3–5 yrs", "5+ yrs", or "not stated".
- fit: an integer 0–100. Score HIGH (75–100) ONLY for roles in the target functions above that are genuinely entry-level to ~4 years and where this candidate could outshine and add value. Score MEDIUM (40–74) for target-function roles that are slightly senior or where fit is partial. Score LOW (0–39) for roles that require 5+ years, are clearly senior (senior/staff/principal/lead/director+), or are off-function (engineering, sales, finance, support, etc.). Reward creative/cross-functional target roles (e.g. "Product Manager, Emerging Technology", "AI Transformation Consultant") — these are exactly the roles to surface. Be discriminating; use the full range.
- reason: ONE concrete sentence on why it fits and where the candidate could add value (or why it's a weak fit).
Judge from the substance of the JD, not the title. Return results for every job id provided. Respond with JSON only.`;

/* Models sometimes wrap JSON in ```fences``` even with response_format set. */
function parseJson(s: string): any {
  const cleaned = s.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(cleaned);
}

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not set on the server. Add it to .env.local (local) or your Vercel project env vars." },
      { status: 500 }
    );
  }

  let body: { profile?: string; jobs?: JobIn[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const profile = (body.profile ?? "").trim() || "Early-career candidate targeting product, strategy, and operations roles.";
  const jobs = (body.jobs ?? []).slice(0, MAX_JOBS);
  if (jobs.length === 0) {
    return NextResponse.json({ error: "No jobs provided" }, { status: 400 });
  }

  // Keep the payload lean: only what the model needs to judge fit.
  const compact = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    location: j.location ?? "",
    description: (j.description ?? "").slice(0, 480),
  }));

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "X-Title": "goodput job board",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        max_tokens: 4096,
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `Candidate profile:\n${profile}\n\nJobs to score (JSON):\n${JSON.stringify(compact)}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "fit_results", strict: true, schema: SCHEMA },
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const msg = data?.error?.message || `OpenRouter HTTP ${res.status}`;
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    const content = data?.choices?.[0]?.message?.content ?? "{}";
    const parsed = parseJson(content);
    return NextResponse.json(
      { results: Array.isArray(parsed.results) ? parsed.results : [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "analysis failed" }, { status: 502 });
  }
}
