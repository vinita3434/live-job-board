"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { BoardData, Job } from "@/lib/types";
import { CATEGORY_ORDER, SECTION_BLURB } from "@/lib/companies";
import { containsAny } from "@/lib/filter";

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

/* ============================= board ============================== */
export default function JobBoard({ initial }: { initial: BoardData }) {
  const [board, setBoard] = useState<BoardData>(initial);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [refineKw, setRefineKw] = useState<string[]>([]); // optional extra narrowing
  const [newOnly, setNewOnly] = useState(false);
  const [sort, setSort] = useState<"recent" | "company" | "title">("recent");
  const [section, setSection] = useState<string | null>(null); // null = landing
  const [excluded, setExcluded] = useState<Record<string, boolean>>({});
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [kwDraft, setKwDraft] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (Array.isArray(p.refineKw)) setRefineKw(p.refineKw);
        if (p.excluded) setExcluded(p.excluded);
        if (p.sort) setSort(p.sort);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ refineKw, excluded, sort }));
    } catch {}
  }, [refineKw, excluded, sort]);

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
      if (newOnly && !isNew(j.updatedAt)) return false;
      if (q) {
        const hay = `${j.title} ${j.location} ${j.company} ${j.department} ${j.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [board.jobs, excluded, search, refineKw, newOnly]);

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
    const out = baseFiltered.filter((j) => j.category === section);
    out.sort((a, b) => {
      if (sort === "company") return a.company.localeCompare(b.company) || a.title.localeCompare(b.title);
      if (sort === "title") return a.title.localeCompare(b.title);
      const ta = a.updatedAt ? Date.parse(a.updatedAt) : 0;
      const tb = b.updatedAt ? Date.parse(b.updatedAt) : 0;
      return tb - ta;
    });
    return out;
  }, [baseFiltered, section, sort]);

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
            <button className={`toggle ${newOnly ? "on" : ""}`} onClick={() => setNewOnly((v) => !v)}>
              New · 7d
            </button>
            <label className="sortwrap">
              <select value={sort} onChange={(e) => setSort(e.target.value as any)} aria-label="Sort roles">
                <option value="recent">Recently posted</option>
                <option value="company">Company</option>
                <option value="title">Title A–Z</option>
              </select>
            </label>
          </section>

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
              rows.map((j) => <JobCard key={j.id} j={j} />)
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
function JobCard({ j }: { j: Job }) {
  const [open, setOpen] = useState(false);
  const level = levelFromTitle(j.title);
  const exp = experienceFromDesc(j.description);
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
        {j.updatedAt && (
          <span className={`card-age ${isNew(j.updatedAt) ? "fresh" : ""}`}>{relTime(j.updatedAt)}</span>
        )}
      </div>

      <div className="badges">
        {level && <span className={`badge lvl ${level === "Entry-level" || level === "Internship" ? "lo" : level === "Mid-level" ? "mid" : "hi"}`}>{level}</span>}
        {exp && <span className="badge exp">{exp}</span>}
        {j.employmentType && <span className="badge type">{j.employmentType}</span>}
        {!level && !exp && <span className="badge muted">level not stated</span>}
      </div>

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
