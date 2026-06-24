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
  // -- enterprise / incumbents on Workday --
  { name: "Comcast",     ats: "workday",    slug: "comcast",          category: "Big Tech",   // [VERIFIED]
    workday: { host: "comcast.wd5.myworkdayjobs.com", tenant: "comcast", site: "Comcast_Careers" } },
  { name: "Target",      ats: "workday",    slug: "target",           category: "Big Tech",   // [VERIFIED]
    workday: { host: "target.wd5.myworkdayjobs.com", tenant: "target", site: "targetcareers" } },
  { name: "T-Mobile",    ats: "workday",    slug: "tmobile",          category: "Big Tech",   // [VERIFIED]
    workday: { host: "tmobile.wd1.myworkdayjobs.com", tenant: "tmobile", site: "External" } },
  { name: "Workday",     ats: "workday",    slug: "workday",          category: "Big Tech",   // [VERIFIED]
    workday: { host: "workday.wd5.myworkdayjobs.com", tenant: "workday", site: "Workday" } },
  { name: "HPE",         ats: "workday",    slug: "hpe",              category: "Big Tech",   // [VERIFIED]
    workday: { host: "hpe.wd5.myworkdayjobs.com", tenant: "hpe", site: "Jobsathpe" } },

  // ======================= B2B AI Startups =========================
  { name: "Glean",       ats: "greenhouse", slug: "gleanwork",        category: "AI Startups" }, // [VERIFIED]
  { name: "Writer",      ats: "ashby",      slug: "writer",           category: "AI Startups" }, // [VERIFIED]
  { name: "Hebbia",      ats: "ashby",      slug: "hebbia-ai",        category: "AI Startups" }, // [VERIFIED]
  { name: "Harvey",      ats: "ashby",      slug: "harvey",           category: "AI Startups" }, // [VERIFIED]
  { name: "Decagon",     ats: "ashby",      slug: "decagon",          category: "AI Startups" }, // [VERIFIED]
  { name: "Sierra",      ats: "ashby",      slug: "Sierra",           category: "AI Startups" }, // [VERIFIED]
  { name: "Cresta",      ats: "lever",      slug: "cresta",           category: "AI Startups" }, // [guess]
  { name: "Character.AI",ats: "ashby",      slug: "character",        category: "AI Startups" }, // [VERIFIED]
  { name: "ElevenLabs",  ats: "ashby",      slug: "elevenlabs",       category: "AI Startups" }, // [VERIFIED]
  { name: "Synthesia",   ats: "ashby",      slug: "synthesia",        category: "AI Startups" }, // [VERIFIED]
  { name: "Abridge",     ats: "ashby",      slug: "abridge",          category: "AI Startups" }, // [VERIFIED]
  { name: "Mercor",      ats: "ashby",      slug: "mercor",           category: "AI Startups" }, // [VERIFIED]
  { name: "Suno",        ats: "ashby",      slug: "suno",             category: "AI Startups" }, // [VERIFIED]
  { name: "Cartesia",    ats: "ashby",      slug: "cartesia",         category: "AI Startups" }, // [VERIFIED]
  { name: "Lindy",       ats: "gem",        slug: "lindy",            category: "AI Startups" }, // [VERIFIED]
  { name: "Typeface",    ats: "greenhouse", slug: "typeface",         category: "AI Startups" }, // [VERIFIED]
  { name: "Runway",      ats: "ashby",      slug: "runway",           category: "AI Startups" }, // [VERIFIED]
  { name: "Descript",    ats: "greenhouse", slug: "descript",         category: "AI Startups" }, // [VERIFIED]
  { name: "Gamma",       ats: "ashby",      slug: "gamma",            category: "AI Startups" }, // [VERIFIED]
  { name: "Dust",        ats: "ashby",      slug: "dust",             category: "AI Startups" }, // [VERIFIED]
  { name: "Lovable",     ats: "greenhouse", slug: "lovable",          category: "AI Startups" }, // [VERIFIED]
  { name: "OpenEvidence",ats: "ashby",      slug: "openevidence",     category: "AI Startups" }, // [VERIFIED]
  { name: "Ambience",    ats: "ashby",      slug: "ambiencehealthcare", category: "AI Startups" }, // [VERIFIED]

  // ========================= Frontier Labs =========================
  { name: "Anthropic",   ats: "greenhouse", slug: "anthropic",        category: "AI Startups" }, // [VERIFIED]
  { name: "OpenAI",      ats: "ashby",      slug: "openai",           category: "AI Startups" }, // [VERIFIED]
  { name: "Cognition",   ats: "ashby",      slug: "cognition",        category: "AI Startups" }, // [VERIFIED]
  { name: "Scale AI",    ats: "greenhouse", slug: "scaleai",          category: "AI Startups" }, // [VERIFIED]
  { name: "Cohere",      ats: "ashby",      slug: "cohere",           category: "AI Startups" }, // [guess]
  { name: "Mistral AI",  ats: "lever",      slug: "mistral",          category: "AI Startups" }, // [VERIFIED]
  { name: "xAI",         ats: "greenhouse", slug: "xai",              category: "AI Startups" }, // [VERIFIED]
  { name: "Imbue",       ats: "greenhouse", slug: "imbue",            category: "AI Startups" }, // [VERIFIED]
  { name: "Poolside",    ats: "ashby",      slug: "poolside",         category: "AI Startups" }, // [VERIFIED]

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
  // -- enterprise finance on Workday --
  { name: "BlackRock",   ats: "workday",    slug: "blackrock",        category: "Fintech",   // [VERIFIED]
    workday: { host: "blackrock.wd1.myworkdayjobs.com", tenant: "blackrock", site: "BlackRock_Professional" } },
  { name: "Mastercard",  ats: "workday",    slug: "mastercard",       category: "Fintech",   // [VERIFIED]
    workday: { host: "mastercard.wd1.myworkdayjobs.com", tenant: "mastercard", site: "CorporateCareers" } },
  { name: "Citi",        ats: "workday",    slug: "citi",             category: "Fintech",   // [VERIFIED]
    workday: { host: "citi.wd5.myworkdayjobs.com", tenant: "citi", site: "2" } },
  { name: "Capital One", ats: "workday",    slug: "capitalone",       category: "Fintech",   // [VERIFIED]
    workday: { host: "capitalone.wd12.myworkdayjobs.com", tenant: "capitalone", site: "Capital_One" } },
  { name: "Morgan Stanley", ats: "workday", slug: "morganstanley",    category: "Fintech",   // [VERIFIED]
    workday: { host: "ms.wd5.myworkdayjobs.com", tenant: "ms", site: "External" } },
  { name: "State Street",ats: "workday",    slug: "statestreet",      category: "Fintech",   // [VERIFIED]
    workday: { host: "statestreet.wd1.myworkdayjobs.com", tenant: "statestreet", site: "Global" } },
  { name: "Nasdaq",      ats: "workday",    slug: "nasdaq",           category: "Fintech",   // [VERIFIED]
    workday: { host: "nasdaq.wd1.myworkdayjobs.com", tenant: "nasdaq", site: "Global_External_Site" } },
  { name: "PayPal",      ats: "workday",    slug: "paypal",           category: "Fintech",   // [VERIFIED]
    workday: { host: "paypal.wd1.myworkdayjobs.com", tenant: "paypal", site: "jobs" } },

  // ====================== Data & Analytics =========================
  { name: "Fivetran",    ats: "greenhouse", slug: "fivetran",         category: "AI Infra" }, // [VERIFIED]
  { name: "dbt Labs",    ats: "greenhouse", slug: "dbtlabsinc",       category: "AI Infra" }, // [VERIFIED]
  { name: "Airbyte",     ats: "ashby",      slug: "airbyte",          category: "AI Infra" }, // [VERIFIED]
  { name: "Starburst",   ats: "greenhouse", slug: "starburst",        category: "AI Infra" }, // [VERIFIED]
  { name: "ClickHouse",  ats: "ashby",      slug: "clickhouse",       category: "AI Infra" }, // [VERIFIED]
  { name: "MotherDuck",  ats: "ashby",      slug: "motherduck",       category: "AI Infra" }, // [VERIFIED]
  { name: "Sigma Computing", ats: "greenhouse", slug: "sigmacomputing", category: "AI Infra" }, // [VERIFIED]
  { name: "Hightouch",   ats: "greenhouse", slug: "hightouch",        category: "AI Infra" }, // [VERIFIED]
  { name: "Atlan",       ats: "ashby",      slug: "atlan",            category: "AI Infra" }, // [VERIFIED]
  { name: "Hex",         ats: "greenhouse", slug: "hextechnologies",  category: "AI Infra" }, // [VERIFIED]
  { name: "Cribl",       ats: "greenhouse", slug: "cribl",            category: "AI Infra" }, // [VERIFIED]
  { name: "Redpanda",    ats: "greenhouse", slug: "redpandadata",     category: "AI Infra" }, // [VERIFIED]
  { name: "Astronomer",  ats: "ashby",      slug: "astronomer",       category: "AI Infra" }, // [VERIFIED]
  { name: "Dremio",      ats: "greenhouse", slug: "dremio",           category: "AI Infra" }, // [VERIFIED]
  { name: "Materialize", ats: "ashby",      slug: "materialize",      category: "AI Infra" }, // [VERIFIED]
  { name: "Dagster",     ats: "greenhouse", slug: "dagsterlabs",      category: "AI Infra" }, // [VERIFIED] (empty board ok)

  // iCIMS example (no company here uses it). Shape:
  // { name: "Acme", ats: "icims", slug: "acme", category: "Big Tech", icims: { host: "careers-acme.icims.com" } },
];

