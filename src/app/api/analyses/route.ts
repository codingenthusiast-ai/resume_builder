import { NextRequest, NextResponse } from "next/server";
import { analysisInput } from "@/lib/schemas";
import { buildReport, extractFindings } from "@/lib/analysis/engine";
import { analyzeEvidence } from "@/lib/analysis/provider";
import { guard, boundedJson, privateHeaders } from "@/lib/security";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  const blocked = guard(req, 10);
  if (blocked) return blocked;
  try {
    const raw = await boundedJson(req);
    const input = analysisInput.parse(raw);
    const result = raw.keywordOnly
      ? { findings: extractFindings(input), provider: "keyword" as const }
      : await analyzeEvidence(input);
    return NextResponse.json(
      buildReport(input, result.findings, result.provider),
      { headers: privateHeaders },
    );
  } catch (error) {
    const invalid =
      error instanceof Error &&
      (error.name === "ZodError" ||
        error instanceof SyntaxError ||
        /body/i.test(error.message));
    return NextResponse.json(
      {
        error: invalid
          ? "Check your inputs: resume and job text are required and must stay within the displayed limits."
          : "Analysis could not finish. Retry, or select keyword analysis. No report was saved.",
      },
      { status: invalid ? 400 : 502, headers: privateHeaders },
    );
  }
}
