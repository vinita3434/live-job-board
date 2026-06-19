# goodput — live job board

A self-hosted job board that pulls roles **directly from company ATS career APIs**
(Greenhouse, Lever, Ashby) on the server, so there are no cross-origin limits and
no scraping. Curate your companies in one file and deploy to Vercel.

## What it does

- Fetches openings server-side from each company's public ATS endpoint
- Normalizes everything into one feed (title, company, category, location, posted date)
- Filters by role keywords (PM/BA by default), free-text search, and a "New · 7d" toggle
- Shows a per-source status light so a wrong slug is obvious and fixable
- Caches upstream responses for 30 min (configurable) to stay cheap and fast

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## Curate your companies

Edit **`lib/companies.ts`**. Each entry needs an `ats` and a `slug` — the
identifier in the company's careers URL:

| Careers URL pattern              | ats          |
|----------------------------------|--------------|
| `boards.greenhouse.io/SLUG`      | `greenhouse` |
| `jobs.lever.co/SLUG`             | `lever`      |
| `jobs.ashbyhq.com/SLUG`          | `ashby`      |

Open a company's real careers page to confirm the slug. The seeded slugs are
best-guesses — verify each one. Anything that doesn't resolve shows a red light
with the error, so you can correct it and redeploy.

Role keywords and cache duration are also in `lib/companies.ts`.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Framework preset auto-detects **Next.js**. No env vars needed. Click **Deploy**.

To refresh after editing the company list, commit and push — Vercel redeploys
automatically. The board also re-pulls live data on each request (with the 30-min
upstream cache).

## Add another ATS

Adapters live in `lib/ats.ts`. Each is a small function that hits an endpoint and
maps the response to the shared `Job` shape. Add a new key to the `ATS` type in
`lib/types.ts`, write an adapter, and register it in the `ADAPTERS` map.

## Notes

- `/api/jobs` returns the full board as JSON if you want it programmatically.
- Most AI-infra startups run on these three ATS platforms. Companies on Workday,
  SmartRecruiters, or custom career pages would need their own adapter.

## Workday companies (Big Tech)

Workday needs three values instead of a single slug. From a careers URL like
`salesforce.wd12.myworkdayjobs.com/External_Career_Site`:

- `host` = `salesforce.wd12.myworkdayjobs.com`
- `tenant` = `salesforce` (usually the subdomain)
- `site` = `External_Career_Site`

Salesforce is verified and working. ServiceNow is a starting guess — if it shows
red, open its real careers page and correct host/tenant/site. The data center code
(`wd1`, `wd5`, `wd12`, …) varies per company and must match exactly.

## Filters

- **Role filter** — keeps titles matching `ROLE_KEYWORDS` (PM, strategy, deployment, applied-AI).
- **≤ Mid-level** — hides senior/staff/principal/lead/director titles. It's a title
  heuristic, since ATS feeds don't expose years of experience.
- **New · 7d**, search, sort, and per-source show/hide are also available.

## Sections

Roles are grouped by the `category` field, ordered by `CATEGORY_ORDER` in
`lib/companies.ts`. Add a company with a new category and it shows up as a new section.

## SmartRecruiters companies

Some large companies (e.g. ServiceNow) run on SmartRecruiters, not Greenhouse/
Lever/Ashby/Workday. Those use `ats: "smartrecruiters"` with `slug` = the company
id in `careers.smartrecruiters.com/SLUG` (e.g. `ServiceNow`). The adapter pulls
from the public SmartRecruiters postings API.

## Verification status (June 2026)

Most slugs are marked `[VERIFIED]` against the live careers page. A handful are
still `[guess]` — Groq, SambaNova, Lambda, Snowflake, Cresta, Scale AI — so check
those status lights first and correct in `lib/companies.ts` if red. Notable fixes
already applied: Cerebras=`cerebrassystems`, Glean=`gleanwork`, Sourcegraph=
`sourcegraph91`, Fireworks=`fireworks.ai`, Anyscale=Lever, Writer=Ashby,
Hebbia=`hebbia-ai`, Sierra=`Sierra` (capital S), ServiceNow=SmartRecruiters.

## iCIMS companies (best-effort)

iCIMS has no public JSON API — career sites are server-rendered HTML, and the
official Search API requires a customer ID and auth. This adapter fetches the
in-iframe search page and parses job anchors. Caveats: it's the most fragile
adapter, returns no location or posting date, and markup can vary by tenant.

Config shape (note `icims.host`, not a slug):
```ts
{ name: "Acme", ats: "icims", slug: "acme", category: "Big Tech",
  icims: { host: "careers-acme.icims.com" } }
```
Find the host by opening the company's careers page — the URL will be something
like `careers-acme.icims.com` or `acme.icims.com`.

## Adapters supported

greenhouse · lever · ashby · smartrecruiters · workday · icims. The first four
are clean public JSON APIs (most reliable). Workday is JSON but needs host/tenant/
site. iCIMS is HTML-parsed and best-effort.

## Layout & filtering (current)

- **Section tabs** are the main navigation: All / AI Infra / Big Tech / B2B AI
  Startups / Frontier Labs. Click a tab to see only that section's roles. The
  per-company status lights now live in the collapsible **Sources** panel, so the
  top stays uncluttered even with 50+ companies.
- **Two keyword lists** in `lib/companies.ts`:
  - `ROLE_KEYWORDS` (include) — a role shows only if its title matches one.
  - `EXCLUDE_KEYWORDS` (always on) — drops a role if its title matches one, even
    if it matched an include keyword. This is what removes Senior/VP/Director and
    engineering titles (ML Engineer, Software Engineer, etc.) by default.
  Edit either list and redeploy to retune what surfaces.
