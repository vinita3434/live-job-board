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
