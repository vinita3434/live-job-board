import type { CompanyConfig } from "./types";

/* ------------------------------------------------------------------ *
 *  YOUR BOARD — edit this file and redeploy.
 *
 *  ats: "greenhouse" | "lever" | "ashby" | "smartrecruiters" -> needs `slug`
 *  ats: "workday"  -> needs `workday: { host, tenant, site }`
 *  ats: "icims"    -> needs `icims: { host }` (best-effort HTML parse)
 *
 *  slug = the id in the careers URL (Ashby slugs are CASE-SENSITIVE):
 *    boards.greenhouse.io/SLUG · jobs.lever.co/SLUG ·
 *    jobs.ashbyhq.com/SLUG · careers.smartrecruiters.com/SLUG
 *
 *  Status light per company (open the Sources panel): RED = bad slug.
 *  [VERIFIED] = checked live (June 2026).  [guess] = confirm via the light.
 * ------------------------------------------------------------------ */

export const COMPANIES: CompanyConfig[] = [
  // ============================ AI Infra ============================
  // -- Silicon / hardware --
  { name: "Cerebras",    ats: "greenhouse", slug: "cerebrassystems",  category: "AI Infra" }, // [VERIFIED]
  { name: "Tenstorrent", ats: "greenhouse", slug: "tenstorrent",      category: "AI Infra" }, // [VERIFIED]
  { name: "MatX",        ats: "greenhouse", slug: "matx",             category: "AI Infra" }, // [VERIFIED]
  { name: "Groq",        ats: "greenhouse", slug: "groq",             category: "AI Infra" }, // [guess]
  { name: "SambaNova",   ats: "greenhouse", slug: "sambanovasystems", category: "AI Infra" }, // [guess]
  { name: "d-Matrix",    ats: "lever",      slug: "dmatrix",          category: "AI Infra" }, // [guess]
  { name: "Etched",      ats: "ashby",      slug: "etched",           category: "AI Infra" }, // [guess]
  { name: "Lightmatter", ats: "greenhouse", slug: "lightmatter",      category: "AI Infra" }, // [guess]
  // -- Cloud GPU / compute --
  { name: "CoreWeave",   ats: "greenhouse", slug: "coreweave",        category: "AI Infra" }, // [VERIFIED]
  { name: "Together AI", ats: "greenhouse", slug: "togetherai",       category: "AI Infra" }, // [VERIFIED]
  { name: "Lambda",      ats: "greenhouse", slug: "lambdalabs",       category: "AI Infra" }, // [guess]
  { name: "Crusoe",      ats: "greenhouse", slug: "crusoeenergy",     category: "AI Infra" }, // [guess]
  { name: "Nebius",      ats: "greenhouse", slug: "nebius",           category: "AI Infra" }, // [guess]
  { name: "RunPod",      ats: "ashby",      slug: "runpod",           category: "AI Infra" }, // [guess]
  // -- Model serving / inference --
  { name: "Baseten",     ats: "ashby",      slug: "baseten",          category: "AI Infra" }, // [VERIFIED]
  { name: "Fireworks AI",ats: "ashby",      slug: "fireworks.ai",     category: "AI Infra" }, // [VERIFIED]
  { name: "Modal",       ats: "ashby",      slug: "modal",            category: "AI Infra" }, // [VERIFIED]
  { name: "Replicate",   ats: "ashby",      slug: "replicate",        category: "AI Infra" }, // [guess]
  { name: "Fal",         ats: "ashby",      slug: "fal",              category: "AI Infra" }, // [guess]
  // -- Orchestration / data / agents infra --
  { name: "Anyscale",    ats: "lever",      slug: "anyscale",         category: "AI Infra" }, // [VERIFIED]
  { name: "Pinecone",    ats: "ashby",      slug: "pinecone",         category: "AI Infra" }, // [VERIFIED]
  { name: "Temporal",    ats: "ashby",      slug: "temporal",         category: "AI Infra" }, // [guess]
  { name: "Weaviate",    ats: "ashby",      slug: "weaviate",         category: "AI Infra" }, // [guess]
  { name: "LangChain",   ats: "ashby",      slug: "langchain",        category: "AI Infra" }, // [guess]
  // -- Observability / eval --
  { name: "Braintrust",  ats: "ashby",      slug: "Braintrust",       category: "AI Infra" }, // [VERIFIED]
  { name: "Weights & Biases", ats: "greenhouse", slug: "weightsandbiases", category: "AI Infra" }, // [guess]
  // -- Application & developer tooling --
  { name: "Vercel",      ats: "greenhouse", slug: "vercel",           category: "AI Infra" }, // [VERIFIED]
  { name: "Replit",      ats: "ashby",      slug: "replit",           category: "AI Infra" }, // [VERIFIED]
  { name: "Perplexity",  ats: "ashby",      slug: "Perplexity",       category: "AI Infra" }, // [VERIFIED]
  { name: "Sourcegraph", ats: "greenhouse", slug: "sourcegraph91",    category: "AI Infra" }, // [VERIFIED]
  { name: "Anysphere (Cursor)", ats: "ashby", slug: "anysphere",      category: "AI Infra" }, // [guess]
  { name: "Hugging Face",ats: "greenhouse", slug: "huggingface",      category: "AI Infra" }, // [guess]

  // ============================ Big Tech ============================
  { name: "Databricks",  ats: "greenhouse", slug: "databricks",       category: "Big Tech" }, // [VERIFIED]
  { name: "Figma",       ats: "greenhouse", slug: "figma",            category: "Big Tech" }, // [VERIFIED]
  { name: "Notion",      ats: "ashby",      slug: "notion",           category: "Big Tech" }, // [VERIFIED]
  { name: "ServiceNow",  ats: "smartrecruiters", slug: "ServiceNow",  category: "Big Tech" }, // [VERIFIED]
  { name: "Salesforce",  ats: "workday",    slug: "salesforce",       category: "Big Tech",   // [VERIFIED]
    workday: { host: "salesforce.wd12.myworkdayjobs.com", tenant: "salesforce", site: "External_Career_Site" } },
  { name: "Snowflake",   ats: "greenhouse", slug: "snowflake",        category: "Big Tech" }, // [guess]

  // ======================= B2B AI Startups =========================
  { name: "Glean",       ats: "greenhouse", slug: "gleanwork",        category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Writer",      ats: "ashby",      slug: "writer",           category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Hebbia",      ats: "ashby",      slug: "hebbia-ai",        category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Harvey",      ats: "ashby",      slug: "harvey",           category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Decagon",     ats: "ashby",      slug: "decagon",          category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Sierra",      ats: "ashby",      slug: "Sierra",           category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Cresta",      ats: "lever",      slug: "cresta",           category: "B2B AI Startups" }, // [guess]

  // ========================= Frontier Labs =========================
  { name: "Anthropic",   ats: "greenhouse", slug: "anthropic",        category: "Frontier Labs" }, // [VERIFIED]
  { name: "OpenAI",      ats: "ashby",      slug: "openai",           category: "Frontier Labs" }, // [VERIFIED]
  { name: "Cognition",   ats: "ashby",      slug: "cognition",        category: "Frontier Labs" }, // [VERIFIED]
  { name: "Scale AI",    ats: "ashby",      slug: "scaleai",          category: "Frontier Labs" }, // [guess]
  { name: "Cohere",      ats: "ashby",      slug: "cohere",           category: "Frontier Labs" }, // [guess]
  { name: "Mistral AI",  ats: "lever",      slug: "mistral",          category: "Frontier Labs" }, // [VERIFIED]

  // iCIMS example (no company here uses it). Shape:
  // { name: "Acme", ats: "icims", slug: "acme", category: "Big Tech", icims: { host: "careers-acme.icims.com" } },
];