/* The four top-level sections shown on the landing page, in display order.
 * A company's `category` must be one of these. */
export const CATEGORY_ORDER = [
  "AI Infra",
  "Big Tech",
  "AI Startups",
  "Fintech",
];

/* One-line descriptor per section, shown on the landing cards. */
export const SECTION_BLURB: Record<string, string> = {
  "AI Infra": "Chips, compute, model serving, data & dev tooling",
  "Big Tech": "Established & scaled public/late-stage tech",
  "AI Startups": "Frontier labs and fast-growing applied-AI companies",
  "Fintech": "Payments, banking, and financial infrastructure",
};

/* INCLUDE — high recall on purpose. A role is a *candidate* if its title hits
 * one of these; the AI fit layer (/api/analyze) does the precise entry-level +
 * function filtering. Cast a wide net across the target functions so creative,
 * cross-functional titles (e.g. "Product Manager, Emerging Technology",
 * "Entry-level AI Transformation Consultant") are never dropped here. */
export const ROLE_KEYWORDS: string[] = [
  // product / program / project management
  "pm", "product manager", "associate product manager", "product owner",
  "program manager", "program management", "technical program manager",
  "project manager", "product management",
  "product operations", "product ops", "product analyst", "product strategy",
  // business / strategy & operations
  "business operations", "business analyst", "business strategy",
  "strategy and operations", "strategy & operations", "strategy analyst",
  "strategy associate", "strategy manager", "strategy specialist",
  "corporate strategy", "operations analyst", "operations associate",
  "revenue operations", "revenue strategy", "growth strategy",
  "go-to-market", "gtm strategy", "chief of staff",
  // AI / transformation / consulting
  "ai strategy", "ai strategist", "ai transformation", "ai consultant",
  "ai program", "strategy consultant", "transformation consultant",
  "technology consultant", "management consultant", "digital transformation",
  // forward-deployed / solutions / deployment
  "forward deployed", "deployment strategist", "solutions consultant",
  "implementation consultant",
];

