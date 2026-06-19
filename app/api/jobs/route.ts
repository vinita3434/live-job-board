import { NextResponse } from "next/server";
import { getBoard } from "@/lib/ats";

// Render on demand; upstream fetches are still cached via REVALIDATE_SECONDS.
export const dynamic = "force-dynamic";

export async function GET() {
  const board = await getBoard();
  return NextResponse.json(board, {
    headers: { "Cache-Control": "no-store" },
  });
}
