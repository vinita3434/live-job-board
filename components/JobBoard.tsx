"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { BoardData, Job, SourceStatus } from "@/lib/types";
import { CATEGORY_ORDER, EXCLUDE_KEYWORDS } from "@/lib/companies";

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
function containsAny(title: string, list: string[]): boolean {
  const t = title.toLowerCase();
  return list.some((k) => {
    const kk = k.toLowerCase().trim();
    if (!kk) return false;
    if (kk.length <= 3) {
      const esc = kk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${esc}\\b`).test(t);
    }
    return t.includes(kk);
  });
}
function matchInclude(title: string, kws: string[], on: boolean): boolean {
  if (!on || kws.length === 0) return true;
  return containsAny(title, kws);
}

const PREFS_KEY = "goodput:prefs";
const ATS_LABEL: Record<string, string> = {
  greenhouse: "GH", lever: "LV", ashby: "AS", workday: "WD", smartrecruiters: "SR", icims: "IC",
};

/* ============================= board ============================== */
export default function JobBoard({
  initial,
  defaultKeywords,
}: {
  initial: BoardData;
  defaultKeywords: string[];
}) {
  const [board, setBoard] = useState<BoardData>(initial);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [keywords, setKeywords] = useState<string[]>(defaultKeywords);
  const [keywordOn, setKeywordOn] = useState(true);
  const [newOnly, setNewOnly] = useState(false);
  const [sort, setSort] = useState<"recent" | "company" | "title">("recent");
  const [section, setSection] = useState<string>("all");
  const [excluded, setExcluded] = useState<Record<string, boolean>>({});
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [kwDraft, setKwDraft] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (Array.isArray(p.keywords)) setKeywords(p.keywords);
        if (typeof p.keywordOn === "boolean") setKeywordOn(p.keywordOn);
        if (p.excluded) setExcluded(p.excluded);
        if (p.sort) setSort(p.sort);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ keywords, keywordOn, excluded, sort }));
    } catch {}
  }, [keywords, keywordOn, excluded, sort]);

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

  // include/exclude/search/new — everything except the section tab
  const baseFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return board.jobs.filter((j) => {
      if (excluded[j.companyId]) return false;
      if (!matchInclude(j.title, keywords, keywordOn)) return false;
      if (containsAny(j.title, EXCLUDE_KEYWORDS)) return false;
      if (newOnly && !isNew(j.updatedAt)) return false;
      if (q) {
        const hay = `${j.title} ${j.location} ${j.company} ${j.department} ${j.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [board.jobs, excluded, search, keywords, keywordOn, newOnly]);

  // per-section counts for the tab bar
  const sectionCounts = useMemo(() => {
    const m: Record<string, number> = {};
    baseFiltered.forEach((j) => { m[j.category] = (m[j.category] || 0) + 1; });
    return m;
  }, [baseFiltered]);

  const rows = useMemo(() => {
    let out = section === "all" ? baseFiltered : baseFiltered.filter((j) => j.category === section);
    out = [...out].sort((a, b) => {
      if (sort === "company") return a.company.localeCompare(b.company) || a.title.localeCompare(b.title);
      if (sort === "title") return a.title.localeCompare(b.title);
      const ta = a.updatedAt ? Date.parse(a.updatedAt) : 0;
      const tb = b.updatedAt ? Date.parse(b.updatedAt) : 0;
      return tb - ta;
    });
    return out;
  }, [baseFiltered, section, sort]);

  const groups = useMemo(() => {
    if (section !== "all") return [{ cat: section, items: rows }];
    const present = Array.from(new Set(rows.map((r) => r.category || "Other")));
    const order = [...CATEGORY_ORDER, ...present.filter((c) => !CATEGORY_ORDER.includes(c))];
    return order
      .map((cat) => ({ cat, items: rows.filter((r) => (r.category || "Other") === cat) }))
      .filter((g) => g.items.length > 0);
  }, [rows, section]);

  const addKw = () => {
    const k = kwDraft.trim().toLowerCase();
    if (k && !keywords.includes(k)) setKeywords([...keywords, k]);
    setKwDraft("");
  };

  const tabs = ["all", ...CATEGORY_ORDER];

  return (
    <div className="root">
      <header className="header">
        <div className="brand">
          <span className="pulse" aria-hidden />
          <span className="word">goodput</span>
          <span className="sub">live roles across your target stack</span>
        </div>
        <div className="head-right">
          <span className="meta">{okSources.length} sources · {rows.length} roles</span>
          <span className="stamp">synced {relTime(board.fetchedAt) === "today" ? "recently" : relTime(board.fetchedAt)}</span>
          <button className="btn btn-primary" onClick={refresh} disabled={busy}>
            {busy ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </header>
      <div className={`scan ${busy ? "on" : ""}`} aria-hidden />

      {/* section tabs — the primary navigation */}
      <nav className="tabs">
        {tabs.map((t) => {
          const count = t === "all" ? baseFiltered.length : (sectionCounts[t] || 0);
          return (
            <button
              key={t}
              className={`tab ${section === t ? "on" : ""}`}
              onClick={() => setSection(t)}
            >
              {t === "all" ? "All roles" : t}
              <span className="tab-count">{count}</span>
            </button>
          );
        })}
      </nav>

      {/* controls */}
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
        <button className={`toggle ${keywordOn ? "on" : ""}`} onClick={() => setKeywordOn((v) => !v)}>
          Role filter {keywordOn ? "on" : "off"}
        </button>
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

      {keywordOn && (
        <div className="kw">
          {keywords.map((k) => (
            <span key={k} className="kw-chip">
              {k}
              <button onClick={() => setKeywords(keywords.filter((x) => x !== k))} aria-label={`Remove ${k}`}>×</button>
            </span>
          ))}
          <input
            className="kw-input"
            value={kwDraft}
            onChange={(e) => setKwDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addKw(); }}
            onBlur={addKw}
            placeholder="+ keyword"
            aria-label="Add keyword"
          />
        </div>
      )}

      {/* collapsible sources panel — keeps the company clutter out of the way */}
      <div className="sources">
        <button className="sources-toggle" onClick={() => setSourcesOpen((v) => !v)}>
          <span className={`caret ${sourcesOpen ? "open" : ""}`}>▸</span>
          Sources · {okSources.length}/{board.sources.length} live
          {errSources.length > 0 && <span className="sources-err"> · {errSources.length} need a fix</span>}
        </button>
        {sourcesOpen && (
          <div className="sources-panel">
            {board.sources.map((s) => (
              <button
                key={s.id}
                className={`chip ${excluded[s.id] ? "off" : ""}`}
                onClick={() => setExcluded((e) => ({ ...e, [s.id]: !e[s.id] }))}
                title={excluded[s.id] ? "Show roles" : "Hide roles"}
              >
                <span className={`dot ${s.ok ? "ok" : "err"}`} />
                <span className="chip-name">{s.name}</span>
                <span className="chip-tag">{ATS_LABEL[s.ats]}·{s.slug}</span>
                {s.ok ? <span className="chip-count">{s.count}</span> : <span className="chip-err">{s.error}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* list */}
      <main className="list">
        {rows.length === 0 ? (
          <div className="empty">
            <p className="empty-h">No roles match right now.</p>
            <p className="empty-p">
              {okSources.length > 0
                ? "Try another section, clear the search, or turn off the role filter."
                : "No sources resolved. Open Sources to see which slugs need fixing."}
            </p>
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.cat} className="group">
              {section === "all" && (
                <div className="group-head">
                  <span className="group-name">{g.cat}</span>
                  <span className="group-count">{g.items.length}</span>
                </div>
              )}
              {g.items.map((j) => <Row key={j.id} j={j} />)}
            </section>
          ))
        )}
      </main>

      <footer className="foot">
        Pulls public ATS endpoints server-side (Greenhouse · Lever · Ashby · SmartRecruiters · Workday · iCIMS).
        Curate companies, sections, and the role include/exclude lists in <code>lib/companies.ts</code>, then redeploy.
        Senior, VP, and engineering titles are filtered out by default.
      </footer>
    </div>
  );
}

function Row({ j }: { j: Job }) {
  return (
    <a className="row" href={j.url} target="_blank" rel="noopener noreferrer">
      <div className="row-main">
        <div className="row-title">
          {j.title}
          {isNew(j.updatedAt) && <span className="new">new</span>}
        </div>
        <div className="row-meta">
          <span className="row-co">{j.company}</span>
          {j.location && <span>{j.location}</span>}
          {j.department && <span className="row-dept">{j.department}</span>}
        </div>
      </div>
      {j.updatedAt && <span className="row-time">{relTime(j.updatedAt)}</span>}
    </a>
  );
}
