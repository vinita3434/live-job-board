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
  { name: "Groq",        ats: "gem",        slug: "groq",             category: "AI Infra" }, // [VERIFIED] Gem
  { name: "SambaNova",   ats: "greenhouse", slug: "sambanovasystems", category: "AI Infra" }, // [guess]
  { name: "d-Matrix",    ats: "ashby",      slug: "d-Matrix",         category: "AI Infra" }, // [VERIFIED]
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
  { name: "LangChain",   ats: "ashby",      slug: "langchain",        category: "AI Infra" }, // [VERIFIED]
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
  // -- speech / data labeling / streaming --
  { name: "Deepgram",    ats: "ashby",      slug: "deepgram",         category: "AI Infra" }, // [VERIFIED]
  { name: "AssemblyAI",  ats: "greenhouse", slug: "assemblyai",       category: "AI Infra" }, // [VERIFIED]
  { name: "Snorkel AI",  ats: "greenhouse", slug: "snorkelai",        category: "AI Infra" }, // [VERIFIED]
  { name: "Labelbox",    ats: "greenhouse", slug: "labelbox",         category: "AI Infra" }, // [VERIFIED]
  { name: "Confluent",   ats: "ashby",      slug: "confluent",        category: "AI Infra" }, // [VERIFIED]
  // -- vector DB / eval / data prep / voice infra --
  { name: "Chroma",      ats: "ashby",      slug: "trychroma",        category: "AI Infra" }, // [VERIFIED]
  { name: "Arize",       ats: "greenhouse", slug: "arizeai",          category: "AI Infra" }, // [VERIFIED]
  { name: "Galileo",     ats: "greenhouse", slug: "galileo",          category: "AI Infra" }, // [VERIFIED]
  { name: "Unstructured",ats: "ashby",      slug: "unstructured",     category: "AI Infra" }, // [VERIFIED]
  { name: "Vapi",        ats: "ashby",      slug: "vapi",             category: "AI Infra" }, // [VERIFIED]

  // ============================ Big Tech ============================
  { name: "Databricks",  ats: "greenhouse", slug: "databricks",       category: "Big Tech" }, // [VERIFIED]
  { name: "Figma",       ats: "greenhouse", slug: "figma",            category: "Big Tech" }, // [VERIFIED]
  { name: "Notion",      ats: "ashby",      slug: "notion",           category: "Big Tech" }, // [VERIFIED]
  { name: "ServiceNow",  ats: "smartrecruiters", slug: "ServiceNow",  category: "Big Tech" }, // [VERIFIED]
  { name: "Salesforce",  ats: "workday",    slug: "salesforce",       category: "Big Tech",   // [VERIFIED]
    workday: { host: "salesforce.wd12.myworkdayjobs.com", tenant: "salesforce", site: "External_Career_Site" } },
  { name: "Snowflake",   ats: "ashby",      slug: "snowflake",        category: "Big Tech" }, // [VERIFIED]
  // -- incumbents on Workday --
  { name: "NVIDIA",      ats: "workday",    slug: "nvidia",           category: "Big Tech",   // [VERIFIED]
    workday: { host: "nvidia.wd5.myworkdayjobs.com", tenant: "nvidia", site: "NVIDIAExternalCareerSite" } },
  { name: "Adobe",       ats: "workday",    slug: "adobe",            category: "Big Tech",   // [VERIFIED]
    workday: { host: "adobe.wd5.myworkdayjobs.com", tenant: "adobe", site: "external_experienced" } },
  { name: "Intel",       ats: "workday",    slug: "intel",            category: "Big Tech",   // [VERIFIED]
    workday: { host: "intel.wd1.myworkdayjobs.com", tenant: "intel", site: "External" } },
  // -- proprietary career sites (custom adapters) --
  { name: "Microsoft",   ats: "microsoft",  slug: "microsoft",        category: "Big Tech" }, // [VERIFIED]
  { name: "Amazon",      ats: "amazon",     slug: "amazon",           category: "Big Tech" }, // [VERIFIED] (covers AWS)
  { name: "Google",      ats: "google",     slug: "google",           category: "Big Tech" }, // [VERIFIED]
  // -- public tech on Greenhouse --
  { name: "Airbnb",      ats: "greenhouse", slug: "airbnb",           category: "Big Tech" }, // [VERIFIED]
  { name: "Datadog",     ats: "greenhouse", slug: "datadog",          category: "Big Tech" }, // [VERIFIED]
  { name: "MongoDB",     ats: "greenhouse", slug: "mongodb",          category: "Big Tech" }, // [VERIFIED]
  { name: "DoorDash",    ats: "greenhouse", slug: "doordashusa",      category: "Big Tech" }, // [VERIFIED]
  { name: "Samsara",     ats: "greenhouse", slug: "samsara",          category: "Big Tech" }, // [VERIFIED]
  { name: "Roblox",      ats: "greenhouse", slug: "roblox",           category: "Big Tech" }, // [VERIFIED]
  { name: "Unity",       ats: "greenhouse", slug: "unity3d",          category: "Big Tech" }, // [VERIFIED]
  { name: "Elastic",     ats: "greenhouse", slug: "elastic",          category: "Big Tech" }, // [VERIFIED]
  { name: "Cloudflare",  ats: "greenhouse", slug: "cloudflare",       category: "Big Tech" }, // [VERIFIED]
  { name: "Pinterest",   ats: "greenhouse", slug: "pinterest",        category: "Big Tech" }, // [VERIFIED]
  { name: "Reddit",      ats: "greenhouse", slug: "reddit",           category: "Big Tech" }, // [VERIFIED]
  { name: "Instacart",   ats: "greenhouse", slug: "instacart",        category: "Big Tech" }, // [VERIFIED]
  { name: "Lyft",        ats: "greenhouse", slug: "lyft",             category: "Big Tech" }, // [VERIFIED]
  { name: "Twilio",      ats: "greenhouse", slug: "twilio",           category: "Big Tech" }, // [VERIFIED]
  { name: "GitLab",      ats: "greenhouse", slug: "gitlab",           category: "Big Tech" }, // [VERIFIED]
  { name: "Asana",       ats: "greenhouse", slug: "asana",            category: "Big Tech" }, // [VERIFIED]
  { name: "Discord",     ats: "greenhouse", slug: "discord",          category: "Big Tech" }, // [VERIFIED]
  { name: "Dropbox",     ats: "greenhouse", slug: "dropbox",          category: "Big Tech" }, // [VERIFIED]
  // -- newer / fast-growing --
  { name: "Okta",        ats: "greenhouse", slug: "okta",             category: "Big Tech" }, // [VERIFIED]
  { name: "Toast",       ats: "greenhouse", slug: "toast",            category: "Big Tech" }, // [VERIFIED]
  { name: "Webflow",     ats: "greenhouse", slug: "webflow",          category: "Big Tech" }, // [VERIFIED]
  { name: "Airtable",    ats: "greenhouse", slug: "airtable",         category: "Big Tech" }, // [VERIFIED]
  { name: "Postman",     ats: "greenhouse", slug: "postman",          category: "Big Tech" }, // [VERIFIED]
  { name: "Verkada",     ats: "greenhouse", slug: "verkada",          category: "Big Tech" }, // [VERIFIED]
  { name: "Rubrik",      ats: "greenhouse", slug: "rubrik",           category: "Big Tech" }, // [VERIFIED]
  { name: "Linear",      ats: "ashby",      slug: "linear",           category: "Big Tech" }, // [VERIFIED]
  { name: "Anduril",     ats: "greenhouse", slug: "andurilindustries", category: "Big Tech" }, // [VERIFIED]
  { name: "Wiz",         ats: "greenhouse", slug: "wizinc",           category: "Big Tech" }, // [VERIFIED]
  { name: "1Password",   ats: "ashby",      slug: "1password",        category: "Big Tech" }, // [VERIFIED]
  { name: "Box",         ats: "greenhouse", slug: "boxinc",           category: "Big Tech" }, // [VERIFIED]
  { name: "Calendly",    ats: "greenhouse", slug: "calendly",         category: "Big Tech" }, // [VERIFIED]
  { name: "Gong",        ats: "smartrecruiters", slug: "gong",        category: "Big Tech" }, // [VERIFIED]
  { name: "Duolingo",    ats: "greenhouse", slug: "duolingo",         category: "Big Tech" }, // [VERIFIED]
  { name: "Faire",       ats: "greenhouse", slug: "faire",            category: "Big Tech" }, // [VERIFIED]
  { name: "ServiceTitan",ats: "smartrecruiters", slug: "servicetitan", category: "Big Tech" }, // [VERIFIED]
  { name: "Benchling",   ats: "ashby",      slug: "benchling",        category: "Big Tech" }, // [VERIFIED]
  { name: "Vanta",       ats: "ashby",      slug: "vanta",            category: "Big Tech" }, // [VERIFIED]
  { name: "Coursera",    ats: "greenhouse", slug: "coursera",         category: "Big Tech" }, // [VERIFIED]
  { name: "Nextdoor",    ats: "greenhouse", slug: "nextdoor",         category: "Big Tech" }, // [VERIFIED]
  { name: "Ironclad",    ats: "ashby",      slug: "ironcladhq",       category: "Big Tech" }, // [VERIFIED]
  { name: "Canva",       ats: "smartrecruiters", slug: "canva",       category: "Big Tech" }, // [VERIFIED]
  { name: "Squarespace", ats: "greenhouse", slug: "squarespace",      category: "Big Tech" }, // [VERIFIED]

  // ======================= B2B AI Startups =========================
  { name: "Glean",       ats: "greenhouse", slug: "gleanwork",        category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Writer",      ats: "ashby",      slug: "writer",           category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Hebbia",      ats: "ashby",      slug: "hebbia-ai",        category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Harvey",      ats: "ashby",      slug: "harvey",           category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Decagon",     ats: "ashby",      slug: "decagon",          category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Sierra",      ats: "ashby",      slug: "Sierra",           category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Cresta",      ats: "lever",      slug: "cresta",           category: "B2B AI Startups" }, // [guess]
  { name: "Character.AI",ats: "ashby",      slug: "character",        category: "B2B AI Startups" }, // [VERIFIED]
  { name: "ElevenLabs",  ats: "ashby",      slug: "elevenlabs",       category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Synthesia",   ats: "ashby",      slug: "synthesia",        category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Abridge",     ats: "ashby",      slug: "abridge",          category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Mercor",      ats: "ashby",      slug: "mercor",           category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Suno",        ats: "ashby",      slug: "suno",             category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Cartesia",    ats: "ashby",      slug: "cartesia",         category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Lindy",       ats: "gem",        slug: "lindy",            category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Typeface",    ats: "greenhouse", slug: "typeface",         category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Runway",      ats: "ashby",      slug: "runway",           category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Descript",    ats: "greenhouse", slug: "descript",         category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Gamma",       ats: "ashby",      slug: "gamma",            category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Dust",        ats: "ashby",      slug: "dust",             category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Lovable",     ats: "greenhouse", slug: "lovable",          category: "B2B AI Startups" }, // [VERIFIED]
  { name: "OpenEvidence",ats: "ashby",      slug: "openevidence",     category: "B2B AI Startups" }, // [VERIFIED]
  { name: "Ambience",    ats: "ashby",      slug: "ambiencehealthcare", category: "B2B AI Startups" }, // [VERIFIED]

  // ========================= Frontier Labs =========================
  { name: "Anthropic",   ats: "greenhouse", slug: "anthropic",        category: "Frontier Labs" }, // [VERIFIED]
  { name: "OpenAI",      ats: "ashby",      slug: "openai",           category: "Frontier Labs" }, // [VERIFIED]
  { name: "Cognition",   ats: "ashby",      slug: "cognition",        category: "Frontier Labs" }, // [VERIFIED]
  { name: "Scale AI",    ats: "greenhouse", slug: "scaleai",          category: "Frontier Labs" }, // [VERIFIED]
  { name: "Cohere",      ats: "ashby",      slug: "cohere",           category: "Frontier Labs" }, // [guess]
  { name: "Mistral AI",  ats: "lever",      slug: "mistral",          category: "Frontier Labs" }, // [VERIFIED]
  { name: "xAI",         ats: "greenhouse", slug: "xai",              category: "Frontier Labs" }, // [VERIFIED]
  { name: "Imbue",       ats: "greenhouse", slug: "imbue",            category: "Frontier Labs" }, // [VERIFIED]
  { name: "Poolside",    ats: "ashby",      slug: "poolside",         category: "Frontier Labs" }, // [VERIFIED]

  // ============================ Fintech ============================
  { name: "Stripe",      ats: "greenhouse", slug: "stripe",           category: "Fintech" }, // [VERIFIED]
  { name: "Brex",        ats: "greenhouse", slug: "brex",             category: "Fintech" }, // [VERIFIED]
  { name: "Ramp",        ats: "ashby",      slug: "ramp",             category: "Fintech" }, // [VERIFIED]
  { name: "Mercury",     ats: "greenhouse", slug: "mercury",          category: "Fintech" }, // [VERIFIED]
  { name: "Chime",       ats: "greenhouse", slug: "chime",            category: "Fintech" }, // [VERIFIED]
  { name: "Affirm",      ats: "greenhouse", slug: "affirm",           category: "Fintech" }, // [VERIFIED]
  { name: "Coinbase",    ats: "greenhouse", slug: "coinbase",         category: "Fintech" }, // [VERIFIED]
  { name: "Robinhood",   ats: "greenhouse", slug: "robinhood",        category: "Fintech" }, // [VERIFIED]
  { name: "Adyen",       ats: "greenhouse", slug: "adyen",            category: "Fintech" }, // [VERIFIED]
  { name: "Marqeta",     ats: "greenhouse", slug: "marqeta",          category: "Fintech" }, // [VERIFIED]
  { name: "Bill",        ats: "greenhouse", slug: "billcom",          category: "Fintech" }, // [VERIFIED]
  { name: "Modern Treasury", ats: "ashby",  slug: "moderntreasury",   category: "Fintech" }, // [VERIFIED]
  { name: "Deel",        ats: "ashby",      slug: "deel",             category: "Fintech" }, // [VERIFIED]
  { name: "Gusto",       ats: "greenhouse", slug: "gusto",            category: "Fintech" }, // [VERIFIED]
  { name: "Navan",       ats: "greenhouse", slug: "tripactions",      category: "Fintech" }, // [VERIFIED]
  { name: "Alloy",       ats: "greenhouse", slug: "alloy",            category: "Fintech" }, // [VERIFIED]
  { name: "Socure",      ats: "ashby",      slug: "socure",           category: "Fintech" }, // [VERIFIED]
  { name: "Block (Square)", ats: "smartrecruiters", slug: "Square",   category: "Fintech" }, // [guess] confirm via Sources
  { name: "Plaid",       ats: "ashby",      slug: "plaid",            category: "Fintech" }, // [VERIFIED]
  { name: "Carta",       ats: "greenhouse", slug: "carta",            category: "Fintech" }, // [VERIFIED]

  // ====================== Data & Analytics =========================
  { name: "Fivetran",    ats: "greenhouse", slug: "fivetran",         category: "Data & Analytics" }, // [VERIFIED]
  { name: "dbt Labs",    ats: "greenhouse", slug: "dbtlabsinc",       category: "Data & Analytics" }, // [VERIFIED]
  { name: "Airbyte",     ats: "ashby",      slug: "airbyte",          category: "Data & Analytics" }, // [VERIFIED]
  { name: "Starburst",   ats: "greenhouse", slug: "starburst",        category: "Data & Analytics" }, // [VERIFIED]
  { name: "ClickHouse",  ats: "ashby",      slug: "clickhouse",       category: "Data & Analytics" }, // [VERIFIED]
  { name: "MotherDuck",  ats: "ashby",      slug: "motherduck",       category: "Data & Analytics" }, // [VERIFIED]
  { name: "Sigma Computing", ats: "greenhouse", slug: "sigmacomputing", category: "Data & Analytics" }, // [VERIFIED]
  { name: "Hightouch",   ats: "greenhouse", slug: "hightouch",        category: "Data & Analytics" }, // [VERIFIED]
  { name: "Atlan",       ats: "ashby",      slug: "atlan",            category: "Data & Analytics" }, // [VERIFIED]
  { name: "Hex",         ats: "greenhouse", slug: "hextechnologies",  category: "Data & Analytics" }, // [VERIFIED]
  { name: "Cribl",       ats: "greenhouse", slug: "cribl",            category: "Data & Analytics" }, // [VERIFIED]
  { name: "Redpanda",    ats: "greenhouse", slug: "redpandadata",     category: "Data & Analytics" }, // [VERIFIED]
  { name: "Astronomer",  ats: "ashby",      slug: "astronomer",       category: "Data & Analytics" }, // [VERIFIED]
  { name: "Dremio",      ats: "greenhouse", slug: "dremio",           category: "Data & Analytics" }, // [VERIFIED]
  { name: "Materialize", ats: "ashby",      slug: "materialize",      category: "Data & Analytics" }, // [VERIFIED]
  { name: "Dagster",     ats: "greenhouse", slug: "dagsterlabs",      category: "Data & Analytics" }, // [VERIFIED] (empty board ok)

  // iCIMS example (no company here uses it). Shape:
  // { name: "Acme", ats: "icims", slug: "acme", category: "Big Tech", icims: { host: "careers-acme.icims.com" } },
];

/* Section order / tab order in the UI. */
export const CATEGORY_ORDER = [
  "AI Infra",
  "Big Tech",
  "B2B AI Startups",
  "Frontier Labs",
  "Fintech",
  "Data & Analytics",
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
  "senior", "sr", "staff", "principal", "lead", "director", "head of",
  "vp", "vice president", "chief", "distinguished", "executive",
  // mid-level numbering (e.g. "Product Manager II", "Analyst III")
  "ii", "iii",
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
