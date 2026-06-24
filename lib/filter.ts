/* Shared role-matching logic used on BOTH the server (to pre-filter the board
 * before it ships to the client) and the client (to refine within a section).
 * Keeping it in one place means both sides agree on what "matches". */

/** Case-insensitive substring match; short keywords (≤3 chars) match on word
 * boundaries so "sr"/"ii"/"vp" don't false-positive inside other words. */
export function containsAny(title: string, list: string[]): boolean {
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

/** A role is "relevant" if its title matches an include keyword and none of the
 * exclude keywords (seniority + non-PM titles). This is the board-wide gate. */
export function isRelevantRole(title: string, include: string[], exclude: string[]): boolean {
  return containsAny(title, include) && !containsAny(title, exclude);
}

const US_ABBR = new Set([
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS",
  "KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
  "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV",
  "WI","WY","DC",
]);
// State full names (Georgia omitted — collides with the country).
const US_STATE_NAMES = [
  "alabama","alaska","arizona","arkansas","california","colorado","connecticut",
  "delaware","florida","hawaii","idaho","illinois","indiana","iowa","kansas",
  "kentucky","louisiana","maryland","massachusetts","michigan","minnesota",
  "mississippi","missouri","montana","nebraska","nevada","new hampshire",
  "new jersey","new mexico","new york","north carolina","north dakota","ohio",
  "oklahoma","oregon","pennsylvania","rhode island","south carolina","south dakota",
  "tennessee","texas","utah","vermont","virginia","washington","west virginia",
  "wisconsin","wyoming","district of columbia",
];

/** Best-effort: does this location string look US-based? Handles "United States",
 * "USA", "US-CA-…" (Ashby), "City, ST", "Remote - US", full state names, etc.
 * Empty/ambiguous locations return false (US-only is a strict filter). */
export function isUS(location: string): boolean {
  if (!location) return false;
  const t = location.toLowerCase();
  if (t.includes("united states") || t.includes("u.s.") || /\busa?\b/.test(t)) return true;
  if (US_STATE_NAMES.some((s) => t.includes(s))) return true;
  // 2-letter uppercase state codes as standalone tokens ("San Francisco, CA", "US-NY-NYC")
  const codes = location.match(/\b[A-Z]{2}\b/g) || [];
  return codes.some((c) => US_ABBR.has(c));
}