/* EXCLUDE — always applied; drops a candidate even if it matched include.
 * Deliberately SENIORITY-light: it removes only clearly-senior (5+ yr) and
 * off-target functions, leaving entry/associate/mid (≤4 yr) for the AI layer
 * to judge. Note: bare "ii" is allowed (Manager II ≈ 2–4 yr); "chief" is NOT
 * excluded so "Chief of Staff" survives. */
export const EXCLUDE_KEYWORDS: string[] = [
  // clearly senior (5+ yr). NB: bare "staff" would nuke "Chief of Staff", so we
  // exclude staff-level target roles specifically instead.
  "senior", "sr", "principal", "lead", "director", "head of",
  "vp", "vice president", "svp", "evp", "distinguished",
  "staff product", "staff program", "staff strategy", "staff business",
  "group product manager", "gpm", "global head", "iii", "iv",
  // engineering (note: "forward deployed engineer" survives — no bare "engineer")
  "ml engineer", "machine learning engineer", "software engineer",
  "data engineer", "research engineer", "research scientist",
  "data scientist", "platform engineer", "infrastructure engineer",
  "backend engineer", "frontend engineer", "full stack", "fullstack",
  "hardware engineer", "design engineer", "devops", "security engineer",
  // clearly off-target functions
  "account executive", "sales representative", "recruiter", "accountant",
];

/* Upstream cache window (seconds). 1800 = 30 min; 300 = 5 min. */
export const REVALIDATE_SECONDS = 1800;
