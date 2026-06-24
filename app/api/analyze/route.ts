import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = "claude-haiku-4-5";
const MAX_JOBS = 40; // cap per call to bound cost/latency

interface JobIn {
  id: string;
  title: string;
  company: string;
  location?: string;
  description?: string;
}

/* Structured-output schema. Numeric min/max aren't supported in structured
 * outputs, so `fit` is a plain integer and the 0–100 range is enforced in the
 * prompt. */
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
          reason: { type: "string" }, // one sentence: where the candidate could have impact
        },
      },
    },
  },
} as const;

const SYSTEM = `You are a precise career-fit analyst. For each job, read the description (or the title alone if no description is given) and return:
- level: the real seniority of the role (not just the title) — Internship, Entry, Mid, Senior, Lead+ (lead/staff/principal/director and up), or Unclear.
- experience: the years of experience the JD asks for, e.g. "0–2 yrs", "3–5 yrs", "5+ yrs", or "not stated".
- fit: an integer 0–100 for how well this role fits the candidate profile AND where they could make the most impact. Score HIGHER when the role's function matches the candidate's target areas and the seniority is at or just above their level (a stated 3–4 year requirement is acceptable). Score LOWER for roles that are too senior, off-function, or where the candidate would have little leverage. Be discriminating — use the full range, don't cluster everything near one number.
- reason: ONE sentence, concrete, on why it fits and where the candidate could have impact (or why it's a weak fit).
Judge impact from the substance of the JD, not the title. Return results for every job id provided.`;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set on the server. Add it to .env.local (local) or your Vercel project env vars." },
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

  const client = new Anthropic();

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM,
      output_config: { format: { type: "json_schema", schema: SCHEMA as any } },
      messages: [
        {
          role: "user",
          content: `Candidate profile:\n${profile}\n\nJobs to score (JSON):\n${JSON.stringify(compact)}`,
        },
      ],
    });

    const text = res.content.find((b) => b.type === "text");
    const raw = text && "text" in text ? text.text : "{}";
    const parsed = JSON.parse(raw);
    return NextResponse.json(
      { results: Array.isArray(parsed.results) ? parsed.results : [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    const msg = e?.error?.error?.message || e?.message || "analysis failed";
    const status = typeof e?.status === "number" ? e.status : 502;
    return NextResponse.json({ error: msg }, { status });
  }
}
