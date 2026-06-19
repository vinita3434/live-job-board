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

/* ----------------------------- adapters --------------------------- */
async function greenhouse(c: CompanyConfig): Promise<Job[]> {
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
    department: "",
    url: j.absolute_url,
    updatedAt: j.updated_at ?? null,
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
      });
    }
    if (items.length < limit) break;
    offset += limit;
  }
  return out;
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
      });
    }
    if (out.length === before) break; // no new jobs on this page -> stop
  }
  return out;
}

const ADAPTERS: Record<ATS, (c: CompanyConfig) => Promise<Job[]>> = {
  greenhouse,
  lever,
  ashby,
  workday,
  smartrecruiters,
  icims,
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