/* Section order / tab order in the UI. */
export const CATEGORY_ORDER = [
  "AI Infra",
  "Big Tech",
  "B2B AI Startups",
  "Frontier Labs",
];

/* INCLUDE — a role is shown only if its title contains one of these. */
export const ROLE_KEYWORDS: string[] = [
  "product manager",          // also catches Associate / Junior Product Manager
  "program manager",          // also catches Associate / Junior Program Manager
  "product operations",
  "ai strategist",
  "ai strategy",
  "deployment strategist",
  "forward deployed",
  "business strategy",        // catches Business Strategy Specialist
  "strategy specialist",
  "strategy analyst",
  "business analyst",
  "product analyst",
  "product strategy",
  "strategy & operations",
  "strategy and operations",
  "business operations",
];

/* EXCLUDE — always applied. A role is dropped if its title contains any of
 * these, even if it matched an include keyword. Removes senior/VP/eng roles. */
export const EXCLUDE_KEYWORDS: string[] = [
  // seniority
  "senior", "sr.", "staff", "principal", "lead", "director", "head of",
  "vp", "vice president", "chief", "distinguished", "executive",
  "group product manager", "gpm", "global head",
  // engineering / non-PM roles
  "ml engineer", "machine learning engineer", "software engineer",
  "data engineer", "research engineer", "research scientist",
  "data scientist", "platform engineer", "infrastructure engineer",
  "backend engineer", "frontend engineer", "full stack", "fullstack",
  "hardware engineer", "design engineer", "devops",
];

/* Upstream cache window (seconds). 1800 = 30 min; 300 = 5 min. */
export const REVALIDATE_SECONDS = 1800;
