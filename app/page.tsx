import { getBoard } from "@/lib/ats";
import { ROLE_KEYWORDS } from "@/lib/companies";
import JobBoard from "@/components/JobBoard";

// Render per request on Vercel; per-source responses stay cached.
export const dynamic = "force-dynamic";

export default async function Page() {
  let board;
  try {
    board = await getBoard();
  } catch {
    board = { jobs: [], sources: [], fetchedAt: new Date().toISOString() };
  }
  return <JobBoard initial={board} defaultKeywords={ROLE_KEYWORDS} />;
}
