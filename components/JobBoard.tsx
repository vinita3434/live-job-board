"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { BoardData, Job } from "@/lib/types";
import { CATEGORY_ORDER, SECTION_BLURB } from "@/lib/companies";
import { containsAny, isUS } from "@/lib/filter";

/* --------------------------- helpers ------------------------------ */
function relTime(iso: string | null): string {
  if (!iso) return "";
  const d = Date.parse(iso);
  if (Number.isNaN(d)) return "";
  const days = Math.floor((Date.now() - d) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  const m = Math.floor(days / 30);
  return m === 1 ? "1mo ago" : `${m}mo ago`;
}
function isNew(iso: string | null): boolean {
  if (!iso) return false;
  const d = Date.parse(iso);
  return !Number.isNaN(d) && Date.now() - d < 7 * 86400000;
}

/* Derive a seniority level from the title (ATS feeds rarely expose one). */
function levelFromTitle(title: string): string | null {
  const t = ` ${title.toLowerCase()} `;
  if (/\bintern(ship)?\b/.test(t)) return "Internship";
  if (/\b(new grad|graduate|entry[- ]level|junior|jr|associate|apprentice)\b/.test(t)) return "Entry-level";
  if (/\b(senior|sr|staff|principal|lead|director|head of|vp|vice president|chief)\b/.test(t)) return "Senior+";
  if (/\b(ii|iii|2|3|mid)\b/.test(t)) return "Mid-level";
  return null;
}

/* Pull an experience requirement out of the JD text if one is stated. */
function experienceFromDesc(desc: string): string | null {
  if (!desc) return null;
  const m =
    desc.match(/(\d+)\s*[-–to]+\s*(\d+)\+?\s*years?/i) ||
    desc.match(/(\d+)\+?\s*years?(?:\s+of)?(?:\s+(?:relevant|related|professional|industry))?\s+experience/i) ||
    desc.match(/(\d+)\+?\s*years?/i);
  if (!m) return null;
  if (m[2]) return `${m[1]}–${m[2]} yrs exp`;
  return `${m[1]}+ yrs exp`;
}

function linkedInUrl(j: Job): string {
  const q = encodeURIComponent(`${j.title} ${j.company}`);
  return `https://www.linkedin.com/jobs/search/?keywords=${q}`;
}

const PREFS_KEY = "goodput:prefs:v2";
const PROFILE_KEY = "goodput:profile";
const DEFAULT_PROFILE =
  "New-grad / early-career (0–4 years max). Targeting entry-level roles in: product management (PM/APM/Associate PM, product operations), program management, strategy & operations, business operations, business analyst / strategy analyst, AI strategy / AI strategist, AI transformation & strategy consulting, forward-deployed (FDE) / deployment strategist, and Chief of Staff. I thrive in creative, cross-functional roles where I can shape strategy and outshine early. Exclude anything requiring 5+ years or senior/lead/director titles, and engineering/sales roles.";

/* per-job analysis returned by /api/analyze */
interface Analysis {
  id: string;
  level: string;
  experience: string;
  fit: number;
  reason: string;
}

/* ============================= board ============================== */
export default function JobBoard({ initial }: { initial: BoardData }) {
  const [board, setBoard] = useState<BoardData>(initial);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [refineKw, setRefineKw] = useState<string[]>([]); // optional extra narrowing
  const [newOnly, setNewOnly] = useState(false);
  const [usOnly, setUsOnly] = useState(false);
  const [sort, setSort] = useState<"recent" | "company" | "title" | "fit">("recent");
  const [section, setSection] = useState<string | null>(null); // null = landing
  const [excluded, setExcluded] = useState<Record<string, boolean>>({});
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [kwDraft, setKwDraft] = useState("");
  // AI fit analysis
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [profileOpen, setProfileOpen] = useState(false);
  const [analysis, setAnalysis] = useState<Record<string, Analysis>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeErr, setAnalyzeErr] = useState("");
  const [strongOnly, setStrongOnly] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (Array.isArray(p.refineKw)) setRefineKw(p.refineKw);
        if (p.excluded) setExcluded(p.excluded);
        if (p.sort) setSort(p.sort);
        if (typeof p.usOnly === "boolean") setUsOnly(p.usOnly);
      }
      const prof = localStorage.getItem(PROFILE_KEY);
      if (prof) setProfile(prof);
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(PROFILE_KEY, profile); } catch {}
  }, [profile]);
  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ refineKw, excluded, sort, usOnly }));
    } catch {}
  }, [refineKw, excluded, sort, usOnly]);

  const refresh = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/jobs", { cache: "no-store" });
      if (res.ok) setBoard(await res.json());
    } catch {}
    setBusy(false);
  }, []);

  const okSources = board.sources.filter((s) => s.ok);
  const errSources = board.sources.filter((s) => !s.ok);

  // The server already pre-filtered to relevant roles; here we only apply the
  // user's optional narrowing: hidden companies, refine keywords, search, new.
  const baseFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return board.jobs.filter((j) => {
      if (excluded[j.companyId]) return false;
      if (refineKw.length && !containsAny(j.title, refineKw)) return false;
      if (usOnly && !isUS(j.location)) return false;
      if (newOnly && !isNew(j.updatedAt)) return false;
      if (q) {
        const hay = `${j.title} ${j.location} ${j.company} ${j.department} ${j.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [board.jobs, excluded, search, refineKw, newOnly, usOnly]);

  // per-section stats for the landing cards
  const sectionStats = useMemo(() => {
    const m: Record<string, { count: number; companies: Set<string> }> = {};
    for (const cat of CATEGORY_ORDER) m[cat] = { count: 0, companies: new Set() };
    baseFiltered.forEach((j) => {
      const s = m[j.category];
      if (s) { s.count++; s.companies.add(j.company); }
    });
    return m;
  }, [baseFiltered]);

  const rows = useMemo(() => {
    if (!section) return [];
    let out = baseFiltered.filter((j) => j.category === section);
    // "Strong fits only" turns the AI layer into a filter: keep roles the model
    // scored ≥ 60 (drops senior/off-function noise once a section is analyzed).
    if (strongOnly) out = out.filter((j) => (analysis[j.id]?.fit ?? -1) >= 60);
    out.sort((a, b) => {
      if (sort === "fit") {
        const fa = analysis[a.id]?.fit ?? -1;
        const fb = analysis[b.id]?.fit ?? -1;
        if (fb !== fa) return fb - fa;
      }
      if (sort === "company") return a.company.localeCompare(b.company) || a.title.localeCompare(b.title);
      if (sort === "title") return a.title.localeCompare(b.title);
      const ta = a.updatedAt ? Date.parse(a.updatedAt) : 0;
      const tb = b.updatedAt ? Date.parse(b.updatedAt) : 0;
      return tb - ta;
    });
    return out;
  }, [baseFiltered, section, sort, analysis, strongOnly]);

  const hasAnalysis = Object.keys(analysis).length > 0;

  // Score the visible roles for fit with Claude (Haiku), then sort by fit.
  const analyzeSection = useCallback(async () => {
    setAnalyzing(true);
    setAnalyzeErr("");
    try {
      const batch = rows.slice(0, 40).map((j) => ({
        id: j.id, title: j.title, company: j.company, location: j.location, description: j.description,
      }));
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, jobs: batch }),
      });
      const data = await res.json();
      if (!res.ok) { setAnalyzeErr(data.error || "Analysis failed."); }
      else {
        const add: Record<string, Analysis> = {};
        for (const r of data.results as Analysis[]) add[r.id] = r;
        setAnalysis((prev) => ({ ...prev, ...add }));
        setSort("fit");
      }
    } catch {
      setAnalyzeErr("Could not reach the analysis service.");
    }
    setAnalyzing(false);
  }, [rows, profile]);

  const addKw = () => {
    const k = kwDraft.trim().toLowerCase();
    if (k && !refineKw.includes(k)) setRefineKw([...refineKw, k]);
    setKwDraft("");
  };

  return (
    <div className="root">
      <header className="header">
        <button className="brand" onClick={() => setSection(null)} title="Back to sections">
          <span className="pulse" aria-hidden />
          <span className="word">goodput</span>
          <span className="sub">live PM &amp; strategy roles across your target stack</span>
        </button>
        <div className="head-right">
          <span className="meta">{okSources.length} sources · {baseFiltered.length} roles</span>
          <span className="stamp">synced {relTime(board.fetchedAt) === "today" ? "recently" : relTime(board.fetchedAt)}</span>
          <button className="btn btn-primary" onClick={refresh} disabled={busy}>
            {busy ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </header>
      <div className={`scan ${busy ? "on" : ""}`} aria-hidden />

      {/* breadcrumb */}
      <nav className="crumbs">
        <button className={`crumb ${!section ? "here" : ""}`} onClick={() => setSection(null)}>Sections</button>
        {section && <><span className="crumb-sep">/</span><span className="crumb here">{section}</span></>}
      </nav>

      {/* ---------- LANDING: four section cards ---------- */}
      {!section && (
        <section className="sections">
          {CATEGORY_ORDER.map((cat) => {
            const st = sectionStats[cat] || { count: 0, companies: new Set<string>() };
            const sample = Array.from(st.companies).slice(0, 5);
            return (
              <button key={cat} className="section-card" onClick={() => setSection(cat)}>
                <div className="sc-top">
                  <span className="sc-name">{cat}</span>
                  <span className="sc-count">{st.count}<i>roles</i></span>
                </div>
                <p className="sc-blurb">{SECTION_BLURB[cat] ?? ""}</p>
                <div className="sc-foot">
                  <span className="sc-cos">{st.companies.size} companies hiring</span>
                  {sample.length > 0 && <span className="sc-sample">{sample.join(" · ")}{st.companies.size > 5 ? " …" : ""}</span>}
                </div>
                <span className="sc-go" aria-hidden>→</span>
              </button>
            );
          })}
        </section>
      )}

      {/* ---------- SECTION DETAIL ---------- */}
      {section && (
        <>
          <section className="controls">
            <div className="search">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by title, location, or company"
                aria-label="Search roles"
              />
              {search && <button className="search-x" onClick={() => setSearch("")}>×</button>}
            </div>
            <button className={`toggle ${usOnly ? "on" : ""}`} onClick={() => setUsOnly((v) => !v)}>
              🇺🇸 US only
            </button>
            <button className={`toggle ${newOnly ? "on" : ""}`} onClick={() => setNewOnly((v) => !v)}>
              New · 7d
            </button>
            <label className="sortwrap">
              <select value={sort} onChange={(e) => setSort(e.target.value as any)} aria-label="Sort roles">
                <option value="recent">Recently posted</option>
                <option value="company">Company</option>
                <option value="title">Title A–Z</option>
                <option value="fit">Best fit</option>
              </select>
            </label>
            <button className="btn btn-ai" onClick={analyzeSection} disabled={analyzing || rows.length === 0}>
              {analyzing ? "Analyzing…" : "✨ Rank by fit"}
            </button>
            {hasAnalysis && (
              <button className={`toggle ${strongOnly ? "on" : ""}`} onClick={() => setStrongOnly((v) => !v)}>
                Strong fits only
              </button>
            )}
          </section>

          <div className="profile">
            <button className="profile-toggle" onClick={() => setProfileOpen((v) => !v)}>
              <span className={`caret ${profileOpen ? "open" : ""}`}>▸</span>
              Your profile <span className="profile-hint">— used to score fit</span>
            </button>
            {profileOpen && (
              <textarea
                className="profile-box"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                rows={3}
                placeholder="Describe your background, target roles, and seniority…"
              />
            )}
          </div>
          {analyzeErr && <div className="analyze-err">{analyzeErr}</div>}

          <div className="kw">
            <span className="kw-label">Refine:</span>
            {refineKw.map((k) => (
              <span key={k} className="kw-chip">
                {k}
                <button onClick={() => setRefineKw(refineKw.filter((x) => x !== k))} aria-label={`Remove ${k}`}>×</button>
              </span>
            ))}
            <input
              className="kw-input"
              value={kwDraft}
              onChange={(e) => setKwDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addKw(); }}
              onBlur={addKw}
              placeholder={refineKw.length ? "+ keyword" : "e.g. product manager"}
              aria-label="Add refine keyword"
            />
          </div>

          <div className="sources">
            <button className="sources-toggle" onClick={() => setSourcesOpen((v) => !v)}>
              <span className={`caret ${sourcesOpen ? "open" : ""}`}>▸</span>
              Sources · {okSources.length}/{board.sources.length} live
              {errSources.length > 0 && <span className="sources-err"> · {errSources.length} need a fix</span>}
            </button>
            {sourcesOpen && (
              <div className="sources-panel">
                {board.sources.filter((s) => s.category === section).map((s) => (
                  <button
                    key={s.id}
                    className={`chip ${excluded[s.id] ? "off" : ""}`}
                    onClick={() => setExcluded((e) => ({ ...e, [s.id]: !e[s.id] }))}
                    title={s.ok ? `${s.matched ?? 0} relevant of ${s.count} total — click to ${excluded[s.id] ? "show" : "hide"}` : s.error}
                  >
                    <span className={`dot ${s.ok ? "ok" : "err"}`} />
                    <span className="chip-name">{s.name}</span>
                    {s.ok
                      ? <span className="chip-count">{s.matched ?? 0}<i>/{s.count}</i></span>
                      : <span className="chip-err">{s.error}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <main className="cards">
            {rows.length === 0 ? (
              <div className="empty">
                <p className="empty-h">No roles match right now.</p>
                <p className="empty-p">Clear the search or refine keywords, or head back to another section.</p>
                <button className="btn" onClick={() => setSection(null)}>← All sections</button>
              </div>
            ) : (
              rows.map((j) => <JobCard key={j.id} j={j} a={analysis[j.id]} />)
            )}
          </main>
        </>
      )}

      <footer className="foot">
        Pulls public ATS endpoints server-side (Greenhouse · Lever · Ashby · SmartRecruiters · Workday · Gem · iCIMS)
        and pre-filters to PM / strategy / BizOps roles before they reach your browser. Curate companies and the
        include/exclude lists in <code>lib/companies.ts</code>. Level and experience are inferred from the title and JD.
      </footer>
    </div>
  );
}

/* ----------------------------- job card --------------------------- */
function fitClass(fit: number): string {
  if (fit >= 75) return "hi";
  if (fit >= 50) return "mid";
  return "lo";
}
function levelClass(l: string): string {
  const t = l.toLowerCase();
  if (t.includes("intern") || t.includes("entry")) return "lo";
  if (t.includes("mid")) return "mid";
  if (t.includes("senior") || t.includes("lead") || t.includes("+")) return "hi";
  return "mid";
}
function JobCard({ j, a }: { j: Job; a?: Analysis }) {
  const [open, setOpen] = useState(false);
  // Prefer Claude's read of level/experience when available; else heuristics.
  const level = a && a.level !== "Unclear" ? a.level : levelFromTitle(j.title);
  const exp = a && a.experience !== "not stated" ? a.experience : experienceFromDesc(j.description);
  const hasDesc = j.description.length > 0;
  const clamped = !open && j.description.length > 220;
  const shown = clamped ? j.description.slice(0, 220).replace(/\s+\S*$/, "") + "…" : j.description;

  return (
    <article className="card">
      <div className="card-head">
        <div className="card-id">
          <h3 className="card-title">{j.title}</h3>
          <div className="card-co">
            <span className="co-name">{j.company}</span>
            {j.location && <span className="co-loc">{j.location}</span>}
            {j.department && <span className="co-dept">{j.department}</span>}
          </div>
        </div>
        <div className="card-right">
          {a && <span className={`fit-pill ${fitClass(a.fit)}`}>{a.fit}<i>fit</i></span>}
          {j.updatedAt && (
            <span className={`card-age ${isNew(j.updatedAt) ? "fresh" : ""}`}>{relTime(j.updatedAt)}</span>
          )}
        </div>
      </div>

      <div className="badges">
        {level && <span className={`badge lvl ${levelClass(level)}`}>{level}</span>}
        {exp && <span className="badge exp">{exp}</span>}
        {j.employmentType && <span className="badge type">{j.employmentType}</span>}
        {!level && !exp && <span className="badge muted">level not stated</span>}
      </div>

      {a?.reason && <p className="fit-reason">{a.reason}</p>}

      {hasDesc ? (
        <p className="card-desc">
          {shown}{" "}
          {j.description.length > 220 && (
            <button className="more" onClick={() => setOpen((v) => !v)}>{open ? "less" : "more"}</button>
          )}
        </p>
      ) : (
        <p className="card-desc muted-desc">No summary in the feed — open the posting for the full description.</p>
      )}

      <div className="card-actions">
        <a className="btn btn-primary" href={j.url} target="_blank" rel="noopener noreferrer">Apply →</a>
        <a className="btn btn-ln" href={linkedInUrl(j)} target="_blank" rel="noopener noreferrer">in&nbsp;LinkedIn</a>
      </div>
    </article>
  );
}
