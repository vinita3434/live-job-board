import type { ATS, CompanyConfig, Job, SourceStatus, BoardData } from "./types";
import { COMPANIES, REVALIDATE_SECONDS } from "./companies";

export const companyId = (c: { ats: ATS; slug: string }) => `${c.ats}:${c.slug}`;

const RV = { next: { revalidate: REVALIDATE_SECONDS } } as const;

async function getJson(url: string): Promise<any> {
  const res = await fetch(url, {
    ...RV,
    headers: { Accept: "application/json", "User-Agent": "goodput-job-board" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* Strip HTML + entities, collapse whitespace, truncate to a JD summary.
 * Truncating here keeps the board payload small even with content=true. */
function cleanDesc(s?: string, max = 480): string {
  if (!s) return "";
  const t = decodeEntities(String(s).replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
  return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, "") + "…" : t;
}

/* ----------------------------- adapters --------------------------- */
async function greenhouse(c: CompanyConfig): Promise<Job[]> {
  // NB: the list endpoint omits job descriptions; `?content=true` would include
  // them but returns multi-MB HTML per board (over Next's 2MB cache limit and
  // slow), so we keep this lean. Greenhouse cards show the "open posting" note.
  const data = await getJson(
    `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(c.slug)}/jobs`
  );
  return (data.jobs ?? []).map((j: any) => ({
    id: `gh-${c.slug}-${j.id}`,
    title: j.title ?? "Untitled role",
    company: c.name,
    companyId: companyId(c),
    category: c.category ?? "",
    location: j.location?.name ?? "",
    department: (j.departments?.[0]?.name) ?? "",
    url: j.absolute_url,
    updatedAt: j.updated_at ?? null,
    description: "",
    employmentType: "",
  }));
}

async function lever(c: CompanyConfig): Promise<Job[]> {
  const data = await getJson(
    `https://api.lever.co/v0/postings/${encodeURIComponent(c.slug)}?mode=json`
  );
  return (Array.isArray(data) ? data : []).map((j: any) => ({
    id: `lv-${j.id}`,
    title: j.text ?? "Untitled role",
    company: c.name,
    companyId: companyId(c),
    category: c.category ?? "",
    location: j.categories?.location ?? "",
    department: j.categories?.team ?? "",
    url: j.hostedUrl ?? j.applyUrl,
    updatedAt: j.createdAt ? new Date(j.createdAt).toISOString() : null,
    description: cleanDesc(j.descriptionPlain ?? j.description),
    employmentType: j.categories?.commitment ?? "",
  }));
}

async function ashby(c: CompanyConfig): Promise<Job[]> {
  const data = await getJson(
    `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(c.slug)}?includeCompensation=false`
  );
  return (data.jobs ?? []).map((j: any) => ({
    id: `as-${j.id}`,
    title: j.title ?? "Untitled role",
    company: c.name,
    companyId: companyId(c),
    category: c.category ?? "",
    location: j.location ?? "",
    department: j.department ?? j.team ?? "",
    url: j.jobUrl ?? j.applyUrl,
    updatedAt: j.publishedAt ?? j.updatedAt ?? null,
    description: cleanDesc(j.descriptionPlain ?? j.descriptionHtml),
    employmentType: j.employmentType ?? "",
  }));
}

/* Workday: undocumented but stable CXS endpoint, POST + pagination.
 * Needs a per-company { host, tenant, site } block. */
function parseWorkdayPostedOn(s?: string): string | null {
  if (!s) return null;
  const t = s.toLowerCase();
  if (t.includes("today")) return new Date().toISOString();
  if (t.includes("yesterday")) return new Date(Date.now() - 86400000).toISOString();
  const d = t.match(/(\d+)\+?\s*day/);
  if (d) return new Date(Date.now() - parseInt(d[1], 10) * 86400000).toISOString();
  const mo = t.match(/(\d+)\+?\s*month/);
  if (mo) return new Date(Date.now() - parseInt(mo[1], 10) * 30 * 86400000).toISOString();
  return null;
}

async function workday(c: CompanyConfig): Promise<Job[]> {
  const wd = c.workday;
  if (!wd) throw new Error("missing workday config");
  const endpoint = `https://${wd.host}/wday/cxs/${wd.tenant}/${wd.site}/jobs`;
  const out: Job[] = [];
  const limit = 20;
  let offset = 0;
  let total = Infinity;
  for (let page = 0; page < 10 && offset < total; page++) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ appliedFacets: {}, limit, offset, searchText: "" }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    total = data.total ?? 0;
    const postings = data.jobPostings ?? [];
    for (const p of postings) {
      out.push({
        id: `wd-${wd.tenant}-${p.externalPath ?? p.title}`,
        title: p.title ?? "Untitled role",
        company: c.name,
        companyId: companyId(c),
        category: c.category ?? "",
        location: p.locationsText ?? "",
        department: "",
        url: `https://${wd.host}/en-US/${wd.site}${p.externalPath ?? ""}`,
        updatedAt: parseWorkdayPostedOn(p.postedOn),
        description: "",
        employmentType: "",
      });
    }
    if (postings.length < limit) break;
    offset += limit;
  }
  return out;
}

/* SmartRecruiters: public postings API, GET + pagination. slug = company id. */
async function smartrecruiters(c: CompanyConfig): Promise<Job[]> {
  const out: Job[] = [];
  const limit = 100;
  let offset = 0;
  let total = Infinity;
  for (let page = 0; page < 15 && offset < total; page++) {
    const data = await getJson(
      `https://api.smartrecruiters.com/v1/companies/${encodeURIComponent(c.slug)}/postings?limit=${limit}&offset=${offset}`
    );
    total = data.totalFound ?? 0;
    const items = data.content ?? [];
    for (const p of items) {
      const loc = p.location
        ? [p.location.city, p.location.region, p.location.country]
            .filter(Boolean)
            .join(", ") + (p.location.remote ? " (remote)" : "")
        : "";
      out.push({
        id: `sr-${p.id}`,
        title: p.name ?? "Untitled role",
        company: c.name,
        companyId: companyId(c),
        category: c.category ?? "",
        location: loc,
        department: p.department?.label ?? "",
        url: `https://jobs.smartrecruiters.com/${encodeURIComponent(c.slug)}/${p.id}`,
        updatedAt: p.releasedDate ?? null,
        description: "",
        employmentType: p.typeOfEmployment?.label ?? "",
      });
    }
    if (items.length < limit) break;
    offset += limit;
  }
  return out;
}

/* Gem: public GraphQL API behind jobs.gem.com/<slug>. slug = the vanity path.
 * The career page is a JS shell; this is the same query it runs client-side. */
const GEM_JOB_BOARD_QUERY = `query JobBoardList($boardId: String!) {
  oatsExternalJobPostings(boardId: $boardId) {
    jobPostings {
      id
      extId
      title
      locations { name city isoCountry isRemote }
      job { department { name } locationType employmentType }
    }
  }
}`;

async function gem(c: CompanyConfig): Promise<Job[]> {
  const res = await fetch("https://jobs.gem.com/api/public/graphql", {
    method: "POST",
    ...RV,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      query: GEM_JOB_BOARD_QUERY,
      variables: { boardId: c.slug },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.errors?.length) throw new Error(data.errors[0]?.message ?? "graphql error");
  const postings = data.data?.oatsExternalJobPostings?.jobPostings ?? [];
  return postings.map((j: any) => {
    const loc = (j.locations ?? [])
      .map((l: any) =>
        [l.city, l.name].filter(Boolean).join(", ") + (l.isRemote ? " (remote)" : "")
      )
      .filter(Boolean)
      .join("; ");
    return {
      id: `gem-${c.slug}-${j.extId ?? j.id}`,
      title: j.title ?? "Untitled role",
      company: c.name,
      companyId: companyId(c),
      category: c.category ?? "",
      location: loc,
      department: j.job?.department?.name ?? "",
      url: `https://jobs.gem.com/${encodeURIComponent(c.slug)}/${j.extId ?? j.id}`,
      updatedAt: null,
      description: "",
      employmentType: j.job?.employmentType
        ? String(j.job.employmentType).toLowerCase().replace(/_/g, "-").replace(/^\w/, (m: string) => m.toUpperCase())
        : "",
    };
  });
}

/* iCIMS has no public JSON API — its career sites are server-rendered HTML.
 * This adapter fetches the in-iframe search page and parses job anchors.
 * It is the most fragile adapter: no location/date in the list view, and
 * markup can vary per tenant. Needs an `icims: { host }` block. */
function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
}

async function getText(url: string): Promise<string> {
  const res = await fetch(url, {
    ...RV,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function icims(c: CompanyConfig): Promise<Job[]> {
  const host = c.icims?.host;
  if (!host) throw new Error("missing icims host");
  const seen = new Set<string>();
  const out: Job[] = [];
  const re =
    /<a[^>]+href="([^"]*\/jobs\/(\d+)\/[^"]*\/job[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  for (let pr = 0; pr < 10; pr++) {
    const html = await getText(
      `https://${host}/jobs/search?ss=1&in_iframe=1&pr=${pr}`
    );
    const before = out.length;
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(html)) !== null) {
      const id = m[2];
      if (seen.has(id)) continue;
      const title = decodeEntities(m[3].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
      if (!title) continue;
      seen.add(id);
      let url = m[1];
      if (url.startsWith("/")) url = `https://${host}${url}`;
      out.push({
        id: `ic-${host}-${id}`,
        title,
        company: c.name,
        companyId: companyId(c),
        category: c.category ?? "",
        location: "",
        department: "",
        url,
        updatedAt: null,
        description: "",
        employmentType: "",
      });
    }
    if (out.length === before) break; // no new jobs on this page -> stop
  }
  return out;
}

/* ---------------- proprietary career sites (keyword search) -------------- *
 * Microsoft, Amazon, and Google are too large to fetch wholesale, so these
 * adapters query a small set of role keywords, paginate a little, then merge
 * + dedupe. Endpoints are public but undocumented — confirm at build time. */
const CUSTOM_QUERIES = [
  "product manager",
  "program manager",
  "product operations",
  "business analyst",
  "strategy and operations",
  "forward deployed",
];
const CUSTOM_MAX_PAGES = 2;

async function microsoft(c: CompanyConfig): Promise<Job[]> {
  const seen = new Set<string>();
  const out: Job[] = [];
  const perQuery = await Promise.all(
    CUSTOM_QUERIES.map(async (q) => {
      const found: Job[] = [];
      for (let pg = 1; pg <= CUSTOM_MAX_PAGES; pg++) {
        const data = await getJson(
          `https://gcsservices.careers.microsoft.com/search/api/v1/search?q=${encodeURIComponent(q)}&l=en_us&pg=${pg}&pgSz=20&o=Relevance&flt=true`
        );
        const jobs = data?.operationResult?.result?.jobs ?? [];
        if (jobs.length === 0) break;
        for (const j of jobs) {
          const id = j.jobId;
          if (!id) continue;
          const locs = j.properties?.locations;
          found.push({
            id: `ms-${id}`,
            title: j.title ?? "Untitled role",
            company: c.name,
            companyId: companyId(c),
            category: c.category ?? "",
            location: Array.isArray(locs) ? locs.join(", ") : (locs ?? j.properties?.primaryLocation ?? ""),
            department: "",
            url: `https://jobs.careers.microsoft.com/global/en/job/${id}`,
            updatedAt: j.postingDate ?? null,
            description: cleanDesc(j.properties?.description),
            employmentType: j.properties?.employmentType ?? "",
          });
        }
        if (jobs.length < 20) break;
      }
      return found;
    })
  );
  for (const list of perQuery)
    for (const j of list) {
      if (seen.has(j.id)) continue;
      seen.add(j.id);
      out.push(j);
    }
  return out;
}

async function amazon(c: CompanyConfig): Promise<Job[]> {
  const seen = new Set<string>();
  const out: Job[] = [];
  const perQuery = await Promise.all(
    CUSTOM_QUERIES.map(async (q) => {
      const found: Job[] = [];
      for (let pg = 0; pg < CUSTOM_MAX_PAGES; pg++) {
        const data = await getJson(
          `https://www.amazon.jobs/en/search.json?base_query=${encodeURIComponent(q)}&result_limit=100&offset=${pg * 100}&sort=recent`
        );
        const jobs = data.jobs ?? [];
        if (jobs.length === 0) break;
        for (const j of jobs) {
          const id = j.id_icims ?? j.job_path;
          if (!id) continue;
          let updatedAt: string | null = null;
          if (j.posted_date) {
            const d = Date.parse(j.posted_date);
            if (!Number.isNaN(d)) updatedAt = new Date(d).toISOString();
          }
          found.push({
            id: `amz-${id}`,
            title: j.title ?? "Untitled role",
            company: c.name,
            companyId: companyId(c),
            category: c.category ?? "",
            location: j.normalized_location ?? j.location ?? "",
            department: "",
            url: `https://www.amazon.jobs${j.job_path ?? ""}`,
            updatedAt,
            description: cleanDesc(j.description_short ?? j.description),
            employmentType: j.job_schedule_type ?? "",
          });
        }
        if (jobs.length < 100) break;
      }
      return found;
    })
  );
  for (const list of perQuery)
    for (const j of list) {
      if (seen.has(j.id)) continue;
      seen.add(j.id);
      out.push(j);
    }
  return out;
}

/* Google's v3 search API was retired; the current careers site is server-
 * rendered, so we parse job <li> blocks out of the results HTML. */
async function google(c: CompanyConfig): Promise<Job[]> {
  const seen = new Set<string>();
  const out: Job[] = [];
  for (const q of CUSTOM_QUERIES) {
    for (let page = 1; page <= CUSTOM_MAX_PAGES; page++) {
      const html = await getText(
        `https://www.google.com/about/careers/applications/jobs/results/?q=${encodeURIComponent(q)}&page=${page}`
      );
      const blocks = html.split('<li class="lLd3Je"').slice(1);
      if (blocks.length === 0) break;
      let added = 0;
      for (const b of blocks) {
        const id = (b.match(/ssk=.17:(\d+)./) ?? b.match(/jobs\/results\/(\d+)/))?.[1];
        if (!id || seen.has(id)) continue;
        const tm = b.match(/<h3[^>]*class="QJPWVe"[^>]*>([\s\S]*?)<\/h3>/);
        const title = tm ? decodeEntities(tm[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()) : "";
        if (!title) continue;
        const href = b.match(/jobs\/results\/(\d+-[^"'?\\ ]+)/)?.[1];
        const locs = [...b.matchAll(/<span class="r0wTof[^"]*">([^<]+)<\/span>/g)]
          .map((m) => decodeEntities(m[1].replace(/^;\s*/, "").trim()))
          .filter(Boolean);
        seen.add(id);
        added++;
        out.push({
          id: `goog-${id}`,
          title,
          company: c.name,
          companyId: companyId(c),
          category: c.category ?? "",
          location: locs.join("; "),
          department: "",
          url: `https://www.google.com/about/careers/applications/jobs/results/${href ?? id}`,
          updatedAt: null,
          description: "",
          employmentType: "",
        });
      }
      if (added === 0) break;
    }
  }
  return out;
}

const ADAPTERS: Record<ATS, (c: CompanyConfig) => Promise<Job[]>> = {
  greenhouse,
  lever,
  ashby,
  workday,
  smartrecruiters,
  gem,
  icims,
  microsoft,
  amazon,
  google,
};

/* --------------------------- aggregation -------------------------- */
export async function getBoard(): Promise<BoardData> {
  const settled = await Promise.allSettled(
    COMPANIES.map((c) => ADAPTERS[c.ats](c))
  );

  const jobs: Job[] = [];
  const sources: SourceStatus[] = [];

  settled.forEach((r, i) => {
    const c = COMPANIES[i];
    const base = {
      id: companyId(c),
      name: c.name,
      ats: c.ats,
      slug: c.slug,
      category: c.category ?? "",
    };
    if (r.status === "fulfilled") {
      jobs.push(...r.value);
      sources.push({ ...base, ok: true, count: r.value.length });
    } else {
      const msg = r.reason instanceof Error ? r.reason.message : "fetch failed";
      sources.push({ ...base, ok: false, count: 0, error: msg });
    }
  });

  jobs.sort((a, b) => {
    const ta = a.updatedAt ? Date.parse(a.updatedAt) : 0;
    const tb = b.updatedAt ? Date.parse(b.updatedAt) : 0;
    return tb - ta;
  });

  return { jobs, sources, fetchedAt: new Date().toISOString() };
}
