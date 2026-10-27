import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ResumeDocument } from "@/lib/pdf";
import { resumeSchema } from "@/lib/schemas";
import { boundedJson, guard } from "@/lib/security";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  const blocked = guard(req);
  if (blocked) return blocked;
  try {
    const resume = resumeSchema.parse(await boundedJson(req));
    const pdf = await renderToBuffer(ResumeDocument({ resume }));
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resumefit-resume.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "PDF export failed. Check the form and try again." },
      { status: 400 },
    );
  }
}
